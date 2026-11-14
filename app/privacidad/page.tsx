import type { Metadata } from "next";
import Link from "next/link";
import { marca } from "@/content/copy";
import { Txt } from "@/components/ui/Txt";

export const metadata: Metadata = {
  title: "Política de privacidad · Team Black by Amaya",
  description: "Cómo tratamos los datos que nos dejás en el formulario de tasación.",
};

/**
 * BORRADOR — debe ser revisado por un asesor legal antes de publicar en producción.
 * Los [COMPLETAR] se ven resaltados hasta que se completen.
 */
const secciones: { id?: string; titulo: string; texto: string[] }[] = [
  {
    titulo: "1. Responsable de los datos",
    texto: [
      `Los datos que completás en este sitio son tratados por ${marca.broker} (${marca.equipoCompleto}, ${marca.empresa}). [COMPLETAR: razón social, CUIT y domicilio legal del responsable]. Contacto: ${marca.email}.`,
    ],
  },
  {
    titulo: "2. Qué datos recolectamos",
    texto: [
      "Los que nos das en el formulario: nombre y apellido, WhatsApp, email (opcional), datos de la propiedad (modalidad, tipo, barrio, dirección aproximada, ambientes, m², piso y depto, equipamiento, disponibilidad, valor esperado y comentarios).",
      "Datos técnicos de la visita: origen de la campaña (parámetros UTM y fbclid), página de referencia, URL de llegada, tipo de navegador y un identificador irreversible (hash) derivado de tu IP, usado solo para prevenir abusos. No guardamos tu IP.",
    ],
  },
  {
    titulo: "3. Para qué los usamos",
    texto: [
      "Para contactarte por WhatsApp o email, tasar tu propiedad y ofrecerte nuestros servicios de alquiler. También para medir qué anuncios funcionan.",
      "No vendemos ni cedemos tus datos a terceros. Solo los procesan proveedores necesarios para operar el sitio (alojamiento web y base de datos), bajo obligaciones de confidencialidad.",
    ],
  },
  {
    id: "cookies",
    titulo: "4. Cookies y medición",
    texto: [
      "Si está activo, usamos el Meta Pixel para medir visitas y envíos del formulario. No enviamos a Meta tu nombre, teléfono ni email. Podés rechazar la medición desde el aviso de cookies o borrando las cookies de tu navegador.",
    ],
  },
  {
    titulo: "5. Cuánto tiempo los guardamos",
    texto: ["[COMPLETAR: plazo de conservación de los datos]"],
  },
  {
    titulo: "6. Tus derechos (Ley 25.326)",
    texto: [
      `Podés acceder, rectificar, actualizar o pedir la supresión de tus datos en cualquier momento escribiendo a ${marca.email}. El derecho de acceso se puede ejercer en forma gratuita a intervalos no inferiores a seis meses, salvo interés legítimo (art. 14, inc. 3, Ley 25.326).`,
      "La Agencia de Acceso a la Información Pública, como órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos de quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.",
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <main className="on-light min-h-dvh bg-paper px-5 py-14 text-ink sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-ink underline underline-offset-2">
          ← Volver
        </Link>
        <p className="mt-6 rounded-xl border-2 border-dashed border-yellow-500 bg-yellow-100 p-4 text-sm text-yellow-900">
          <strong>Borrador.</strong> Revisar con un asesor legal antes de salir a producción.
        </p>
        <h1 className="display mt-8 text-4xl">Política de privacidad</h1>
        <p className="mt-3 text-mute-dark">
          Última actualización: <Txt>[COMPLETAR: fecha]</Txt>
        </p>
        {secciones.map((s) => (
          <section key={s.titulo} id={s.id} className="mt-10 scroll-mt-8">
            <h2 className="font-display text-xl font-bold">{s.titulo}</h2>
            {s.texto.map((t) => (
              <p key={t} className="mt-3 leading-relaxed text-mute-dark">
                <Txt>{t}</Txt>
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
