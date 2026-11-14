"use client";

import { useEffect, useRef } from "react";
import { formulario, marca } from "@/content/copy";
import { LABELS, type Modalidad } from "@/lib/lead-schema";
import { INSTAGRAM } from "@/lib/site";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { IconCheck, IconInstagram, IconWhatsApp } from "@/components/ui/Icons";
import { Txt, fill } from "@/components/ui/Txt";

export type LeadSuccessData = { nombre: string; barrio: string; modalidad: Modalidad };

/** Pantalla post-envío: confirma, explica qué sigue y abre WhatsApp e Instagram. */
export function LeadSuccess({ data, onNuevo }: { data: LeadSuccessData; onNuevo: () => void }) {
  const c = formulario.exito;
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  const mensaje = fill(c.whatsappMensaje, {
    nombre: data.nombre,
    barrio: data.barrio,
    modalidad: LABELS.modalidad[data.modalidad].toLowerCase(),
  });

  return (
    <div role="status" className="animate-fade-up">
      <span className="grid size-14 place-items-center rounded-full bg-brand text-white">
        <IconCheck width={28} height={28} strokeWidth={2.5} />
      </span>
      <h3 ref={titulo} tabIndex={-1} className="display mt-6 text-3xl text-ink outline-none">
        {fill(c.titulo, { nombre: data.nombre })}
      </h3>
      <p className="mt-2 text-lg text-mute-dark">{fill(c.texto, { barrio: data.barrio })}</p>

      <p className="eyebrow mt-8 text-brand-ink">{c.ahoraTitulo}</p>
      <ol className="mt-4 space-y-4">
        {c.ahora.map((p, i) => (
          <li key={p.titulo} className="flex gap-4">
            <span className="num grid size-9 shrink-0 place-items-center rounded-full bg-paper text-sm text-ink ring-1 ring-ink/10">
              {i + 1}
            </span>
            <div className="pt-1">
              <p className="font-display font-bold text-ink">{p.titulo}</p>
              <p className="mt-0.5 text-sm text-mute-dark">
                <Txt>{p.texto}</Txt>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <WhatsAppLink origen="exito" mensaje={mensaje} size="lg" className="mt-8 w-full">
        <IconWhatsApp width={22} height={22} />
        {c.whatsapp}
      </WhatsAppLink>

      <div className="mt-6 rounded-2xl bg-paper p-4">
        <p className="text-sm font-medium text-ink">{c.seguinos}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { href: INSTAGRAM.teamblack, label: marca.instagram.teamblack },
            { href: INSTAGRAM.javier, label: marca.instagram.javier },
          ].map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-ink/30"
            >
              <IconInstagram width={18} height={18} />
              {r.label}
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNuevo}
        className="mt-6 min-h-11 text-sm font-semibold text-mute-dark underline underline-offset-2 hover:text-ink"
      >
        {c.nuevo}
      </button>
    </div>
  );
}
