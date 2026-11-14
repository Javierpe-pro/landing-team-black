import "server-only";

/**
 * Rate limit básico en memoria por clave (IP hasheada).
 * Nota: en Vercel cada instancia serverless tiene su propia memoria, así que es un
 * freno "best effort" contra abuso simple. Para algo estricto usar Upstash/Vercel KV
 * (ver HANDOFF.md).
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recientes = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

  if (recientes.length >= MAX_REQUESTS) {
    hits.set(key, recientes);
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - recientes[0])) / 1000) };
  }

  recientes.push(now);
  hits.set(key, recientes);

  // Limpieza ocasional para no crecer sin límite
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}
