"use client";

import { useId, useState } from "react";
import { modalidades as c } from "@/content/copy";
import { IconChevronDown, IconHome, IconShield, IconSofa, IconWifi } from "@/components/ui/Icons";

type Clave = "tradicional" | "temporario";
const ICONOS = { tradicional: [IconHome, IconShield], temporario: [IconSofa, IconWifi] } as const;

/**
 * Dos botones seleccionables (Tradicional / Temporario). Al tocar uno se despliega
 * su detalle debajo; tocarlo de nuevo lo cierra. Patrón de "disclosure" accesible.
 */
export function ModalidadSelector() {
  const [abierta, setAbierta] = useState<Clave | null>(null);
  const uid = useId();
  const claves: Clave[] = ["tradicional", "temporario"];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {claves.map((k) => {
          const m = c[k];
          const activa = abierta === k;
          return (
            <button
              key={k}
              type="button"
              aria-expanded={activa}
              aria-controls={`${uid}-${k}`}
              onClick={() => setAbierta(activa ? null : k)}
              className={`group relative flex flex-col items-start rounded-2xl p-4 text-left ring-1 transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 sm:rounded-3xl sm:p-6 ${
                activa
                  ? "bg-ink text-white ring-ink shadow-[0_24px_50px_-24px_rgb(10_10_15/0.6)]"
                  : "bg-white text-ink ring-ink/10 hover:ring-brand/40 hover:shadow-[0_20px_40px_-28px_rgb(10_10_15/0.35)]"
              }`}
            >
              <span className="font-display text-base font-bold leading-tight sm:text-xl">{m.tag}</span>
              <span className={`mt-1 text-xs leading-snug sm:text-sm ${activa ? "text-mute" : "text-mute-dark"}`}>
                {m.selector}
              </span>
              <span className="mt-4 flex w-full items-end justify-between gap-2">
                <span>
                  <span className={`eyebrow block text-[0.6rem] sm:text-[0.66rem] ${activa ? "text-mute" : "text-mute-dark"}`}>
                    {c.honorarioLabel}
                  </span>
                  <span className={`num block text-2xl sm:text-4xl ${activa ? "text-brand-soft" : "text-brand-ink"}`}>
                    {m.honorario.valor}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`grid size-8 shrink-0 place-items-center rounded-full ring-1 transition-transform duration-300 sm:size-9 ${
                    activa ? "rotate-180 bg-brand text-white ring-brand" : "ring-ink/15"
                  }`}
                >
                  <IconChevronDown width={16} height={16} />
                </span>
              </span>
              <span className="sr-only">{activa ? c.ocultarDetalle : c.verDetalle}</span>
            </button>
          );
        })}
      </div>

      {!abierta && <p className="mt-3 text-center text-sm text-mute-dark">{c.selectorAyuda}</p>}

      {claves.map((k) => {
        const m = c[k];
        const activa = abierta === k;
        const [I1, I2] = ICONOS[k];
        const paraQuienTitulo = k === "temporario" ? c.temporario.paraQuienTitulo : c.paraQuienTitulo;
        return (
          <div
            key={k}
            id={`${uid}-${k}`}
            role="region"
            aria-label={m.tag}
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
              activa ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden" inert={!activa}>
              <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-ink/[0.06] sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
                  <div>
                    <h3 className="display text-xl sm:text-2xl">{m.titulo}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-mute-dark">{m.resumen}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-2">
                      {m.datos.map((d) => (
                        <div key={d.valor} className="rounded-xl bg-paper p-3">
                          <dt className="num text-sm text-ink sm:text-lg">{d.valor}</dt>
                          <dd className="mt-0.5 text-[0.7rem] leading-snug text-mute-dark sm:text-xs">{d.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-5 rounded-xl bg-ink p-4 text-sm text-white">
                      <span className="eyebrow mb-1 block text-[0.62rem] text-mute">{paraQuienTitulo}</span>
                      <span className="font-display font-bold leading-snug">{m.paraQuien}</span>
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow text-mute-dark">{m.respaldoTitulo}</p>
                    <ul className="mt-3 grid gap-2.5">
                      {m.respaldo.map((r, i) => {
                        const Icon = i === 0 ? I1 : I2;
                        return (
                          <li key={r.titulo} className="flex gap-3 rounded-xl p-3.5 ring-1 ring-ink/10">
                            <Icon className="mt-0.5 shrink-0 text-brand-ink" />
                            <span>
                              <span className="block font-display text-sm font-bold">{r.titulo}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-mute-dark">{r.texto}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-ink/10 pt-4">
                      <span>
                        <span className="eyebrow block text-mute-dark">{c.honorarioLabel}</span>
                        <span className="mt-1 block text-sm text-mute-dark">{m.honorario.detalle}</span>
                      </span>
                      <span className="num text-3xl text-brand-ink sm:text-4xl">{m.honorario.valor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
