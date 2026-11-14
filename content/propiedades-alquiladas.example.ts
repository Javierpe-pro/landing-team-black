/**
 * ⚠️ EJEMPLO — NO PUBLICAR ⚠️
 *
 * Este archivo solo muestra el FORMATO para cargar propiedades alquiladas.
 * Los datos son ficticios y NO se importan en ningún lado de la web.
 * Copiá la estructura a `content/propiedades-alquiladas.ts` con datos reales.
 *
 * Campos obligatorios: id, titulo, barrio, tipo, ambientes, modalidad, fotos.
 * Campos opcionales (se muestran solo si existen): diasHastaAlquilar, valorAlquiler,
 *   plazoContratoMeses, testimonioPropietario, destacada, fechaAlquiler.
 *
 * Fotos: /public/img/alquiladas/ · JPG o WebP · 1600 px de ancho · horizontales 4:3 ·
 *   menos de 400 KB cada una. Sin personas, sin carteles con la dirección.
 *
 * Privacidad: solo barrio (nunca calle/altura ni datos del inquilino).
 * valorAlquiler y testimonioPropietario: SOLO con autorización del propietario.
 */
import type { PropiedadAlquilada } from "./propiedades-alquiladas.types";

export const EJEMPLOS_NO_PUBLICAR: PropiedadAlquilada[] = [
  {
    id: "ejemplo-palermo-2amb",
    titulo: "EJEMPLO — NO PUBLICAR · 2 ambientes luminoso en Palermo",
    barrio: "Palermo",
    tipo: "Departamento",
    ambientes: 2,
    modalidad: "tradicional",
    fotos: ["/img/alquiladas/ejemplo-palermo-1.jpg", "/img/alquiladas/ejemplo-palermo-2.jpg"],
    diasHastaAlquilar: 0, // EJEMPLO — reemplazar por el dato real
    plazoContratoMeses: 24,
    destacada: true,
    fechaAlquiler: "2000-01-01",
  },
  {
    id: "ejemplo-recoleta-mono",
    titulo: "EJEMPLO — NO PUBLICAR · Monoambiente equipado en Recoleta",
    barrio: "Recoleta",
    tipo: "Departamento",
    ambientes: 1,
    modalidad: "temporario",
    fotos: ["/img/alquiladas/ejemplo-recoleta-1.jpg"],
    valorAlquiler: { monto: 0, moneda: "USD" }, // EJEMPLO — solo con autorización
    testimonioPropietario: {
      texto: "EJEMPLO — NO PUBLICAR. Acá va el texto real, con autorización escrita.",
      nombre: "Nombre del propietario (EJEMPLO)",
    },
    fechaAlquiler: "2000-01-01",
  },
];
