import Image from "next/image";
import { hero } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconCheck, IconMapPin, IconWhatsApp } from "@/components/ui/Icons";
import { PeakLines } from "@/components/ui/PeakLines";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { CountUp } from "@/components/motion/CountUp";
import aMark from "@/public/brand/a-mark.png";

/** Retraso escalonado para la entrada del hero (el h1 no se anima: es el LCP). */
const d = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="on-dark relative overflow-hidden bg-ink pb-16 pt-24 text-white sm:pb-24 sm:pt-36"
    >
      <PeakLines draw className="-right-40 top-0 h-[120%] w-[900px] opacity-90 sm:right-[-120px]" />
      <div aria-hidden className="glow pointer-events-none absolute -left-60 top-0 size-[760px] animate-drift will-change-transform" />
      <div
        aria-hidden
        className="glow pointer-events-none absolute -right-72 bottom-[-20rem] size-[640px] animate-drift opacity-70 will-change-transform [animation-delay:-9s]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow flex animate-fade-up items-center gap-3 text-brand-soft">
            <span aria-hidden className="h-px w-8 bg-brand" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-titulo" className="display mt-5 text-[2.15rem] sm:mt-6 sm:text-[3.25rem] lg:text-[3.6rem]">
            {hero.titulo[0]} <span className="text-shimmer">{hero.titulo[1]}</span>
          </h1>

          <p
            className="mt-5 max-w-xl animate-fade-up text-[1.02rem] leading-relaxed text-mute sm:mt-6 sm:text-lg"
            style={d(120)}
          >
            {hero.subtitulo}
          </p>

          <div className="mt-7 flex animate-fade-up flex-col gap-3 sm:mt-8 sm:flex-row" style={d(220)}>
            <ButtonLink href="#tasacion" size="lg">
              {hero.ctaPrimario}
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
            <WhatsAppLink origen="hero" variant="outline" size="lg">
              <IconWhatsApp width={20} height={20} className="text-whatsapp" />
              {hero.ctaSecundario}
            </WhatsAppLink>
          </div>

          <p
            className="mt-4 inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white ring-1 ring-line"
            style={d(300)}
          >
            <span className="relative grid size-4 place-items-center">
              <span aria-hidden className="absolute size-4 animate-ping rounded-full bg-brand/40" />
              <IconMapPin width={16} height={16} className="relative text-brand-soft" />
            </span>
            {hero.zona}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-7 sm:gap-8">
            {hero.datos.map((dato, i) => (
              <div key={dato.valor} className="animate-fade-up" style={d(380 + i * 90)}>
                <dt className="sr-only">{dato.label}</dt>
                <dd>
                  <CountUp value={dato.valor} className="num block text-[1.6rem] text-white sm:text-4xl" />
                  <span aria-hidden className="mt-1.5 block text-[0.78rem] leading-snug text-mute sm:text-sm">
                    {dato.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 animate-fade-up text-sm text-mute" style={d(660)}>
            <CountUp value={hero.social.valor} className="num text-base text-white" /> {hero.social.label}
          </p>
        </div>

        {/* Panel: lo que incluye el servicio (solo desktop) */}
        <aside
          aria-label={hero.panelTitulo}
          className="relative hidden animate-fade-up rounded-3xl bg-ink-2/90 p-8 ring-1 ring-line lg:block"
          style={d(150)}
        >
          <Image
            src={aMark}
            alt=""
            aria-hidden
            className="absolute -top-7 right-8 h-14 w-auto animate-float"
            sizes="48px"
          />
          <p className="eyebrow text-brand-soft">{hero.panelTitulo}</p>
          <ol className="mt-6 space-y-4">
            {hero.panelItems.map((it, i) => (
              <li
                key={it}
                className="flex animate-fade-up items-start gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
                style={d(350 + i * 110)}
              >
                <span className="num w-6 shrink-0 pt-0.5 text-sm text-brand-soft">0{i + 1}</span>
                <span className="text-[0.98rem] text-white">{it}</span>
              </li>
            ))}
          </ol>
          <p
            className="mt-6 flex animate-fade-up items-start gap-3 rounded-2xl bg-brand/10 p-4 text-sm text-white ring-1 ring-brand/30"
            style={d(1050)}
          >
            <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-brand-soft" />
            {hero.panelPie}
          </p>
        </aside>
      </div>
    </section>
  );
}
