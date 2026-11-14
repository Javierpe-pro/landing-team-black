import { comparativas as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";
import { reveal } from "@/components/motion/reveal";

type Fila = { label: string; a: string; b: string };

/** Tabla en desktop; tarjetas apilables en mobile (sin scroll horizontal). */
function Comparativa({
  columnas,
  grupos,
  caption,
}: {
  columnas: readonly [string, string];
  grupos: { titulo?: string; filas: Fila[] }[];
  caption: string;
}) {
  return (
    <>
      {/* Desktop / tablet */}
      <table data-reveal="" className="hidden w-full border-collapse text-left md:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <td className="w-[22%]" />
            <th scope="col" className="eyebrow w-[39%] rounded-t-2xl bg-white/[0.05] px-5 py-4 text-white">
              {columnas[0]}
            </th>
            <th scope="col" className="eyebrow w-[39%] px-5 py-4 text-mute">
              {columnas[1]}
            </th>
          </tr>
        </thead>
        {grupos.map((g, gi) => (
          <tbody key={gi}>
            {g.titulo && (
              <tr>
                <th colSpan={3} scope="colgroup" className="pb-2 pt-7 font-display text-sm font-bold text-brand-soft">
                  {g.titulo}
                </th>
              </tr>
            )}
            {g.filas.map((f) => (
              <tr key={f.label} className="border-t border-line transition-colors hover:bg-white/[0.03]">
                <th scope="row" className="py-4 pr-4 font-display text-sm font-bold text-white">
                  {f.label}
                </th>
                <td className="bg-white/[0.05] px-5 py-4 text-[0.95rem] text-white">{f.a}</td>
                <td className="px-5 py-4 text-[0.95rem] text-mute">{f.b}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>

      {/* Mobile: tarjetas */}
      <div className="space-y-6 md:hidden">
        {grupos.map((g, gi) => (
          <div key={gi}>
            {g.titulo && <p className="mb-3 font-display text-sm font-bold text-brand-soft">{g.titulo}</p>}
            <ul className="space-y-3">
              {g.filas.map((f, i) => (
                <li key={f.label} {...reveal(i % 3, undefined, 70)} className="rounded-2xl bg-ink-2 p-4 ring-1 ring-line">
                  <p className="font-display text-[0.95rem] font-bold text-white">{f.label}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-brand/10 p-3 ring-1 ring-brand/30">
                      <dt className="eyebrow text-[0.62rem] text-brand-soft">{columnas[0]}</dt>
                      <dd className="mt-1.5 text-sm leading-snug text-white">{f.a}</dd>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <dt className="eyebrow text-[0.62rem] text-mute">{columnas[1]}</dt>
                      <dd className="mt-1.5 text-sm leading-snug text-mute">{f.b}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function Comparativas() {
  return (
    <Section id="comparativas" tone="dark" eyebrow={c.eyebrow} title={c.titulo}>
      <div className="space-y-20">
        <div>
          <h3 data-reveal="" className="display mb-8 text-2xl sm:text-3xl">{c.tradVsTemp.titulo}</h3>
          <Comparativa
            caption={c.tradVsTemp.titulo}
            columnas={c.tradVsTemp.columnas}
            grupos={[{ filas: c.tradVsTemp.filas }]}
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <div>
            <h3 data-reveal="" className="display text-2xl sm:text-3xl">{c.tempVsAirbnb.titulo}</h3>
            <p className="mb-6 mt-3 text-mute">{c.tempVsAirbnb.intro}</p>
            <Comparativa caption={c.tempVsAirbnb.titulo} columnas={c.tempVsAirbnb.columnas} grupos={c.tempVsAirbnb.grupos} />
            <p data-reveal="" className="mt-6 rounded-2xl bg-white/[0.04] p-5 text-[0.95rem] text-white ring-1 ring-line">
              {c.tempVsAirbnb.resumen}
            </p>
          </div>

          <aside {...reveal(1, "scale", 150)} className="self-start rounded-3xl bg-white p-6 text-ink sm:p-8 lg:sticky lg:top-28">
            <h3 className="eyebrow text-brand-ink">{c.rangos.titulo}</h3>
            <p className="mt-3 text-sm text-mute-dark">{c.rangos.texto}</p>
            <dl className="mt-5">
              {c.rangos.items.map((r) => (
                <div key={r.label} className="group flex items-baseline justify-between gap-3 border-b border-ink/10 py-4 last:border-0">
                  <dt className="font-display text-[0.95rem] font-bold">{r.label}</dt>
                  <dd className="whitespace-nowrap text-right">
                    <span className="text-xs text-mute-dark">{c.rangos.desde} </span>
                    <span className="num text-xl transition-colors group-hover:text-brand-ink sm:text-2xl">{r.valor}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-mute-dark">{c.rangos.disclaimer}</p>
            <ButtonLink href="#tasacion" className="mt-6 w-full">
              {c.cta}
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
          </aside>
        </div>
      </div>
    </Section>
  );
}
