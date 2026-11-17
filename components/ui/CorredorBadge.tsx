import { marca } from "@/content/copy";
import { IconShield } from "@/components/ui/Icons";

/** Sello de respaldo legal: corredor inmobiliario matriculado responsable de la operación. */
export function CorredorBadge({ className = "" }: { className?: string }) {
  const c = marca.corredor;
  return (
    <p
      className={`inline-flex items-start gap-2.5 text-sm leading-snug text-white/90 ${className}`}
    >
      <IconShield width={18} height={18} className="mt-0.5 shrink-0 text-brand-soft" />
      <span>
        Operación a cargo de <strong className="font-semibold text-white">{c.nombre}</strong>, {c.rol.toLowerCase()} ·{" "}
        <strong className="whitespace-nowrap font-semibold text-white">{c.cpi}</strong>
      </span>
    </p>
  );
}
