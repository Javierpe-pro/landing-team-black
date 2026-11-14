/**
 * Helper tipado para el Meta Pixel.
 *
 * Reglas:
 * - El Pixel SOLO se inicializa si existe NEXT_PUBLIC_META_PIXEL_ID **y**
 *   NEXT_PUBLIC_PIXEL_ENABLED === "true". En local y en el Vercel de pruebas va en "false"
 *   para no ensuciar la cuenta publicitaria de Javier.
 * - Si el Pixel no cargó (adblock) o está deshabilitado, `track` no rompe: no hace nada.
 * - Con NEXT_PUBLIC_PIXEL_DEBUG === "true" cada evento se imprime en consola
 *   (aunque el Pixel esté deshabilitado), para verificar nombres y parámetros.
 * - Nunca se envían nombre, teléfono ni email como parámetros.
 */

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";
export const PIXEL_ENABLED = Boolean(PIXEL_ID) && process.env.NEXT_PUBLIC_PIXEL_ENABLED === "true";
export const PIXEL_DEBUG = process.env.NEXT_PUBLIC_PIXEL_DEBUG === "true";

export type StandardEvent = "PageView" | "ViewContent" | "Contact" | "Lead";
export type CustomEvent = "FormStart";
export type PixelEvent = StandardEvent | CustomEvent;

const STANDARD: ReadonlySet<string> = new Set(["PageView", "ViewContent", "Contact", "Lead"]);

export type PixelParams = {
  content_name?: string;
  content_category?: string;
  [key: string]: string | number | undefined;
};

type Fbq = (
  method: "track" | "trackCustom" | "init" | "consent",
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** ID único por evento (también se guarda en el lead para deduplicar con Conversions API). */
export function newEventId(prefix = "ev"): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `${prefix}_${rnd}`.slice(0, 64);
}

/**
 * Envía un evento al Pixel. Devuelve el event_id usado.
 */
export function track(event: PixelEvent, params: PixelParams = {}, eventId?: string): string {
  const id = eventId || newEventId(event.toLowerCase());
  if (typeof window === "undefined") return id;

  const enviado = PIXEL_ENABLED && typeof window.fbq === "function";

  if (PIXEL_DEBUG) {
    console.log(
      `%c[Pixel${enviado ? "" : " · NO enviado (deshabilitado o bloqueado)"}] ${event}`,
      "color:#4D8DFF;font-weight:bold",
      { ...params, event_id: id },
    );
  }

  if (!enviado) return id;
  try {
    window.fbq!(STANDARD.has(event) ? "track" : "trackCustom", event, params, { eventID: id });
  } catch {
    // Nunca romper la página por el Pixel.
  }
  return id;
}

/** Dispara un evento una sola vez por sesión de navegador. */
export function trackOnce(key: string, event: PixelEvent, params: PixelParams = {}) {
  if (typeof window === "undefined") return;
  try {
    const k = `tb_px_${key}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
  } catch {
    // sessionStorage no disponible: igual disparamos
  }
  track(event, params);
}
