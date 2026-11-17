import Image from "next/image";
import { porQue as c } from "@/content/copy";
import { INSTAGRAM } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Txt } from "@/components/ui/Txt";
import { IconInstagram, IconWhatsApp } from "@/components/ui/Icons";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/CountUp";

export function PorQue() {
  return (
    <Section id="por-que" tone="light" eyebrow={c.eyebrow} title={c.titulo}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
        {/* Javier */}
        <article {...reveal(0, "left")} className="on-dark overflow-hidden rounded-3xl bg-ink text-white">
          <Image
            src="/img/javier.jpg"
            alt={c.javier.fotoAlt}
            width={854}
            height={961}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/4.5] w-full object-cover object-[50%_20%]"
          />
          <div className="p-6 sm:p-8">
            <h3 className="display text-2xl">{c.javier.nombre}</h3>
            <p className="mt-1 text-sm text-brand-soft">{c.javier.rol}</p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-mute">
              <Txt>{c.javier.bio}</Txt>
            </p>
            <WhatsAppLink origen="por_que_javier" className="mt-6 w-full sm:w-auto">
              <IconWhatsApp width={20} height={20} />
              {c.javier.cta}
            </WhatsAppLink>
          </div>
        </article>

        <div className="flex flex-col gap-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.diferenciales.map((d, i) => (
              <li
                key={d.titulo}
                {...reveal(i)}
                className="group rounded-3xl bg-white p-6 ring-1 ring-ink/[0.06] hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(10_10_15/0.35)]"
              >
                <span className="num inline-grid size-9 place-items-center rounded-full bg-paper text-sm text-brand-ink transition-colors group-hover:bg-brand group-hover:text-white">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{d.titulo}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-mute-dark">{d.texto}</p>
              </li>
            ))}
          </ul>

          <div data-reveal="" className="rounded-3xl bg-white p-6 ring-1 ring-ink/[0.06]">
            <p className="eyebrow text-brand-ink">{c.temporarioTitulo}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {c.temporarioExtra.map((d) => (
                <li key={d.titulo}>
                  <h3 className="font-display font-bold">{d.titulo}</h3>
                  <p className="mt-1 text-[0.95rem] text-mute-dark">{d.texto}</p>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={INSTAGRAM.amaya}
            target="_blank"
            rel="noopener noreferrer"
            {...reveal(0, "scale")}
            className="group flex items-center justify-between gap-4 rounded-3xl bg-brand p-6 text-white hover:-translate-y-1 hover:brightness-110 sm:p-7"
          >
            <span>
              <CountUp value={c.social.valor} className="num block text-5xl sm:text-6xl" />
              <span className="mt-1 block font-display text-sm font-bold">
                {c.social.label} · {c.social.cuenta}
              </span>
            </span>
            <IconInstagram width={36} height={36} className="shrink-0 opacity-90 transition-transform group-hover:scale-110" />
          </a>

          {/*
            TESTIMONIOS — oculto hasta tener testimonios REALES con autorización del propietario.
            No inventar. Para activarlo, crear un array en content/copy.ts y renderizarlo acá.
          */}
        </div>
      </div>
    </Section>
  );
}
