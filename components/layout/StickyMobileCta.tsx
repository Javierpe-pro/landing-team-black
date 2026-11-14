"use client";

import { useEffect, useState } from "react";
import { nav } from "@/content/copy";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { IconWhatsApp } from "@/components/ui/Icons";

/**
 * Barra CTA inferior fija, solo mobile. Se oculta mientras el formulario está en pantalla
 * para no tapar sus botones.
 */
export function StickyMobileCta() {
  const [oculta, setOculta] = useState(false);

  useEffect(() => {
    const form = document.getElementById("tasacion");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOculta(e.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        oculta ? "translate-y-full" : "translate-y-0"
      }`}
      aria-hidden={oculta}
      inert={oculta}
    >
      <div className="flex gap-3">
        <a
          href="#tasacion"
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand font-display text-[0.95rem] font-bold text-white active:scale-[0.98]"
        >
          {nav.ctaMobile}
        </a>
        <WhatsAppLink
          origen="sticky_mobile"
          aria-label={nav.whatsappAria}
          unstyled
          className="grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-ink active:scale-[0.96]"
        >
          <IconWhatsApp width={24} height={24} />
        </WhatsAppLink>
      </div>
    </div>
  );
}
