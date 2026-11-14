import { alquiladas as c } from "@/content/copy";
import {
  MIN_PROPIEDADES_PARA_MOSTRAR,
  type PropiedadAlquilada,
} from "@/content/propiedades-alquiladas.types";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";
import { fill } from "@/components/ui/Txt";
import { AlquiladasGrid } from "./AlquiladasGrid";

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * "Propiedades que ya alquilamos".
 * - Producción: NO se renderiza con menos de 3 propiedades reales.
 * - Desarrollo: si faltan, muestra un placeholder marcado + vista previa con
 *   los ejemplos ficticios (que nunca llegan al build de producción).
 */
export async function PropiedadesAlquiladas({ propiedades }: { propiedades: PropiedadAlquilada[] }) {
  const suficientes = propiedades.length >= MIN_PROPIEDADES_PARA_MOSTRAR;

  if (!suficientes && !IS_DEV) return null;

  let preview: PropiedadAlquilada[] = [];
  if (!suficientes && IS_DEV) {
    const { EJEMPLOS_NO_PUBLICAR } = await import("@/content/propiedades-alquiladas.example");
    preview = EJEMPLOS_NO_PUBLICAR;
  }
  const lista = suficientes ? propiedades : preview;

  return (
    <Section
      id="alquiladas"
      tone="dark"
      eyebrow={c.eyebrow}
      title={fill(c.contador, { n: suficientes ? propiedades.length : 0 })}
      intro={c.intro}
    >
      {!suficientes && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-yellow-400/70 bg-yellow-400/10 p-5 text-sm text-yellow-200">
          <strong className="font-display">SOLO DESARROLLO · </strong>
          {c.placeholderDev} La vista previa de abajo usa datos marcados “EJEMPLO — NO PUBLICAR”.
        </div>
      )}

      <AlquiladasGrid propiedades={lista} demo={!suficientes} />

      <div className="mt-10 flex justify-center">
        <ButtonLink href="#tasacion" size="lg" className="w-full sm:w-auto">
          {c.cta}
          <IconArrowRight width={18} height={18} />
        </ButtonLink>
      </div>
    </Section>
  );
}
