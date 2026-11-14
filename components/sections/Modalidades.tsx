import { modalidades as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";
import { reveal } from "@/components/motion/reveal";
import { ModalidadSelector } from "./ModalidadSelector";

export function Modalidades() {
  return (
    <Section id="modalidades" tone="light" eyebrow={c.eyebrow} title={c.titulo} intro={c.intro}>
      <div data-reveal="">
        <ModalidadSelector />
      </div>

      <div
        {...reveal(0, "scale")}
        className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8"
      >
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
