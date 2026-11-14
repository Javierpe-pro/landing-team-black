import { z } from "zod";
import { BARRIOS_CABA } from "./barrios-caba";
import { normalizarWhatsappAR } from "./phone";

/**
 * Esquema ÚNICO del formulario de tasación.
 * Se usa en el cliente (validación por paso) y en el servidor (/api/leads).
 * Los valores son strings tal como salen del formulario; la normalización
 * (E.164, sanitización, vacíos → null) ocurre en el servidor.
 */

export const MODALIDADES = ["tradicional", "temporario", "no_se"] as const;
export const TIPOS_PROPIEDAD = ["departamento", "ph", "casa", "local_otro"] as const;
export const AMBIENTES = ["monoambiente", "2", "3", "4_o_mas"] as const;
export const AMOBLADA = ["si", "parcialmente", "no"] as const;
export const INTERNET = ["si", "no"] as const;
export const DISPONIBILIDAD = ["ya", "1_mes", "2_3_meses", "mas_adelante"] as const;

export type Modalidad = (typeof MODALIDADES)[number];

const opcional = (max: number, msg = `Máximo ${max} caracteres.`) =>
  z.string().trim().max(max, { error: msg });

const requiereEquipamiento = (m: string) => m === "temporario" || m === "no_se";

// ---------- Paso 1: contacto ----------
export const paso1Schema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, { error: "Escribí tu nombre y apellido." })
    .max(80, { error: "Máximo 80 caracteres." })
    .regex(/^[\p{L}\p{M}' .-]+$/u, { error: "Usá solo letras." }),
  whatsapp: z
    .string()
    .trim()
    .max(30, { error: "Número demasiado largo." })
    .refine((v) => normalizarWhatsappAR(v) !== null, {
      error: "Revisá el número. Ej: 11 1234-5678 (con código de área).",
    }),
  email: z
    .string()
    .trim()
    .max(120, { error: "Máximo 120 caracteres." })
    .refine((v) => v === "" || z.email().safeParse(v).success, {
      error: "Revisá el email (ej: nombre@mail.com).",
    }),
});

// ---------- Paso 2: la propiedad ----------
const paso2Base = z.object({
  modalidad: z.enum(MODALIDADES, { error: "Elegí una modalidad." }),
  tipo_propiedad: z.enum(TIPOS_PROPIEDAD, { error: "Elegí el tipo de propiedad." }),
  barrio: z.enum(BARRIOS_CABA, {
    error: "Elegí un barrio de CABA de la lista.",
  }),
  direccion_aprox: opcional(120),
  ambientes: z.enum(AMBIENTES, { error: "Elegí la cantidad de ambientes." }),
  m2: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d{1,5}$/.test(v) && +v >= 10 && +v <= 10000), {
      error: "Ingresá solo números (entre 10 y 10.000).",
    }),
  piso_unidad: opcional(30),
  amoblada: z.enum([...AMOBLADA, ""]),
  internet: z.enum([...INTERNET, ""]),
});

/**
 * Para temporario / "no sé", amoblada e internet son obligatorios.
 * Se expone aparte porque zod no corre refinamientos de objeto si hay otros errores,
 * y en el paso 2 queremos mostrar todos los errores juntos.
 */
export function erroresEquipamiento(v: { modalidad?: string; amoblada?: string; internet?: string }) {
  const out: { path: "amoblada" | "internet"; message: string }[] = [];
  if (requiereEquipamiento(v.modalidad ?? "")) {
    if (!v.amoblada) out.push({ path: "amoblada", message: "Contanos si está amoblada." });
    if (!v.internet) out.push({ path: "internet", message: "Contanos si tiene internet." });
  }
  return out;
}

function validarEquipamiento(
  v: { modalidad: string; amoblada: string; internet: string },
  ctx: z.RefinementCtx,
) {
  for (const e of erroresEquipamiento(v)) ctx.addIssue({ code: "custom", path: [e.path], message: e.message });
}

export const paso2Schema = paso2Base.superRefine(validarEquipamiento);

// ---------- Paso 3: detalles ----------
export const paso3Schema = z.object({
  valor_esperado: opcional(60),
  disponibilidad: z.enum(DISPONIBILIDAD, { error: "Elegí cuándo está disponible." }),
  comentarios: opcional(1000, "Máximo 1000 caracteres."),
  consentimiento: z.literal(true, {
    error: "Necesitamos tu consentimiento para contactarte.",
  }),
});

export const PASOS_SCHEMAS = [paso1Schema, paso2Schema, paso3Schema] as const;

export const leadFormSchema = z
  .object({
    ...paso1Schema.shape,
    ...paso2Base.shape,
    ...paso3Schema.shape,
  })
  .superRefine(validarEquipamiento);

export type LeadFormData = z.infer<typeof leadFormSchema>;

/** Valores del formulario en el cliente (selects vacíos = ""). */
export type LeadFormValues = {
  nombre: string;
  whatsapp: string;
  email: string;
  modalidad: Modalidad | "";
  tipo_propiedad: string;
  barrio: string;
  direccion_aprox: string;
  ambientes: string;
  m2: string;
  piso_unidad: string;
  amoblada: string;
  internet: string;
  valor_esperado: string;
  disponibilidad: string;
  comentarios: string;
  consentimiento: boolean;
  /** honeypot: invisible para humanos, los bots lo completan */
  website: string;
};

export const LEAD_FORM_DEFAULTS: LeadFormValues = {
  nombre: "",
  whatsapp: "",
  email: "",
  modalidad: "",
  tipo_propiedad: "",
  barrio: "",
  direccion_aprox: "",
  ambientes: "",
  m2: "",
  piso_unidad: "",
  amoblada: "",
  internet: "",
  valor_esperado: "",
  disponibilidad: "",
  comentarios: "",
  consentimiento: false,
  website: "",
};

const attrStr = (max: number) => z.string().max(max).optional().default("");

export const attributionSchema = z
  .object({
    utm_source: attrStr(200),
    utm_medium: attrStr(200),
    utm_campaign: attrStr(200),
    utm_content: attrStr(200),
    utm_term: attrStr(200),
    fbclid: attrStr(500),
    referrer: attrStr(1000),
    landing_url: attrStr(2000),
    user_agent: attrStr(500),
  })
  .partial()
  .default({});

export type Attribution = z.infer<typeof attributionSchema>;

/** Cuerpo completo que recibe POST /api/leads */
export const leadRequestSchema = z.object({
  data: leadFormSchema,
  website: z.string().max(200).optional().default(""),
  started_at: z.number().int().positive(),
  event_id: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
  attribution: attributionSchema,
});

export type LeadRequest = z.input<typeof leadRequestSchema>;

/** Etiquetas legibles (para pantalla de éxito, admin y WhatsApp). */
export const LABELS = {
  modalidad: {
    tradicional: "Alquiler tradicional",
    temporario: "Alquiler temporario",
    no_se: "No sé, quiero que me asesoren",
  },
  tipo_propiedad: {
    departamento: "Departamento",
    ph: "PH",
    casa: "Casa",
    local_otro: "Local u otro",
  },
  ambientes: {
    monoambiente: "Monoambiente",
    "2": "2 ambientes",
    "3": "3 ambientes",
    "4_o_mas": "4 ambientes o más",
  },
  amoblada: { si: "Sí", parcialmente: "Parcialmente", no: "No" },
  internet: { si: "Sí", no: "No" },
  disponibilidad: {
    ya: "Ya",
    "1_mes": "En 1 mes",
    "2_3_meses": "En 2–3 meses",
    mas_adelante: "Más adelante",
  },
} as const;
