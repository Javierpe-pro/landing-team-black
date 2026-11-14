import type { PropiedadAlquilada } from "./propiedades-alquiladas.types";

/**
 * PROPIEDADES QUE YA ALQUILAMOS — única fuente de verdad.
 *
 * Hoy está VACÍO a propósito: no se publica ningún dato inventado.
 * La sección aparece sola en la web cuando haya 3 o más propiedades reales.
 *
 * Cómo cargar una (ver formato completo en `propiedades-alquiladas.example.ts`):
 *  1. Subí las fotos a /public/img/alquiladas/ (JPG o WebP, 1600 px de ancho, horizontales 4:3).
 *  2. Agregá un objeto al array de abajo.
 *  3. Nada de dirección exacta ni datos del inquilino: solo barrio.
 *  4. Valor y testimonio: solo con autorización del propietario.
 */
export const PROPIEDADES_ALQUILADAS: PropiedadAlquilada[] = [];

/**
 * Punto de acceso que usan los componentes. Hoy lee el array local; en el futuro
 * puede leer la tabla `propiedades_alquiladas` de Supabase sin tocar componentes
 * (ver supabase/migrations/0002_propiedades_alquiladas.sql y HANDOFF.md).
 */
export async function getPropiedadesAlquiladas(): Promise<PropiedadAlquilada[]> {
  return [...PROPIEDADES_ALQUILADAS].sort(
    (a, b) =>
      Number(Boolean(b.destacada)) - Number(Boolean(a.destacada)) ||
      (b.fechaAlquiler || "").localeCompare(a.fechaAlquiler || ""),
  );
}
