"use client";

import { useEffect, useRef } from "react";
import { formulario as c, hero } from "@/content/copy";
import { trackOnce } from "@/lib/pixel";
import { IconCheck, IconMapPin } from "@/components/ui/Icons";
import { PeakLines } from "@/components/ui/PeakLines";
import { LeadForm } from "./LeadForm";

/** Sección del formulario (#tasacion). Dispara ViewContent una sola vez al entrar en pantalla. */
export function TasacionSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackOnce("viewcontent", "ViewContent", { content_name: "formulario_tasacion" });
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="tasacion"
      aria-labelledby="tasacion-titulo"
      className="on-dark relative overflow-hidden bg-ink py-20 text-white sm:py-28"
    >
      <PeakLines className="-left-48 top-0 h-full w-[900px]" />
      <div aria-hidden className="glow pointer-events-none absolute -right-60 -bottom-40 size-[760px] animate-drift will-change-transform" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div data-reveal="left" className="lg:pt-6">
          <p className="eyebrow flex items-center gap-3 text-brand-soft">
            <span aria-hidden className="h-px w-8 bg-brand" />
            {c.eyebrow}
          </p>
          <h2 id="tasacion-titulo" className="display mt-5 text-[2.2rem] sm:text-6xl">
            {c.titulo}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">{c.intro}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm font-medium ring-1 ring-line">
            <IconMapPin width={16} height={16} className="text-brand-soft" />
            {c.zona}
          </p>
          <ul className="mt-8 hidden space-y-3 lg:block">
            {hero.panelItems.slice(0, 4).map((i) => (
              <li key={i} className="flex items-start gap-3 text-mute">
                <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-brand-soft" />
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="scale" className="on-light relative rounded-3xl bg-white p-5 text-ink shadow-[0_30px_80px_-30px_rgb(8_102_255/0.45)] sm:p-9">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
