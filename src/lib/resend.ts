import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

const FROM_EMAIL = 'Ferri Schoedl <onboarding@resend.dev>';
const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Envia email de verificação de conta (registo)
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${SITE_URL}/api/auth/verify-email?token=${token}`;

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Verifique seu email — Ferri Schoedl Advocacia',
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfbf7; color: #0a1628;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0a1628; margin: 0;">Ferri Schoedl Advocacia</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Olá <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Obrigado por se registar na nossa loja. Para activar a sua conta, clique no botão abaixo:
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background-color: #b8860b; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
              Verificar email
            </a>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="font-size: 13px; word-break: break-all; color: #6b7280;">
            ${verificationUrl}
          </p>
          
          <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
            Este link expira em 24 horas. Se não solicitou este registo, ignore este email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Ferri Schoedl Advocacia — OAB/SP 196.377<br />
            Av. Queiroz Filho, 1.700 — Sala 211D — Vila Leopoldina — São Paulo/SP
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Erro ao enviar verificação:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Resend] Erro inesperado:', err);
    return { success: false, error: 'Erro ao enviar email' };
  }
}

/**
 * Envia código OTP para verificação no checkout
 */
export async function sendOTP(
  to: string,
  name: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${code} — Código de verificação`,
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfbf7; color: #0a1628;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0a1628; margin: 0;">Ferri Schoedl Advocacia</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Olá <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Use o código abaixo para confirmar o seu pedido:
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; background-color: #0a1628; color: #ffffff; padding: 16px 40px; font-size: 32px; font-weight: 700; letter-spacing: 8px; border-radius: 8px; font-family: monospace;">
              ${code}
            </span>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
            Este código expira em 10 minutos. Se não solicitou este código, ignore este email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Ferri Schoedl Advocacia — OAB/SP 196.377
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Erro ao enviar OTP:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Resend] Erro inesperado:', err);
    return { success: false, error: 'Erro ao enviar email' };
  }
}

/**
 * Envia confirmação de pedido (pagamento aprovado)
 */
export async function sendOrderConfirmation(
  to: string,
  name: string,
  orderCode: string,
  items: Array<{ title: string; quantity: number; price: number }>,
  total: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const itemsHtml = items
      .map(
        item => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido ${orderCode} confirmado — Ferri Schoedl Advocacia`,
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfbf7; color: #0a1628;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0a1628; margin: 0;">Ferri Schoedl Advocacia</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Olá <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Seu pedido <strong>${orderCode}</strong> foi confirmado com sucesso!
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 2px solid #0a1628;">
                <th style="padding: 8px 0; text-align: left;">Item</th>
                <th style="padding: 8px 0; text-align: center;">Qtd</th>
                <th style="padding: 8px 0; text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 0; font-weight: 700; font-size: 16px;">Total</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 16px;">R$ ${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${SITE_URL}/pedido/${orderCode}" 
               style="display: inline-block; background-color: #b8860b; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
              Acompanhar pedido
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Ferri Schoedl Advocacia — OAB/SP 196.377<br />
            Av. Queiroz Filho, 1.700 — Sala 211D — Vila Leopoldina — São Paulo/SP
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Erro ao enviar confirmação:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Resend] Erro inesperado:', err);
    return { success: false, error: 'Erro ao enviar email' };
  }
}

/**
 * Envia notificação de actualização de status do pedido
 */
export async function sendOrderStatusUpdate(
  to: string,
  name: string,
  orderCode: string,
  status: string,
  trackingCode?: string,
): Promise<{ success: boolean; error?: string }> {
  const statusMessages: Record<string, string> = {
    preparando: 'Seu pedido está sendo preparado para envio.',
    enviado: `Seu pedido foi enviado!${trackingCode ? ` Código de rastreio: <strong>${trackingCode}</strong>` : ''}`,
    entregue: 'Seu pedido foi entregue. Esperamos que aproveite a leitura!',
    cancelado:
      'Seu pedido foi cancelado. Em caso de dúvidas, entre em contacto connosco.',
  };

  const message =
    statusMessages[status] ||
    `O status do seu pedido foi actualizado para: ${status}.`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido ${orderCode} — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfbf7; color: #0a1628;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0a1628; margin: 0;">Ferri Schoedl Advocacia</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Olá <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${SITE_URL}/pedido/${orderCode}" 
               style="display: inline-block; background-color: #b8860b; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
              Ver pedido
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Ferri Schoedl Advocacia — OAB/SP 196.377
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Erro ao enviar status update:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Resend] Erro inesperado:', err);
    return { success: false, error: 'Erro ao enviar email' };
  }
}
