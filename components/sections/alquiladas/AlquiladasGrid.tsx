"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { alquiladas as c } from "@/content/copy";
import type { PropiedadAlquilada } from "@/content/propiedades-alquiladas.types";
import { fill } from "@/components/ui/Txt";
import { IconClose, IconMapPin } from "@/components/ui/Icons";

type Filtro = "todas" | "tradicional" | "temporario";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const ambientesTxt = (n: number) => (n <= 1 ? "Monoambiente" : `${n} ambientes`);
const modalidadTxt = (m: PropiedadAlquilada["modalidad"]) => (m === "tradicional" ? "Tradicional" : "Temporario");

function Foto({ src, alt, demo, sizes, priority = false }: { src?: string; alt: string; demo: boolean; sizes: string; priority?: boolean }) {
  if (demo || !src) {
    return (
      <div aria-label={alt} role="img" className="absolute inset-0 grid place-items-center bg-ink-3">
        <svg viewBox="0 0 100 80" className="h-1/2 text-white/10" aria-hidden>
          <path d="M50 8 20 72M50 8l30 64M50 30 34 72M50 30l16 42" stroke="currentColor" fill="none" strokeWidth="1.5" />
        </svg>
        <span className="absolute bottom-3 left-3 rounded bg-yellow-400 px-2 py-0.5 font-display text-[0.65rem] font-bold text-ink">
          EJEMPLO — NO PUBLICAR
        </span>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />;
}

export function AlquiladasGrid({ propiedades, demo }: { propiedades: PropiedadAlquilada[]; demo: boolean }) {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [abierta, setAbierta] = useState<PropiedadAlquilada | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visibles = useMemo(
    () => (filtro === "todas" ? propiedades : propiedades.filter((p) => p.modalidad === filtro)),
    [filtro, propiedades],
  );

  const abrir = (p: PropiedadAlquilada) => {
    setAbierta(p);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const cerrar = () => dialogRef.current?.close();

  return (
    <>
      <div role="radiogroup" aria-label="Filtrar por modalidad" className="mb-6 flex gap-2">
        {(["todas", "tradicional", "temporario"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={filtro === f}
            onClick={() => setFiltro(f)}
            className={`min-h-11 rounded-full px-4 font-display text-sm font-bold ring-1 transition-colors ${
              filtro === f ? "bg-white text-ink ring-white" : "text-mute ring-line hover:text-white"
            }`}
          >
            {c.filtros[f]}
          </button>
        ))}
      </div>

      <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {visibles.map((p) => (
          <li key={p.id} className="w-[82%] shrink-0 snap-start md:w-auto">
            <button
              type="button"
              onClick={() => abrir(p)}
              className="group block w-full overflow-hidden rounded-3xl bg-ink-2 text-left ring-1 ring-line transition-[box-shadow] hover:ring-white/25"
              aria-label={`${c.verFotos}: ${p.titulo}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Foto src={p.fotos[0]} alt={p.titulo} demo={demo} sizes="(min-width: 768px) 33vw, 82vw" />
                <span className="eyebrow absolute left-3 top-3 rounded-md bg-brand px-2.5 py-1 text-[0.62rem] text-white">
                  {modalidadTxt(p.modalidad)}
                </span>
              </div>
              <div className="p-5">
                <p className="flex items-center gap-1.5 text-sm text-brand-soft">
                  <IconMapPin width={15} height={15} />
                  {p.barrio}
                </p>
                <h3 className="mt-2 font-display font-bold leading-snug text-white">{p.titulo}</h3>
                <p className="mt-1 text-sm text-mute">
                  {p.tipo} · {ambientesTxt(p.ambientes)}
                </p>
                {(p.diasHastaAlquilar != null || p.plazoContratoMeses != null || p.valorAlquiler) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.diasHastaAlquilar != null && (
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white">
                        {fill(c.alquiladaEn, { d: p.diasHastaAlquilar })}
                      </span>
                    )}
                    {p.plazoContratoMeses != null && (
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white">
                        {fill(c.contrato, { m: p.plazoContratoMeses })}
                      </span>
                    )}
                    {p.valorAlquiler && (
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white">
                        {p.valorAlquiler.moneda === "USD" ? "USD " : "$ "}
                        {nf.format(p.valorAlquiler.monto)}/mes
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setAbierta(null)}
        onClick={(e) => e.target === dialogRef.current && cerrar()}
        aria-label={abierta?.titulo}
        className="m-auto w-[min(56rem,calc(100%-1.5rem))] max-w-none rounded-3xl bg-ink-2 p-0 text-white ring-1 ring-line backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        {abierta && (
          <div>
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-sm text-brand-soft">
                  {abierta.barrio} · {modalidadTxt(abierta.modalidad)}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">{abierta.titulo}</h3>
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label={c.cerrar}
                className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-line hover:bg-white/10"
              >
                <IconClose />
              </button>
            </div>
            <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
              {abierta.fotos.map((f, i) => (
                <li key={f} className="relative aspect-[4/3] w-full shrink-0 snap-center">
                  <Foto
                    src={f}
                    alt={`${abierta.titulo} — foto ${i + 1} de ${abierta.fotos.length}`}
                    demo={demo}
                    sizes="(min-width: 900px) 56rem, 100vw"
                  />
                </li>
              ))}
            </ul>
            {abierta.fotos.length > 1 && (
              <p className="px-6 pt-3 text-xs text-mute">Deslizá para ver las {abierta.fotos.length} fotos →</p>
            )}
            {abierta.testimonioPropietario && (
              <blockquote className="m-5 rounded-2xl bg-white/[0.04] p-5 sm:m-6">
                <p className="text-[0.98rem] leading-relaxed">“{abierta.testimonioPropietario.texto}”</p>
                <footer className="mt-3 text-sm text-mute">— {abierta.testimonioPropietario.nombre}</footer>
              </blockquote>
            )}
            <div className="h-5" />
          </div>
        )}
      </dialog>
    </>
  );
}
