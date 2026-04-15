import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import Book from '@/models/Book';
import { sendOrderConfirmation } from '@/lib/resend';
import { calcularFreteReal } from '@/lib/shipping';

// --- Helpers ---

function toAmountCents(value: number): number {
  return Math.round(value * 100);
}

function cleanCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function parsePhone(phone: string): {
  country_code: string;
  area_code: string;
  number: string;
} {
  const digits = cleanPhone(phone);
  if (digits.length >= 12) {
    return {
      country_code: digits.slice(0, 2),
      area_code: digits.slice(2, 4),
      number: digits.slice(4),
    };
  }
  if (digits.length >= 10) {
    return {
      country_code: '55',
      area_code: digits.slice(0, 2),
      number: digits.slice(2),
    };
  }
  return {
    country_code: '55',
    area_code: '11',
    number: digits,
  };
}

function buildPagarmeAuth(): string {
  const sk = process.env.PAGARME_SECRET_KEY;
  if (!sk) throw new Error('PAGARME_SECRET_KEY nao configurada');
  return 'Basic ' + Buffer.from(`${sk}:`).toString('base64');
}

// --- Validacao do body ---

interface CheckoutBody {
  customerId: string;
  items: Array<{
    slug: string;
    quantity: number;
  }>;
  shipping: {
    method: 'PAC' | 'SEDEX';
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
    };
  };
  payment: {
    method: 'credit_card' | 'boleto' | 'pix';
    card?: {
      number: string;
      holderName: string;
      expMonth: number;
      expYear: number;
      cvv: string;
      installments: number;
    };
  };
}

