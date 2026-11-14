/**
 * Props para animar la aparición de un elemento al hacer scroll (ver RevealObserver).
 * Uso: <li {...reveal(i)}> escalona los elementos de una grilla según su índice.
 */
export function reveal(i = 0, variant?: "left" | "right" | "scale", step = 90) {
  return {
    "data-reveal": variant ?? "",
    "data-reveal-delay": i ? String(i * step) : undefined,
  } as const;
}
