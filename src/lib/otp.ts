// src/lib/otp.ts
import crypto from 'crypto';

/**
 * Gera código OTP de 6 dígitos numéricos.
 * Usa crypto.randomInt para evitar viés de Math.random.
 */
export function generateOtpCode(): string {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, '0');
}

/**
 * Hash do OTP para não armazenar em plaintext no DB.
 * SHA-256 é suficiente aqui porque o código é efêmero (10min) e tem entropia limitada (6 dígitos).
 */
export function hashOtpCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Duração padrão do OTP: 10 minutos.
 */
export function getOtpExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}

/**
 * Limite de tentativas antes de invalidar o OTP.
 */
export const MAX_OTP_ATTEMPTS = 5;
