import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LABELS } from "@/lib/lead-schema";
import { LEADS_STORAGE_MODE, getLeadsStore, type StoredLead } from "@/lib/leads-store";

/**
 * Visor de leads de PRUEBA. Solo existe en desarrollo (`npm run dev`).
 * En producción devuelve 404 siempre. Para ver leads reales: panel de Supabase.
 */
export const metadata: Metadata = {
  title: "Leads de prueba · solo desarrollo",
  robots: { index: false, follow: false },
};

const label = <K extends keyof typeof LABELS>(k: K, v: string | null) =>
  v ? ((LABELS[k] as Record<string, string>)[v] ?? v) : "—";

async function LeadsTable() {
  await connection();
  let leads: StoredLead[] = [];
  let error: string | null = null;
  try {
    leads = await getLeadsStore().list(200);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error) return <p className="rounded-xl bg-red-950 p-4 text-red-200">{error}</p>;
  if (!leads.length)
    return <p className="text-mute">Todavía no hay envíos. Completá el formulario en la home para probar.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
      <table className="w-full min-w-[1100px] text-left text-sm">
        <thead className="bg-ink-2 text-xs uppercase tracking-wider text-mute">
          <tr>
            {["Fecha", "Nombre", "WhatsApp", "Email", "Modalidad", "Propiedad", "Barrio", "Disponible", "Valor", "UTM", "event_id"].map(
              (h) => (
                <th key={h} className="px-3 py-3 font-semibold">
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((l) => (
            <tr key={l.id} className="align-top">
              <td className="whitespace-nowrap px-3 py-3 text-mute">
                {new Date(l.created_at).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
              </td>
              <td className="px-3 py-3 font-semibold">{l.nombre}</td>
              <td className="whitespace-nowrap px-3 py-3">{l.whatsapp}</td>
              <td className="px-3 py-3">{l.email ?? "—"}</td>
              <td className="px-3 py-3">{label("modalidad", l.modalidad)}</td>
              <td className="px-3 py-3">
                {label("tipo_propiedad", l.tipo_propiedad)} · {label("ambientes", l.ambientes)}
                {l.m2 ? ` · ${l.m2} m²` : ""}
                {l.amoblada ? ` · Amoblada: ${label("amoblada", l.amoblada)}` : ""}
                {l.internet ? ` · Internet: ${label("internet", l.internet)}` : ""}
                {l.comentarios ? <p className="mt-1 text-xs text-mute">“{l.comentarios}”</p> : null}
              </td>
              <td className="px-3 py-3">{l.barrio}</td>
              <td className="px-3 py-3">{label("disponibilidad", l.disponibilidad)}</td>
              <td className="px-3 py-3">{l.valor_esperado ?? "—"}</td>
              <td className="px-3 py-3 text-xs text-mute">
                {[l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(" / ") || "—"}
                {l.fbclid ? <span className="block">fbclid ✓</span> : null}
              </td>
              <td className="px-3 py-3 font-mono text-[0.7rem] text-mute">{l.event_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminLeadsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-dvh bg-ink px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow text-yellow-300">Solo desarrollo · bloqueado en producción</p>
        <h1 className="display mt-3 text-3xl">Leads de prueba</h1>
        <p className="mb-8 mt-2 text-sm text-mute">
          Almacenamiento: <code className="text-white">{LEADS_STORAGE_MODE}</code>
          {LEADS_STORAGE_MODE === "file" ? " → .data/leads.jsonl" : " → tabla public.leads"}
        </p>
        <Suspense fallback={<p className="text-mute">Cargando…</p>}>
          <LeadsTable />
        </Suspense>
      </div>
    </main>
  );
}
