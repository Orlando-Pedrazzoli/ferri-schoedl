// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { Types } from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';
import Customer from '@/models/Customer';
import Book from '@/models/Book';
import Course from '@/models/Course';
import { stripe, SITE_URL } from '@/lib/stripe';
import { calcularFreteReal } from '@/lib/shipping';
import { generateSetupToken } from '@/lib/setup-token';

export const runtime = 'nodejs';

type ItemFormat = 'physical' | 'ebook' | 'course';

interface CheckoutBody {
  items: Array<{ slug: string; quantity: number; format: ItemFormat }>;
  shipping?: {
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
}

function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}
function toCents(value: number): number {
  return Math.round(value * 100);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Autenticação necessária.' },
        { status: 401 },
      );
    }
    const customerId = session.user.id;

    await dbConnect();
    const body: CheckoutBody = await request.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado.' },
        { status: 404 },
      );
    }

    // Verificação de email desativada — compra liberada sem confirmação.

    const hasPhysical = body.items.some(i => i.format === 'physical');

    // Buscar produtos do banco
    const bookSlugs = body.items
      .filter(i => i.format !== 'course')
      .map(i => i.slug);
    const courseSlugs = body.items
      .filter(i => i.format === 'course')
      .map(i => i.slug);

    const books = bookSlugs.length
      ? await Book.find({ slug: { $in: bookSlugs }, isActive: true })
      : [];
    const courses = courseSlugs.length
      ? await Course.find({
          slug: { $in: courseSlugs },
          isActive: true,
          status: 'publicado',
        })
      : [];

    // Validar e montar itens + line items do Stripe
    const orderItems: IOrderItem[] = [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const ci of body.items) {
      if (ci.format === 'course') {
        const course = courses.find(c => c.slug === ci.slug);
        if (!course) {
          return NextResponse.json(
            { error: `Curso indisponível: ${ci.slug}` },
            { status: 400 },
          );
        }
        orderItems.push({
          type: 'course',
          courseId: course._id as Types.ObjectId,
          slug: course.slug,
          title: course.title,
          price: course.price,
          quantity: 1,
          weight: 0,
        });
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: 'brl',
            unit_amount: toCents(course.price),
            product_data: {
              name: `${course.title} (Curso online)`,
              ...(course.image ? { images: [course.image] } : {}),
            },
          },
        });
      } else {
        const book = books.find(b => b.slug === ci.slug);
        if (!book) {
          return NextResponse.json(
            { error: `Produto indisponível: ${ci.slug}` },
            { status: 400 },
          );
        }

        if (ci.format === 'physical') {
          if (book.saleType !== 'direto') {
            return NextResponse.json(
              {
                error: `"${book.title}" não está disponível para venda direta.`,
              },
              { status: 400 },
            );
          }
          if (!book.inStock) {
            return NextResponse.json(
              { error: `"${book.title}" está fora de estoque.` },
              { status: 400 },
            );
          }
          orderItems.push({
            type: 'physical',
            bookId: book._id as Types.ObjectId,
            slug: book.slug,
            title: book.title,
            price: book.price,
            quantity: ci.quantity,
            weight: book.weight,
          });
          lineItems.push({
            quantity: ci.quantity,
            price_data: {
              currency: 'brl',
              unit_amount: toCents(book.price),
              product_data: {
                name: book.title,
                ...(book.image ? { images: [book.image] } : {}),
              },
            },
          });
        } else {
          // ebook
          if (!book.hasEbook) {
            return NextResponse.json(
              { error: `"${book.title}" não está disponível em eBook.` },
              { status: 400 },
            );
          }
          orderItems.push({
            type: 'ebook',
            bookId: book._id as Types.ObjectId,
            slug: book.slug,
            title: book.title,
            price: book.price,
            quantity: 1,
            weight: 0,
          });
          lineItems.push({
            quantity: 1,
            price_data: {
              currency: 'brl',
              unit_amount: toCents(book.price),
              product_data: {
                name: `${book.title} (eBook)`,
                ...(book.image ? { images: [book.image] } : {}),
              },
            },
          });
        }
      }
    }

    const subtotal = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    // Frete: somente quando há item físico
    let shippingPrice = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shippingDoc: any = undefined;

    if (hasPhysical) {
      if (!body.shipping || !['PAC', 'SEDEX'].includes(body.shipping.method)) {
        return NextResponse.json(
          { error: 'Selecione o método de envio.' },
          { status: 400 },
        );
      }
      const totalWeight = orderItems.reduce(
        (sum, i) => (i.type === 'physical' ? sum + i.weight * i.quantity : sum),
        0,
      );
      const cep = cleanCep(body.shipping.address.cep);
      const opcoes = calcularFreteReal(cep, totalWeight);
      const sel = opcoes.find(f => f.method === body.shipping!.method);
      if (!sel) {
        return NextResponse.json(
          { error: 'Não foi possível calcular o frete para este CEP.' },
          { status: 400 },
        );
      }
      shippingPrice = sel.price;
      const addr = body.shipping.address;
      shippingDoc = {
        method: body.shipping.method,
        price: sel.price,
        estimatedDays: sel.days,
        address: {
          street: addr.street,
          number: addr.number,
          complement: addr.complement || '',
          neighborhood: addr.neighborhood,
          city: addr.city,
          state: addr.state.toUpperCase(),
          cep,
        },
      };

      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'brl',
          unit_amount: toCents(sel.price),
          product_data: { name: `Frete (${body.shipping.method})` },
        },
      });
    }

    const total = subtotal + shippingPrice;

    // Criar pedido pendente
    const order = new Order({
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCpf: customer.cpf,
      customerPhone: customer.phone,
      items: orderItems,
      subtotal,
      shipping: shippingDoc,
      total,
      payment: { method: 'card', status: 'pending' },
      status: 'pendente',
    });
    await order.save();

    // URL de sucesso (com setupToken se o cliente ainda não tem senha)
    let successUrl = `${SITE_URL}/pedido/${order.orderCode}?session_id={CHECKOUT_SESSION_ID}`;
    if (!customer.hasPassword) {
      const setupToken = generateSetupToken(
        customer._id.toString(),
        order.orderCode,
      );
      successUrl += `&setup=${setupToken}`;
    }

    // Criar Checkout Session (somente cartão)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'pt-BR',
      line_items: lineItems,
      customer_email: customer.email,
      client_reference_id: order.orderCode,
      metadata: {
        orderId: order._id.toString(),
        orderCode: order.orderCode,
      },
      success_url: successUrl,
      cancel_url: `${SITE_URL}/checkout?canceled=1`,
    });

    order.payment.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json(
      { url: checkoutSession.url, orderCode: order.orderCode },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Checkout] Erro:', error);
    const message =
      error instanceof Error ? error.message : 'Erro interno do servidor.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
