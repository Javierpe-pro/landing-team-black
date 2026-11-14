"use client";

import { useId, useState } from "react";
import { honorarios as c } from "@/content/copy";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const ars = (n: number) => `$ ${nf.format(Math.round(n))}`;
const usd = (n: number) => `USD ${nf.format(Math.round(n))}`;
const MAX = 999_999_999;

function MontoInput({
  label,
  prefix,
  value,
  onChange,
}: {
  label: string;
  prefix: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-mute">
        {label}
      </label>
      <div className="mt-2 flex min-h-14 items-center rounded-2xl bg-ink px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand">
        <span aria-hidden className="mr-2 font-display text-sm font-bold text-mute">
          {prefix}
        </span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={value ? nf.format(value) : ""}
          placeholder="0"
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, "").slice(0, 9));
            onChange(Math.min(n, MAX));
          }}
          className="num w-full bg-transparent text-xl text-white outline-none placeholder:text-mute/50"
        />
      </div>
    </div>
  );
}

function Fila({ label, valor, fuerte = false }: { label: string; valor: string; fuerte?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-3 ${fuerte ? "" : "border-b border-line"}`}>
      <dt className={fuerte ? "font-display font-bold text-white" : "text-sm text-mute"}>{label}</dt>
      <dd className={`num whitespace-nowrap text-right ${fuerte ? "text-[1.7rem] text-brand-soft sm:text-4xl" : "text-lg text-white"}`}>
        {valor}
      </dd>
    </div>
  );
}

export function CalculadoraTradicional() {
  const t = c.tradicional.calc;
  const [alquiler, setAlquiler] = useState<number>(t.alquilerDefault);
  const [plazo, setPlazo] = useState<number>(t.plazoDefault);
  const total = alquiler * plazo;
  const hon = total * 0.0415;
  const gid = useId();

  return (
    <div className="space-y-5">
      <MontoInput label={t.alquilerLabel} prefix="$" value={alquiler} onChange={setAlquiler} />
      <fieldset>
        <legend id={gid} className="text-sm font-medium text-mute">
          {t.plazoLabel}
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby={gid}>
          {t.plazos.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={plazo === p}
              onClick={() => setPlazo(p)}
              className={`min-h-12 rounded-2xl font-display text-sm font-bold ring-1 transition-colors ${
                plazo === p ? "bg-brand text-white ring-brand" : "bg-ink text-mute ring-line hover:text-white"
              }`}
            >
              {p} meses
            </button>
          ))}
        </div>
      </fieldset>
      <dl aria-live="polite">
        <Fila label={t.totalLabel} valor={ars(total)} />
        <Fila label={t.honorariosLabel} valor={ars(hon)} fuerte />
      </dl>
    </div>
  );
}

export function CalculadoraTemporario() {
  const t = c.temporario.calc;
  const [alquiler, setAlquiler] = useState<number>(t.alquilerDefault);
  const trimestre = alquiler * 3;
  const hon = trimestre * 0.15;
  return (
    <div className="space-y-5">
      <MontoInput label={t.alquilerLabel} prefix="USD" value={alquiler} onChange={setAlquiler} />
      <dl aria-live="polite">
        <Fila label={t.trimestreLabel} valor={usd(trimestre)} />
        <Fila label={t.honorariosLabel} valor={usd(hon)} fuerte />
      </dl>
    </div>
  );
}
