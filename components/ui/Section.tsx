import type { ReactNode } from "react";

type Tone = "dark" | "light";

/**
 * Sección base: alterna fondos negro / gris claro como las propuestas de Team Black.
 */
export function Section({
  id,
  tone = "dark",
  eyebrow,
  title,
  intro,
  children,
  className = "",
  headerAside,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerAside?: ReactNode;
  labelledBy?: string;
}) {
  const dark = tone === "dark";
  const headingId = labelledBy ?? (id ? `${id}-titulo` : undefined);
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={`relative overflow-hidden ${
        dark ? "on-dark bg-ink text-white" : "on-light bg-paper text-ink"
      } py-20 sm:py-28 ${className}`}
    >
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        {(eyebrow || title) && (
          <header className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {eyebrow && (
                <p className={`eyebrow mb-4 ${dark ? "text-brand-soft" : "text-brand-ink"}`}>{eyebrow}</p>
              )}
              {title && (
                <h2 id={headingId} className="display text-[2rem] sm:text-5xl">
                  {title}
                </h2>
              )}
              {intro && (
                <p className={`mt-5 max-w-2xl text-base sm:text-lg ${dark ? "text-mute" : "text-mute-dark"}`}>
                  {intro}
                </p>
              )}
            </div>
            {headerAside}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
