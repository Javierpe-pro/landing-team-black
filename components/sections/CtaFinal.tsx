import Image from "next/image";
import { ctaFinal as c } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight, IconWhatsApp } from "@/components/ui/Icons";
import { PeakLines } from "@/components/ui/PeakLines";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import aMark from "@/public/brand/a-mark.png";

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-final-titulo" className="on-dark relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <PeakLines variant="soft" className="right-[-200px] top-0 h-full w-[800px]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-2 to-ink p-7 ring-1 ring-line sm:p-14">
          <Image src={aMark} alt="" aria-hidden className="absolute right-6 top-6 h-12 w-auto sm:right-12 sm:top-12 sm:h-20" sizes="64px" />
          <h2 id="cta-final-titulo" className="display max-w-2xl pr-14 text-[2.2rem] sm:text-6xl">
            {c.titulo}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-mute">{c.texto}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#tasacion" size="lg">
              {c.cta}
              <IconArrowRight width={18} height={18} />
            </ButtonLink>
            <WhatsAppLink origen="cta_final" variant="outline" size="lg">
              <IconWhatsApp width={20} height={20} className="text-whatsapp" />
              {c.whatsapp}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
