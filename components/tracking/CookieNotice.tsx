"use client";

import { useEffect, useState } from "react";
import { cookies } from "@/content/copy";
import { PIXEL_DEBUG, PIXEL_ENABLED } from "@/lib/pixel";

const KEY = "tb_cookies";

/**
 * Aviso de cookies mínimo y no intrusivo. Solo aparece si hay medición activa
 * (Pixel habilitado) o en modo debug. "Rechazar" revoca el consentimiento del Pixel.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!PIXEL_ENABLED && !PIXEL_DEBUG) return;
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // sin storage: no molestamos
    }
  }, []);

  const decidir = (valor: "aceptado" | "rechazado") => {
    try {
      localStorage.setItem(KEY, valor);
    } catch {
      // ignorar
    }
    try {
      window.fbq?.("consent", valor === "aceptado" ? "grant" : "revoke");
    } catch {
      // ignorar
    }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-[5.5rem] z-40 mx-auto flex max-w-md animate-fade-up flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-ink-2/95 px-4 py-3 text-xs leading-snug text-mute shadow-2xl ring-1 ring-line backdrop-blur md:bottom-5 md:left-5 md:right-auto"
    >
      <p className="min-w-0 flex-1 basis-56">
        {cookies.texto}{" "}
        <a href="/privacidad#cookies" className="text-white underline underline-offset-2">
          {cookies.mas}
        </a>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => decidir("aceptado")}
          className="min-h-10 rounded-full bg-white px-4 font-display text-xs font-bold text-ink"
        >
          {cookies.aceptar}
        </button>
        <button
          type="button"
          onClick={() => decidir("rechazado")}
          className="min-h-10 rounded-full px-4 font-display text-xs font-bold text-white ring-1 ring-white/20"
        >
          {cookies.rechazar}
        </button>
      </div>
    </div>
  );
}
