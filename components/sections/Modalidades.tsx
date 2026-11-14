import { modalidades as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconHome, IconShield, IconSofa, IconWifi } from "@/components/ui/Icons";

type Modalidad = typeof c.tradicional | typeof c.temporario;

function Card({ m, icons, paraQuienTitulo }: { m: Modalidad; icons: [typeof IconHome, typeof IconHome]; paraQuienTitulo: string }) {
  return (
    <article className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_1px_0_rgb(10_10_15/0.04),0_20px_50px_-30px_rgb(10_10_15/0.25)] ring-1 ring-ink/[0.06] sm:p-9">
      <p className="eyebrow inline-flex self-start rounded-md bg-brand px-3 py-1.5 text-white">{m.tag}</p>
      <h3 className="display mt-5 text-2xl sm:text-[1.9rem]">{m.titulo}</h3>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-mute-dark">{m.resumen}</p>

      <dl className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-2.5">
        {m.datos.map((d) => (
          <div
            key={d.valor}
            className="flex items-baseline justify-between gap-4 rounded-2xl bg-paper px-4 py-3 sm:block sm:p-4"
          >
            <dt className="num text-lg text-ink sm:text-xl">{d.valor}</dt>
            <dd className="text-right text-sm leading-snug text-mute-dark sm:mt-1 sm:text-left sm:text-xs">{d.label}</dd>
          </div>
        ))}
      </dl>

      <p className="eyebrow mt-7 text-mute-dark">{m.respaldoTitulo}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {m.respaldo.map((r, i) => {
          const Icon = icons[i];
          return (
            <li key={r.titulo} className="rounded-2xl p-4 ring-1 ring-ink/10">
              <Icon className="text-brand-ink" />
              <p className="mt-2.5 font-display text-[0.95rem] font-bold">{r.titulo}</p>
              <p className="mt-1 text-sm leading-relaxed text-mute-dark">{r.texto}</p>
            </li>
          );
        })}
      </ul>

      <div className="mb-7 mt-6 rounded-2xl bg-ink p-5 text-white">
        <p className="eyebrow text-mute">{paraQuienTitulo}</p>
        <p className="mt-2 font-display text-[0.98rem] font-bold leading-snug">{m.paraQuien}</p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink/10 pt-6">
        <div>
          <p className="eyebrow text-mute-dark">{c.honorarioLabel}</p>
          <p className="mt-1 text-sm text-mute-dark">{m.honorario.detalle}</p>
        </div>
        <p className="num text-4xl text-brand-ink sm:text-5xl">{m.honorario.valor}</p>
      </div>
    </article>
  );
}

export function Modalidades() {
  return (
    <Section id="modalidades" tone="light" eyebrow={c.eyebrow} title={c.titulo} intro={c.intro}>
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card m={c.tradicional} icons={[IconHome, IconShield]} paraQuienTitulo={c.paraQuienTitulo} />
        <Card m={c.temporario} icons={[IconSofa, IconWifi]} paraQuienTitulo={c.temporario.paraQuienTitulo} />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="display text-xl sm:text-2xl">{c.guia.titulo}</p>
          <p className="mt-2 max-w-xl text-mute">{c.guia.texto}</p>
        </div>
        <ButtonLink href="#tasacion" className="w-full shrink-0 sm:w-auto">
          {c.guia.cta}
          <IconArrowRight width={18} height={18} />
        </ButtonLink>
      </div>
    </Section>
  );
}
