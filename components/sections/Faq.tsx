import { faq as c } from "@/content/copy";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Txt } from "@/components/ui/Txt";

export function Faq() {
  return (
    <Section id="faq" tone="light" eyebrow={c.eyebrow} title={c.titulo}>
      <Accordion items={c.items.map((i) => ({ q: i.q, a: <Txt>{i.a}</Txt> }))} />
    </Section>
  );
}
