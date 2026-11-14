import Image from "next/image";
import { hero } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconCheck, IconMapPin, IconWhatsApp } from "@/components/ui/Icons";
import { PeakLines } from "@/components/ui/PeakLines";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import aMark from "@/public/brand/a-mark.png";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="on-dark relative overflow-hidden bg-ink pb-16 pt-24 text-white sm:pb-24 sm:pt-36"
    >
      <PeakLines className="-right-40 top-0 h-[120%] w-[900px] opacity-90 sm:right-[-120px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 size-[520px] rounded-full bg-brand/15 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="animate-fade-up">
          <p className="eyebrow flex items-center gap-3 text-brand-soft">
            <span aria-hidden className="h-px w-8 bg-brand" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-titulo" className="display mt-5 text-[2.15rem] sm:mt-6 sm:text-[3.25rem] lg:text-[3.6rem]">
            {hero.titulo[0]} <span className="text-brand">{hero.titulo[1]}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-mute sm:mt-6 sm:text-lg">{hero.subtitulo}</p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <ButtonLink href="#tasacion" size="lg">
              {hero.ctaPrimario}
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
            <WhatsAppLink origen="hero" variant="outline" size="lg">
              <IconWhatsApp width={20} height={20} className="text-whatsapp" />
              {hero.ctaSecundario}
            </WhatsAppLink>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white ring-1 ring-line">
            <IconMapPin width={16} height={16} className="text-brand-soft" />
            {hero.zona}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-7 sm:gap-8">
            {hero.datos.map((d) => (
              <div key={d.valor}>
                <dt className="sr-only">{d.label}</dt>
                <dd>
                  <span className="num block text-[1.6rem] text-white sm:text-4xl">{d.valor}</span>
                  <span aria-hidden className="mt-1.5 block text-[0.78rem] leading-snug text-mute sm:text-sm">
                    {d.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-mute">
            <span className="num text-base text-white">{hero.social.valor}</span> {hero.social.label}
          </p>
        </div>

        {/* Panel: lo que incluye el servicio (solo desktop/tablet ancho) */}
        <aside
          aria-label={hero.panelTitulo}
          className="relative hidden animate-fade-up rounded-3xl bg-ink-2/80 p-8 ring-1 ring-line backdrop-blur [animation-delay:120ms] lg:block"
        >
          <Image src={aMark} alt="" aria-hidden className="absolute -top-7 right-8 h-14 w-auto" sizes="48px" />
          <p className="eyebrow text-brand-soft">{hero.panelTitulo}</p>
          <ol className="mt-6 space-y-4">
            {hero.panelItems.map((it, i) => (
              <li key={it} className="flex items-start gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="num w-6 shrink-0 pt-0.5 text-sm text-brand-soft">0{i + 1}</span>
                <span className="text-[0.98rem] text-white">{it}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-brand/10 p-4 text-sm text-white ring-1 ring-brand/30">
            <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-brand-soft" />
            {hero.panelPie}
          </p>
        </aside>
      </div>
    </section>
  );
}
