import "server-only";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { LABELS } from "@/lib/lead-schema";

/**
 * Capa de almacenamiento intercambiable para los leads.
 * Se elige con la variable de entorno LEADS_STORAGE:
 *   - "file"     → ./.data/leads.jsonl (solo desarrollo local; Vercel no tiene disco persistente)
 *   - "supabase" → tabla public.leads, insertando con la service role key DESDE EL SERVIDOR.
 *   - "crm"      → envía el lead a la Edge Function "ads-lead" del Supabase del CRM, que lo guarda
 *                  en Prospectos → ADS. No usa la service role key. Modo de producción de Javier.
 *   - "log"      → no guarda nada: escribe el lead en los logs del servidor. Solo para
 *                  previsualizaciones visuales (ej. Vercel de pruebas sin base de datos).
 */

/** Fila tal como se guarda (coincide 1:1 con las columnas de public.leads). */
export type LeadRecord = {
  nombre: string;
  whatsapp: string;
  email: string | null;
  modalidad: "tradicional" | "temporario" | "no_se";
  tipo_propiedad: string;
  barrio: string;
  direccion_aprox: string | null;
  ambientes: string;
  m2: number | null;
  piso_unidad: string | null;
  amoblada: string | null;
  internet: string | null;
  valor_esperado: string | null;
  disponibilidad: string;
  comentarios: string | null;
  consentimiento: boolean;
  consentimiento_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  referrer: string | null;
  landing_url: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  event_id: string;
};

export type StoredLead = LeadRecord & { id: string; created_at: string; status: string };

export interface LeadsStore {
  insert(lead: LeadRecord): Promise<void>;
  /** Solo para el visor de desarrollo /admin/leads */
  list(limit?: number): Promise<StoredLead[]>;
}

// ---------------- Adaptador: archivo local ----------------
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "leads.jsonl");

const fileStore: LeadsStore = {
  async insert(lead) {
    await mkdir(DATA_DIR, { recursive: true });
    const row: StoredLead = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: "nuevo",
      ...lead,
    };
    await appendFile(DATA_FILE, JSON.stringify(row) + "\n", "utf8");
  },
  async list(limit = 200) {
    try {
      const raw = await readFile(DATA_FILE, "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l) as StoredLead)
        .reverse()
        .slice(0, limit);
    } catch {
      return [];
    }
  },
};

// ---------------- Adaptador: Supabase ----------------
async function supabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const supabaseStore: LeadsStore = {
  async insert(lead) {
    const sb = await supabaseClient();
    const { error } = await sb.from("leads").insert(lead);
    if (error) throw new Error(`Supabase insert: ${error.code} ${error.message}`);
  },
  async list(limit = 200) {
    const sb = await supabaseClient();
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Supabase select: ${error.message}`);
    return (data || []) as StoredLead[];
  },
};


// ---------------- Adaptador: CRM (Prospectos · ADS) ----------------
const lab = (group: Record<string, string>, v: string | null) => (v ? (group[v] ?? v) : null);

const crmStore: LeadsStore = {
  async insert(lead) {
    const url = process.env.CRM_INGEST_URL;
    if (!url) throw new Error("Falta CRM_INGEST_URL en las variables de entorno.");
    const notas = [
      `Modalidad: ${LABELS.modalidad[lead.modalidad]}`,
      lead.amoblada ? `Amoblada: ${lab(LABELS.amoblada, lead.amoblada)}` : null,
      lead.internet ? `Internet: ${lab(LABELS.internet, lead.internet)}` : null,
      lead.comentarios ? `Comentarios: ${lead.comentarios}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.CRM_INGEST_TOKEN) headers["x-ingest-token"] = process.env.CRM_INGEST_TOKEN;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: lead.nombre,
        phone: lead.whatsapp,
        email: lead.email,
        property_address: lead.direccion_aprox,
        notes: notas || null,
        campaign_name: lead.utm_campaign,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_campaign: lead.utm_campaign,
        utm_content: lead.utm_content,
        utm_term: lead.utm_term,
        fbclid: lead.fbclid,
        landing_url: lead.landing_url,
        event_id: lead.event_id,
        tipo_propiedad: lab(LABELS.tipo_propiedad, lead.tipo_propiedad),
        barrio: lead.barrio,
        ambientes: lab(LABELS.ambientes, lead.ambientes),
        m2: lead.m2,
        piso_unidad: lead.piso_unidad,
        amoblada: lab(LABELS.amoblada, lead.amoblada),
        internet: lab(LABELS.internet, lead.internet),
        disponibilidad: lab(LABELS.disponibilidad, lead.disponibilidad),
        comentarios: lead.comentarios,
        valor_esperado: lead.valor_esperado,
      }),
    });
    if (!res.ok) throw new Error(`CRM ingest: HTTP ${res.status}`);
  },
  async list() {
    // Los leads se ven en el CRM (Prospectos → ADS).
    return [];
  },
};

// ---------------- Adaptador: solo logs (previews sin base) ----------------
const logStore: LeadsStore = {
  async insert(lead) {
    console.info("[leads:log] Lead recibido (NO se guarda):", {
      modalidad: lead.modalidad,
      barrio: lead.barrio,
      event_id: lead.event_id,
      utm_source: lead.utm_source,
    });
  },
  async list() {
    return [];
  },
};

export function getLeadsStore(): LeadsStore {
  const mode = (process.env.LEADS_STORAGE || "file").toLowerCase();
  if (mode === "supabase") return supabaseStore;
  if (mode === "crm") return crmStore;
  if (mode === "file") return fileStore;
  if (mode === "log") return logStore;
  throw new Error(`LEADS_STORAGE inválido: "${mode}". Usá "file", "supabase", "crm" o "log".`);
}

export const LEADS_STORAGE_MODE = (process.env.LEADS_STORAGE || "file").toLowerCase();
