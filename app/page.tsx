import { getPropiedadesAlquiladas } from "@/content/propiedades-alquiladas";
import { MIN_PROPIEDADES_PARA_MOSTRAR } from "@/content/propiedades-alquiladas.types";
import { Header } from "@/components/layout/Header";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/motion/Marquee";
import { Modalidades } from "@/components/sections/Modalidades";
import { Proceso } from "@/components/sections/Proceso";
import { Honorarios } from "@/components/sections/Honorarios";
import { Comparativas } from "@/components/sections/Comparativas";
import { PorQue } from "@/components/sections/PorQue";
import { PropiedadesAlquiladas } from "@/components/sections/alquiladas/PropiedadesAlquiladas";
import { TasacionSection } from "@/components/form/TasacionSection";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default async function Home() {
  const propiedades = await getPropiedadesAlquiladas();
  const mostrarAlquiladas = propiedades.length >= MIN_PROPIEDADES_PARA_MOSTRAR;

  return (
    <>
      <a
        href="#tasacion"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
      >
        Ir al formulario de tasación
      </a>
      <Header mostrarAlquiladas={mostrarAlquiladas} />
      <main>
        <Hero />
        <Marquee />
        <Modalidades />
        <Proceso />
        <Honorarios />
        <Comparativas />
        <PorQue />
        <PropiedadesAlquiladas propiedades={propiedades} />
        <TasacionSection />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
