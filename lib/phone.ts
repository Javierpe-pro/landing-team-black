/**
 * Normaliza un número de WhatsApp argentino a formato E.164 móvil: +549XXXXXXXXXX
 * (10 dígitos nacionales: código de área sin 0 + número sin 15).
 *
 * Acepta formas habituales:
 *   11 2650-9698 · 011 15 2650-9698 · +54 9 11 2650-9698 · 5491126509698 · 2650-9698 (asume 11)
 * Devuelve `null` si no se puede interpretar como un celular argentino.
 */
export function normalizarWhatsappAR(input: string): string | null {
  let d = (input || "").replace(/\D/g, "");
  if (!d) return null;

  // Prefijo internacional 00 o código de país 54 (+ 9 de móvil)
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) {
    d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
  }
  // Prefijo de larga distancia nacional
  if (d.startsWith("0")) d = d.slice(1);

  // Número local de 8 dígitos sin código de área → asumimos AMBA (11)
  if (d.length === 8 && /^[2-7]/.test(d)) d = `11${d}`;

  // 12 dígitos: código de área (2 a 4 dígitos) + "15" + número
  if (d.length === 12) {
    for (const areaLen of [2, 3, 4]) {
      if (d.slice(areaLen, areaLen + 2) === "15") {
        const candidato = d.slice(0, areaLen) + d.slice(areaLen + 2);
        if (candidato.length === 10) {
          d = candidato;
          break;
        }
      }
    }
  }

  // Códigos de área argentinos empiezan con 1, 2 o 3
  if (!/^[1-3]\d{9}$/.test(d)) return null;
  return `+549${d}`;
}
