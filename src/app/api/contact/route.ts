import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Ferri Schoedl Advocacia <noreply@send.ferrischoedl.adv.br>';
const TO_EMAIL = 'cristiane@ferrischoedl.adv.br';

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  area?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem sao obrigatorios.' },
        { status: 400 },
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ error: 'Email invalido.' }, { status: 400 });
    }

    const areaLabels: Record<string, string> = {
      criminal: 'Criminal',
      'tribunal-do-juri': 'Tribunal do Juri',
      improbidade: 'Improbidade Administrativa',
      imobiliario: 'Imobiliario',
      civel: 'Civel',
      disciplinar: 'Disciplinar',
      outro: 'Outro',
    };

    const areaDisplay = body.area
      ? areaLabels[body.area] || body.area
      : 'Nao informada';

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: body.email,
      subject: `Contato pelo site — ${body.name}`,
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fdfbf7; color: #0a1628;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0a1628; margin: 0;">Ferri Schoedl Advocacia</h1>
            <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">Nova mensagem pelo formulario de contato</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 140px; vertical-align: top;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #0a1628; font-weight: 600;">${body.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; vertical-align: top;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${body.email}" style="color: #b8860b;">${body.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; vertical-align: top;">Telefone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #0a1628;">${body.phone || 'Nao informado'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; vertical-align: top;">Area de interesse</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #0a1628;">${areaDisplay}</td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Mensagem</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-left: 3px solid #b8860b; font-size: 14px; line-height: 1.6; color: #0a1628; white-space: pre-wrap;">${body.message}</div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <p style="font-size: 11px; color: #9ca3af; text-align: center;">
            Mensagem enviada pelo formulario de contato em ferrischoedl.adv.br<br />
            Para responder, use o botao "Responder" do seu email — a resposta ira directamente para ${body.email}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Contact] Resend erro:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem. Tente novamente.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Contact] Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
