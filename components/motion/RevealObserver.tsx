"use client";

import { useEffect } from "react";

/**
 * Activa las apariciones al hacer scroll de todos los elementos con [data-reveal].
 * - Agrega .reveal-ready al <html> (sin JS, nada queda oculto).
 * - Un solo IntersectionObserver para toda la página; cada elemento anima una vez.
 * - data-reveal-delay="120" (ms) escalona elementos de una misma grilla.
 * - Marca el <html> con data-scrolled cuando se bajó un poco (header más sólido).
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    const onScroll = () => {
      if (window.scrollY > 24) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    root.classList.add("reveal-ready");
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const delay = Number(el.dataset.revealDelay || 0);
          if (delay) timers.push(window.setTimeout(() => el.classList.add("is-visible"), delay));
          else el.classList.add("is-visible");
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
