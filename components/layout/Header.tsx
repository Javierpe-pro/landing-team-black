import Image from "next/image";
import { nav } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import logo from "@/public/brand/logo-team-black-horizontal-blanco.png";

export function Header({ mostrarAlquiladas }: { mostrarAlquiladas: boolean }) {
  const links = nav.links.filter((l) => !l.soloConPropiedades || mostrarAlquiladas);
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:h-[4.5rem] sm:px-8">
        <a href="#inicio" className="shrink-0" aria-label="Team Black by Amaya — inicio">
          <Image src={logo} alt="Team Black by Amaya" priority className="h-[22px] w-auto sm:h-7" sizes="180px" />
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-display text-[0.82rem] font-semibold text-mute transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href="#tasacion" className="min-h-10! px-4! text-sm sm:min-h-11! sm:px-5!">
          {nav.cta}
        </ButtonLink>
      </div>
    </header>
  );
}
