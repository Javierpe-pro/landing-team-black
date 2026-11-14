import { proceso as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { IconCheck } from "@/components/ui/Icons";
import { PeakLines } from "@/components/ui/PeakLines";

export function Proceso() {
  return (
    <Section id="proceso" tone="dark" eyebrow={c.eyebrow} title={c.titulo} intro={c.intro}>
      <PeakLines variant="soft" className="-left-60 top-0 h-full w-[800px]" />
      <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {/* Timeline vertical */}
        <div>
          <ol className="relative">
            {c.pasos.map((p, i) => {
              const ultimo = i === c.pasos.length - 1;
              return (
                <li key={p.titulo} className="relative grid grid-cols-[3rem_1fr] gap-4 pb-8 last:pb-0 sm:grid-cols-[3.5rem_1fr]">
                  {!ultimo && (
                    <span aria-hidden className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-brand/60 to-line sm:left-7" />
                  )}
                  <span
                    className={`num relative grid size-12 place-items-center rounded-full text-sm ring-1 sm:size-14 sm:text-base ${
                      ultimo ? "bg-brand text-white ring-brand" : "bg-ink-2 text-brand-soft ring-line"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div className="pt-2.5 sm:pt-3.5">
                    <h3 className="font-display text-lg font-bold">{p.titulo}</h3>
                    <p className="mt-1.5 text-[0.98rem] leading-relaxed text-mute">{p.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-10 flex items-start gap-3 rounded-2xl bg-white/[0.04] p-5 text-[0.98rem] text-white ring-1 ring-line">
            <IconCheck className="mt-0.5 shrink-0 text-brand-soft" />
            {c.nota}
          </p>
        </div>

        {/* Temporario: valor de salida + durante el contrato */}
        <aside className="self-start rounded-3xl bg-ink-2 p-6 ring-1 ring-line sm:p-8 lg:sticky lg:top-28">
          <p className="eyebrow inline-flex rounded-md bg-brand px-3 py-1.5 text-white">{c.temporario.tag}</p>
          <h3 className="display mt-5 text-2xl">{c.temporario.titulo}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{c.temporario.texto}</p>
          <ol className="mt-6 grid grid-cols-3 gap-2.5">
            {c.temporario.factores.map((f, i) => (
              <li key={f} className="rounded-2xl bg-ink p-3.5 ring-1 ring-line">
                <span className="num block text-xs text-brand-soft">0{i + 1}</span>
                <span className="mt-1.5 block font-display text-[0.82rem] font-bold sm:text-sm">{f}</span>
              </li>
            ))}
          </ol>
          <p className="eyebrow mt-8 text-mute">{c.temporario.duranteTitulo}</p>
          <ul className="mt-4 space-y-3">
            {c.temporario.durante.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[0.95rem]">
                <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-brand-soft" />
                {d}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
