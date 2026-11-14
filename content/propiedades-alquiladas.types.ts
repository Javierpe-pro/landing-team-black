import type { BarrioCaba } from "@/lib/barrios-caba";

/**
 * Una propiedad que Team Black ya alquiló.
 *
 * PRIVACIDAD: nunca cargar dirección exacta, altura de calle ni datos del inquilino.
 * Solo barrio. `valorAlquiler` y `testimonioPropietario` requieren autorización
 * expresa del propietario antes de publicarse.
 */
export type PropiedadAlquilada = {
  /** Identificador único, sin espacios. Ej: "palermo-2amb-2026-03" */
  id: string;
  /** Ej: "2 ambientes luminoso en Palermo" */
  titulo: string;
  /** Uno de los 48 barrios oficiales de CABA */
  barrio: BarrioCaba;
  tipo: "Departamento" | "PH" | "Casa" | "Local";
  /** 1 = monoambiente */
  ambientes: number;
  modalidad: "tradicional" | "temporario";
  /** Rutas dentro de /public, ej: "/img/alquiladas/palermo-2amb-1.jpg". La primera es la principal. */
  fotos: string[];
  diasHastaAlquilar?: number;
  /** Mostrar solo con autorización del propietario */
  valorAlquiler?: { monto: number; moneda: "ARS" | "USD" };
  plazoContratoMeses?: number;
  /** Solo con autorización escrita del propietario */
  testimonioPropietario?: { texto: string; nombre: string };
  destacada?: boolean;
  /** Formato AAAA-MM-DD */
  fechaAlquiler?: string;
};

/** Mínimo de propiedades para que la sección se publique en producción. */
export const MIN_PROPIEDADES_PARA_MOSTRAR = 3;
