import { cinta } from "@/content/copy";

/** Separador con la forma de la "A" del logo. */
function Pico() {
  return (
    <svg viewBox="0 0 20 24" className="mx-6 h-3.5 w-auto shrink-0 text-white/60 sm:mx-8" aria-hidden focusable={false}>
      <path d="M10 0 0 24h5l5-14 5 14h5z" fill="currentColor" />
    </svg>
  );
}

/**
 * Cinta azul en movimiento continuo con los puntos fuertes del servicio.
 * La primera copia es legible por lectores de pantalla; la segunda (para el loop) no.
 */
export function Marquee() {
  const items = cinta.items;
  return (
    <section aria-label={cinta.label} className="marquee relative overflow-hidden bg-brand py-4 text-white sm:py-5">
      <div className="marquee-track flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
            {items.map((t) => (
              <li key={t} className="flex items-center whitespace-nowrap font-display text-sm font-bold tracking-tight sm:text-base">
                {t}
                <Pico />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
