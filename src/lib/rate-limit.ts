/**
 * Rate limiter simples em memória
 * Adequado para Vercel Serverless (reset entre cold starts)
 * Para produção robusta, considerar Redis/Upstash
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Limpar entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60_000); // Limpar a cada minuto

/**
 * Verifica se o request excedeu o limite
 * @param key - Identificador único (ex: IP + rota)
 * @param maxRequests - Número máximo de requests
 * @param windowMs - Janela de tempo em milissegundos
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  // Primeira request ou janela expirou
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { limited: false, remaining: maxRequests - 1, resetAt };
  }

  // Dentro da janela
  entry.count += 1;

  if (entry.count > maxRequests) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}
