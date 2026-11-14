import { Fragment } from "react";

/**
 * Renderiza un texto de copy.ts resaltando los marcadores [COMPLETAR: …]
 * para que sean imposibles de pasar por alto antes de salir a producción.
 */
export function Txt({ children }: { children: string }) {
  if (!children.includes("[COMPLETAR")) return <>{children}</>;
  const parts = children.split(/(\[COMPLETAR[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[COMPLETAR") ? (
          <mark key={i} className="completar">
            {p}
          </mark>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Reemplaza {clave} en un template de copy. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
