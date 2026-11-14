import "server-only";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Capa de almacenamiento intercambiable para los leads.
 * Se elige con la variable de entorno LEADS_STORAGE:
 *   - "file"     → ./.data/leads.jsonl (solo desarrollo local; Vercel no tiene disco persistente)
 *   - "supabase" → tabla public.leads, insertando con la service role key DESDE EL SERVIDOR.
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

export function getLeadsStore(): LeadsStore {
  const mode = (process.env.LEADS_STORAGE || "file").toLowerCase();
  if (mode === "supabase") return supabaseStore;
  if (mode === "file") return fileStore;
  throw new Error(`LEADS_STORAGE inválido: "${mode}". Usá "file" o "supabase".`);
}

export const LEADS_STORAGE_MODE = (process.env.LEADS_STORAGE || "file").toLowerCase();
