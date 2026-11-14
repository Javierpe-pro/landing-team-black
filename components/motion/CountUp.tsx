"use client";

import { useEffect, useRef } from "react";

/**
 * Número que "cuenta" desde 0 hasta su valor cuando entra en pantalla.
 * Acepta textos como "4,15%", "+15,8K", "6 pasos", "15%". Si el valor es 0 o no hay
 * número, se muestra tal cual. El valor final siempre está en el HTML (SEO y lectores
 * de pantalla) y se respeta prefers-reduced-motion.
 * No usar con miles con punto (ej. "USD 1.200").
 */
export function CountUp({ value, className = "", duration = 1400 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d+(?:,\d+)?)(.*)$/);
    if (!el || !m) return;
    const target = parseFloat(m[2].replace(",", "."));
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const decimals = (m[2].split(",")[1] || "").length;
    const fmt = (n: number) =>
      m[1] + n.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + m[3];

    let raf = 0;
    el.textContent = fmt(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = p < 1 ? fmt(target * eased) : value;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
