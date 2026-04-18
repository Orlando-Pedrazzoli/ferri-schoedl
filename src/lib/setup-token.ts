// src/lib/setup-token.ts
import crypto from 'crypto';

/**
 * Gera token HMAC assinado para permitir definicao de senha pos-compra.
 * Formato: `${customerId}.${orderCode}.${expiresAt}.${signature}`
 *
 * O token e usado como query param em /pedido/[orderCode]?setup=TOKEN
 * e permite que o customer defina senha mesmo que a sessao JWT tenha expirado.
 *
 * Validade: 24 horas a partir da criacao.
 */

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getSecret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error('NEXTAUTH_SECRET nao configurado');
  return s;
}

export function generateSetupToken(
  customerId: string,
  orderCode: string,
): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${customerId}.${orderCode}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

export interface SetupTokenPayload {
  customerId: string;
  orderCode: string;
  expiresAt: number;
}

export function verifySetupToken(token: string): SetupTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 4) return null;

    const [customerId, orderCode, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(expiresAt)) return null;
    if (Date.now() > expiresAt) return null;

    const payload = `${customerId}.${orderCode}.${expiresAtStr}`;
    const expectedSig = crypto
      .createHmac('sha256', getSecret())
      .update(payload)
      .digest('hex');

    const a = Buffer.from(expectedSig, 'hex');
    const b = Buffer.from(signature, 'hex');
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    return { customerId, orderCode, expiresAt };
  } catch {
    return null;
  }
}