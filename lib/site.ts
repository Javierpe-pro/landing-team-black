/** Configuración pública del sitio (segura para el cliente). */

const WHATSAPP_DEFAULT = "5491126509698";

/** Número de WhatsApp en formato wa.me (solo dígitos, con 549). */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_DEFAULT
).replace(/\D/g, "");

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Link a WhatsApp con mensaje prellenado opcional. */
export function waLink(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const INSTAGRAM = {
  teamblack: "https://www.instagram.com/teamblack.amaya/",
  javier: "https://www.instagram.com/javierealestate.ar/",
  amaya: "https://www.instagram.com/amaya.realestate/",
} as const;
