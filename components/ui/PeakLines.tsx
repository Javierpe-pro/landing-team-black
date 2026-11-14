/**
 * Textura de líneas finas en forma de pico/triángulo, inspirada en la "A" del logo
 * y en la portada de las propuestas. Puramente decorativa.
 */
export function PeakLines({
  className = "",
  variant = "hero",
  draw = false,
}: {
  className?: string;
  variant?: "hero" | "soft";
  /** Dibuja las líneas al cargar (usar solo arriba del pliegue) */
  draw?: boolean;
}) {
  const stroke = variant === "hero" ? "rgb(255 255 255 / 0.07)" : "rgb(255 255 255 / 0.05)";
  return (
    <svg
      className={`pointer-events-none absolute select-none ${className}`}
      viewBox="0 0 800 900"
      fill="none"
      aria-hidden
      focusable={false}
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke={stroke} strokeWidth="1.2" className={draw ? "peak-draw" : undefined}>
        <path pathLength={1} d="M400 40 140 900M400 40l260 860" />
        <path pathLength={1} d="M400 230 230 900M400 230l170 670" />
        <path pathLength={1} d="M560 380 420 900M560 380l140 520" />
        <path pathLength={1} d="M250 520 160 900M250 520l90 380" />
      </g>
      <path d="M400 40 140 900" stroke="rgb(8 102 255 / 0.35)" strokeWidth="1.2" strokeDasharray="2 10" />
    </svg>
  );
}
