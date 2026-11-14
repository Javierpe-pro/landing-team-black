import Image from "next/image";
import Link from "next/link";
import { footer, marca } from "@/content/copy";
import { INSTAGRAM } from "@/lib/site";
import { WhatsAppLink } from "@/components/tracking/WhatsAppLink";
import { IconGlobe, IconInstagram, IconMail, IconWhatsApp } from "@/components/ui/Icons";
import logo from "@/public/brand/logo-team-black-blanco.png";

export function Footer() {
  const linkCls = "inline-flex min-h-11 items-center gap-3 text-white/90 transition-colors hover:text-white";
  return (
    <footer className="on-dark border-t border-line bg-ink pb-28 pt-16 text-white md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src={logo} alt="Team Black by Amaya" className="h-16 w-auto" sizes="140px" />
          <p className="mt-6 text-sm text-mute">
            {marca.broker} · {marca.rol}
            <br />
            {marca.empresa} · {marca.ciudad}
          </p>
          <p className="mt-3 text-sm text-mute">{footer.zona}</p>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-brand-soft">{footer.contactoTitulo}</h2>
          <ul className="space-y-1 text-[0.95rem]">
            <li>
              <WhatsAppLink origen="footer" unstyled className={linkCls}>
                <IconWhatsApp width={18} height={18} className="text-whatsapp" />
                {marca.whatsappDisplay}
              </WhatsAppLink>
            </li>
            <li>
              <a href={`mailto:${marca.email}`} className={linkCls}>
                <IconMail width={18} height={18} className="text-mute" />
                {marca.email}
              </a>
            </li>
            <li>
              <a href={marca.webUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                <IconGlobe width={18} height={18} className="text-mute" />
                {marca.web}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-brand-soft">{footer.redesTitulo}</h2>
          <ul className="space-y-1 text-[0.95rem]">
            {[
              { href: INSTAGRAM.teamblack, label: marca.instagram.teamblack },
              { href: INSTAGRAM.javier, label: marca.instagram.javier },
              { href: INSTAGRAM.amaya, label: marca.instagram.amaya },
            ].map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <IconInstagram width={18} height={18} className="text-mute" />
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <div className="border-t border-line pt-8 text-xs leading-relaxed text-mute">
          {footer.legal.map((l) => (
            <p key={l} className="mb-1.5">
              {l}
            </p>
          ))}
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{footer.derechos}</span>
            <Link href="/privacidad" className="inline-flex min-h-11 items-center text-white underline underline-offset-2">
              {footer.privacidad}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