// --- POST /api/checkout ---

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: CheckoutBody = await request.json();

    // 1. Validacoes basicas
    if (
      !body.customerId ||
      !body.items?.length ||
      !body.shipping ||
      !body.payment
    ) {
      return NextResponse.json(
        { error: 'Dados incompletos. Preencha todos os campos obrigatorios.' },
        { status: 400 },
      );
    }

    if (!['PAC', 'SEDEX'].includes(body.shipping.method)) {
      return NextResponse.json(
        { error: 'Metodo de envio invalido.' },
        { status: 400 },
      );
    }

    if (!['credit_card', 'boleto', 'pix'].includes(body.payment.method)) {
      return NextResponse.json(
        { error: 'Metodo de pagamento invalido.' },
        { status: 400 },
      );
    }

    if (body.payment.method === 'credit_card' && !body.payment.card) {
      return NextResponse.json(
        { error: 'Dados do cartao sao obrigatorios.' },
        { status: 400 },
      );
    }

    // 2. Buscar customer
    const customer = await Customer.findById(body.customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente nao encontrado.' },
        { status: 404 },
      );
    }

    if (!customer.emailVerified) {
      return NextResponse.json(
        {
          error: 'Email nao verificado. Verifique seu email antes de comprar.',
        },
        { status: 403 },
      );
    }

    // 3. Buscar livros e validar estoque/precos
    const bookSlugs = body.items.map(i => i.slug);
    const books = await Book.find({
      slug: { $in: bookSlugs },
      isActive: true,
      saleType: 'direto',
    });

    if (books.length !== bookSlugs.length) {
      return NextResponse.json(
        {
          error: 'Um ou mais livros nao estao disponiveis para venda directa.',
        },
        { status: 400 },
      );
    }

    const orderItems = body.items.map(cartItem => {
      const book = books.find(b => b.slug === cartItem.slug);
      if (!book) throw new Error(`Livro ${cartItem.slug} nao encontrado`);
      if (!book.inStock)
        throw new Error(`Livro "${book.title}" fora de estoque`);

      return {
        bookId: book._id,
        slug: book.slug,
        title: book.title,
        price: book.price,
        quantity: cartItem.quantity,
        weight: book.weight,
      };
    });

    // 4. Calcular totais com frete real por regiao
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalWeight = orderItems.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0,
    );

    const cepDestino = cleanCep(body.shipping.address.cep);
    const freteOpcoes = calcularFreteReal(cepDestino, totalWeight);
    const freteSelecionado = freteOpcoes.find(
      f => f.method === body.shipping.method,
    );

    if (!freteSelecionado) {
      return NextResponse.json(
        { error: 'Nao foi possivel calcular o frete para este CEP.' },
        { status: 400 },
      );
    }

    const total = subtotal + freteSelecionado.price;

    // 5. Criar order no MongoDB (status pendente)
    const order = new Order({
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCpf: customer.cpf,
      customerPhone: customer.phone,
      items: orderItems,
      subtotal,
      shipping: {
        method: body.shipping.method,
        price: freteSelecionado.price,
        estimatedDays: freteSelecionado.days,
        address: {
          street: body.shipping.address.street,
          number: body.shipping.address.number,
          complement: body.shipping.address.complement || '',
          neighborhood: body.shipping.address.neighborhood,
          city: body.shipping.address.city,
          state: body.shipping.address.state.toUpperCase(),
          cep: cepDestino,
        },
      },
      total,
      payment: {
        method: body.payment.method,
        status: 'pending',
        installments:
          body.payment.method === 'credit_card'
            ? body.payment.card?.installments || 1
            : 1,
      },
      status: 'pendente',
    });

    await order.save();

    // 6. Montar payload Pagar.me V5
    const phone = parsePhone(customer.phone);
    const shippingAddr = body.shipping.address;

    const pagarmeItems = orderItems.map(item => ({
      amount: toAmountCents(item.price),
      description: item.title,
      quantity: item.quantity,
      code: item.slug,
    }));

    const pagarmeCustomer = {
      name: customer.name,
      email: customer.email,
      type: 'individual' as const,
      document: cleanCpf(customer.cpf),
      document_type: 'CPF',
      phones: {
        mobile_phone: {
          country_code: phone.country_code,
          area_code: phone.area_code,
          number: phone.number,
        },
      },
      address: {
        country: 'BR',
        state: shippingAddr.state.toUpperCase(),
        city: shippingAddr.city,
        zip_code: cepDestino,
        line_1: `${shippingAddr.number}, ${shippingAddr.street}, ${shippingAddr.neighborhood}`,
        line_2: shippingAddr.complement || '',
      },
    };

    const pagarmeShipping = {
      amount: toAmountCents(freteSelecionado.price),
      description: `Envio ${body.shipping.method}`,
      recipient_name: customer.name,
      recipient_phone: cleanPhone(customer.phone),
      address: {
        country: 'BR',
        state: shippingAddr.state.toUpperCase(),
        city: shippingAddr.city,
        zip_code: cepDestino,
        line_1: `${shippingAddr.number}, ${shippingAddr.street}, ${shippingAddr.neighborhood}`,
        line_2: shippingAddr.complement || '',
      },
    };

    // Montar payment conforme metodo
    const totalCents = toAmountCents(total);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pagarmePayment: Record<string, any>;

    if (body.payment.method === 'credit_card') {
      const card = body.payment.card!;
      pagarmePayment = {
        payment_method: 'credit_card',
        credit_card: {
          installments: card.installments || 1,
          statement_descriptor: 'FERRISCHOEDL',
          card: {
            number: card.number.replace(/\s/g, ''),
            holder_name: card.holderName.toUpperCase(),
            exp_month: card.expMonth,
            exp_year: card.expYear,
            cvv: card.cvv,
            billing_address: {
              country: 'BR',
              state: shippingAddr.state.toUpperCase(),
              city: shippingAddr.city,
              zip_code: cepDestino,
              line_1: `${shippingAddr.number}, ${shippingAddr.street}, ${shippingAddr.neighborhood}`,
              line_2: shippingAddr.complement || '',
            },
          },
        },
      };
    } else if (body.payment.method === 'boleto') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      pagarmePayment = {
        payment_method: 'boleto',
        boleto: {
          instructions:
            'Pagamento referente a compra de livros - Ferri Schoedl Advocacia',
          due_at: dueDate.toISOString(),
        },
      };
    } else {
      pagarmePayment = {
        payment_method: 'pix',
        pix: {
          expires_in: 3600,
        },
      };
    }

    const pagarmeOrderPayload = {
      code: order.orderCode,
      closed: true,
      items: pagarmeItems,
      customer: pagarmeCustomer,
      shipping: pagarmeShipping,
      payments: [
        {
          ...pagarmePayment,
          amount: totalCents,
        },
      ],
    };

    // 7. Enviar para Pagar.me V5
    const pagarmeResponse = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        Authorization: buildPagarmeAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagarmeOrderPayload),
    });

    const pagarmeData = await pagarmeResponse.json();

    if (!pagarmeResponse.ok) {
      console.error(
        '[Checkout] Pagar.me erro:',
        JSON.stringify(pagarmeData, null, 2),
      );
      order.payment.status = 'failed';
      order.status = 'falhou';
      await order.save();

      return NextResponse.json(
        {
          error: 'Erro ao processar pagamento. Tente novamente.',
          details:
            pagarmeData.message || pagarmeData.errors || 'Erro desconhecido',
        },
        { status: 400 },
      );
    }

    // 8. Atualizar order com dados do Pagar.me
    order.payment.pagarmeOrderId = pagarmeData.id;

    const charge = pagarmeData.charges?.[0];
    if (charge) {
      order.payment.pagarmeChargeId = charge.id;
      const lastTx = charge.last_transaction;

      if (body.payment.method === 'credit_card') {
        order.payment.cardLastDigits = lastTx?.card?.last_four_digits || '';
        order.payment.cardBrand = lastTx?.card?.brand || '';
        if (pagarmeData.status === 'paid') {
          order.payment.status = 'paid';
          order.payment.paidAt = new Date();
          order.status = 'pago';
        }
      } else if (body.payment.method === 'boleto') {
        order.payment.boletoUrl = lastTx?.url || lastTx?.pdf || '';
        order.payment.boletoBarcode = lastTx?.line || lastTx?.barcode || '';
        if (lastTx?.due_at) {
          order.payment.boletoDueDate = new Date(lastTx.due_at);
        }
      } else if (body.payment.method === 'pix') {
        order.payment.pixQrCode = lastTx?.qr_code || '';
        order.payment.pixQrCodeUrl = lastTx?.qr_code_url || '';
        if (lastTx?.expires_at) {
          order.payment.pixExpiresAt = new Date(lastTx.expires_at);
        }
      }
    }

    await order.save();

    // 9. Se cartao e ja pago, enviar email de confirmacao
    if (order.status === 'pago') {
      await sendOrderConfirmation(
        customer.email,
        customer.name,
        order.orderCode,
        orderItems.map(i => ({
          title: i.title,
          quantity: i.quantity,
          price: i.price,
        })),
        total,
      ).catch(err => console.error('[Checkout] Erro ao enviar email:', err));

      await Customer.findByIdAndUpdate(customer._id, {
        $push: { orders: order._id },
      });
    }

    // 10. Retornar resposta
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData: Record<string, any> = {
      success: true,
      orderCode: order.orderCode,
      status: order.status,
      paymentMethod: body.payment.method,
      total,
    };

    if (body.payment.method === 'boleto') {
      responseData.boletoUrl = order.payment.boletoUrl;
      responseData.boletoBarcode = order.payment.boletoBarcode;
      responseData.boletoDueDate = order.payment.boletoDueDate;
    } else if (body.payment.method === 'pix') {
      responseData.pixQrCode = order.payment.pixQrCode;
      responseData.pixQrCodeUrl = order.payment.pixQrCodeUrl;
      responseData.pixExpiresAt = order.payment.pixExpiresAt;
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('[Checkout] Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
