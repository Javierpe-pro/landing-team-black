import type { Attribution } from "./lead-schema";

/**
 * Captura de atribución (UTM, fbclid, referrer, landing, user agent) al cargar la página.
 * Se persiste en sessionStorage para que no se pierda si el usuario navega o recarga.
 * Si la URL actual trae UTM o fbclid nuevos, reemplazan a los guardados.
 */
const KEY = "tb_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

const cut = (v: string | null | undefined, max: number) => (v || "").slice(0, max);

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const traeCampania = UTM_KEYS.some((k) => p.get(k)) || Boolean(p.get("fbclid"));
    if (sessionStorage.getItem(KEY) && !traeCampania) return;

    const attr: Attribution = {
      utm_source: cut(p.get("utm_source"), 200),
      utm_medium: cut(p.get("utm_medium"), 200),
      utm_campaign: cut(p.get("utm_campaign"), 200),
      utm_content: cut(p.get("utm_content"), 200),
      utm_term: cut(p.get("utm_term"), 200),
      fbclid: cut(p.get("fbclid"), 500),
      referrer: cut(document.referrer, 1000),
      landing_url: cut(window.location.href, 2000),
      user_agent: cut(navigator.userAgent, 500),
    };
    sessionStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    // sin sessionStorage (modo privado estricto): se resuelve en getAttribution()
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // ignorar
  }
  return {
    referrer: cut(document.referrer, 1000),
    landing_url: cut(window.location.href, 2000),
    user_agent: cut(navigator.userAgent, 500),
  };
}
