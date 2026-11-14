/**
 * Sanitización de strings de entrada: sin caracteres de control, sin < >,
 * espacios colapsados y longitud acotada. Devuelve null si queda vacío.
 */
export function clean(value: string | null | undefined, max = 500, multiline = false): string | null {
  if (value == null) return null;
  let s = String(value)
    .normalize("NFC")
    .replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "");
  s = multiline
    ? s
        .split("\n")
        .map((l) => l.replace(/\s+/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : s.replace(/\s+/g, " ").trim();
  s = s.slice(0, max);
  return s.length ? s : null;
}
