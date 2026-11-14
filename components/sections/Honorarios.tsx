import type { ReactNode } from "react";
import { honorarios as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { IconCheck, IconDash } from "@/components/ui/Icons";
import { CalculadoraTemporario, CalculadoraTradicional } from "./Calculadora";

type Mod = typeof c.tradicional | typeof c.temporario;

function Panel({ m, calc }: { m: Mod; calc: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/[0.06] sm:p-9">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <p className="num text-[4.5rem] leading-[0.9] text-ink sm:text-[7rem]">{m.numero}</p>
          <p className="pb-2 font-display text-base font-bold leading-tight text-ink sm:pb-3 sm:text-lg">
            {m.numeroDetalle}
          </p>
        </div>
        <p className="mt-6 text-[0.98rem] leading-relaxed text-mute-dark">
          {m.texto} <strong className="font-semibold text-ink">{m.destacado}</strong>
        </p>
        {m.pago && <p className="mt-2 text-sm text-mute-dark">{m.pago}</p>}

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="border-b-2 border-ink pb-2 font-display text-sm font-bold">{c.incluyeTitulo}</h3>
            <ul className="mt-4 space-y-3">
              {m.incluye.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[0.95rem]">
                  <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-brand-ink" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="border-b border-ink/20 pb-2 font-display text-sm font-bold text-mute-dark">
              {c.noIncluyeTitulo}
            </h3>
            <ul className="mt-4 space-y-3">
              {m.noIncluye.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[0.95rem] text-mute-dark">
                  <IconDash width={18} height={18} className="mt-0.5 shrink-0 text-ink/40" />
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-mute-dark">{m.noIncluyeNota}</p>
          </div>
        </div>
      </div>

      <div className="on-dark self-start rounded-3xl bg-ink p-6 text-white sm:p-8">
        <p className="eyebrow text-brand-soft">{c.calcTitulo}</p>
        <div className="mt-6">{calc}</div>
        <p className="mt-5 text-xs leading-relaxed text-mute">{c.disclaimer}</p>
      </div>
    </div>
  );
}

export function Honorarios() {
  return (
    <Section id="honorarios" tone="light" eyebrow={c.eyebrow} title={c.titulo}>
      <Tabs
        tone="light"
        label="Honorarios por modalidad"
        items={[
          {
            id: "tradicional",
            label: c.tabs.tradicional,
            content: <Panel m={c.tradicional} calc={<CalculadoraTradicional />} />,
          },
          {
            id: "temporario",
            label: c.tabs.temporario,
            content: <Panel m={c.temporario} calc={<CalculadoraTemporario />} />,
          },
        ]}
      />
    </Section>
  );
}
