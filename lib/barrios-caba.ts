/**
 * Los 48 barrios oficiales de la Ciudad Autónoma de Buenos Aires.
 * Es la ÚNICA lista de zonas aceptada por el formulario (cliente y servidor)
 * y por el CHECK de la tabla `leads` en Supabase. Si se modifica acá,
 * hay que modificarla también en `supabase/migrations/0001_leads.sql`.
 */
export const BARRIOS_CABA = [
  "Agronomía",
  "Almagro",
  "Balvanera",
  "Barracas",
  "Belgrano",
  "Boedo",
  "Caballito",
  "Chacarita",
  "Coghlan",
  "Colegiales",
  "Constitución",
  "Flores",
  "Floresta",
  "La Boca",
  "La Paternal",
  "Liniers",
  "Mataderos",
  "Monte Castro",
  "Montserrat",
  "Nueva Pompeya",
  "Núñez",
  "Palermo",
  "Parque Avellaneda",
  "Parque Chacabuco",
  "Parque Chas",
  "Parque Patricios",
  "Puerto Madero",
  "Recoleta",
  "Retiro",
  "Saavedra",
  "San Cristóbal",
  "San Nicolás",
  "San Telmo",
  "Vélez Sarsfield",
  "Versalles",
  "Villa Crespo",
  "Villa del Parque",
  "Villa Devoto",
  "Villa General Mitre",
  "Villa Lugano",
  "Villa Luro",
  "Villa Ortúzar",
  "Villa Pueyrredón",
  "Villa Real",
  "Villa Riachuelo",
  "Villa Santa Rita",
  "Villa Soldati",
  "Villa Urquiza",
] as const;

export type BarrioCaba = (typeof BARRIOS_CABA)[number];

export function esBarrioCaba(valor: string): valor is BarrioCaba {
  return (BARRIOS_CABA as readonly string[]).includes(valor);
}
