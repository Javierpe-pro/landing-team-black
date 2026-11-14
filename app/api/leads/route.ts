import { createHash } from "node:crypto";
import { leadRequestSchema } from "@/lib/lead-schema";
import { getLeadsStore, type LeadRecord } from "@/lib/leads-store";
import { normalizarWhatsappAR } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { clean } from "@/lib/sanitize";

/** Tiempo mínimo (ms) entre que se abre el formulario y se envía. Menos que esto = bot. */
const MIN_FILL_MS = 4000;
const MAX_BODY_BYTES = 20_000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "0.0.0.0").trim();
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "team-black-landing";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

export async function POST(req: Request) {
  // Solo JSON y tamaño acotado
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Formato no soportado." }, 415);
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Solicitud demasiado grande." }, 413);
  }

  const ipHash = hashIp(clientIp(req));
  const rl = rateLimit(ipHash);
  if (!rl.ok) {
    return json(
      { ok: false, error: "Recibimos varios envíos seguidos. Probá de nuevo en unos minutos o escribinos por WhatsApp." },
      429,
      { "Retry-After": String(rl.retryAfter) },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      // issues de "data.campo" → "campo"
      const key = String(issue.path[0] === "data" ? issue.path[1] : issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return json({ ok: false, error: "Revisá los datos del formulario.", fieldErrors }, 400);
  }

  const { data, website, started_at, event_id, attribution: a } = parsed.data;

  // Antispam silencioso: el bot recibe "ok" pero no se guarda nada.
  if (website.trim() !== "" || Date.now() - started_at < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const whatsapp = normalizarWhatsappAR(data.whatsapp);
  if (!whatsapp) {
    return json({ ok: false, error: "Revisá el WhatsApp.", fieldErrors: { whatsapp: "Número inválido." } }, 400);
  }

  const equipamiento = data.modalidad !== "tradicional";
  const now = new Date().toISOString();

  const lead: LeadRecord = {
    nombre: clean(data.nombre, 80)!,
    whatsapp,
    email: clean(data.email, 120)?.toLowerCase() ?? null,
    modalidad: data.modalidad,
    tipo_propiedad: data.tipo_propiedad,
    barrio: data.barrio,
    direccion_aprox: clean(data.direccion_aprox, 120),
    ambientes: data.ambientes,
    m2: data.m2 ? Number(data.m2) : null,
    piso_unidad: clean(data.piso_unidad, 30),
    amoblada: equipamiento ? data.amoblada || null : null,
    internet: equipamiento ? data.internet || null : null,
    valor_esperado: clean(data.valor_esperado, 60),
    disponibilidad: data.disponibilidad,
    comentarios: clean(data.comentarios, 1000, true),
    consentimiento: true,
    consentimiento_at: now,
    utm_source: clean(a.utm_source, 200),
    utm_medium: clean(a.utm_medium, 200),
    utm_campaign: clean(a.utm_campaign, 200),
    utm_content: clean(a.utm_content, 200),
    utm_term: clean(a.utm_term, 200),
    fbclid: clean(a.fbclid, 500),
    referrer: clean(a.referrer, 1000),
    landing_url: clean(a.landing_url, 2000),
    user_agent: clean(a.user_agent, 500),
    ip_hash: ipHash,
    event_id,
  };

  try {
    await getLeadsStore().insert(lead);
  } catch (err) {
    console.error("[api/leads] Error guardando lead:", err instanceof Error ? err.message : err);
    return json(
      { ok: false, error: "No pudimos guardar tus datos. Probá de nuevo o escribinos por WhatsApp." },
      500,
    );
  }

  return json({ ok: true });
}
