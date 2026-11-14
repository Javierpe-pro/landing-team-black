/**
 * TODOS los textos de la landing viven acá.
 * Para cambiar un texto, editá este archivo (no hace falta tocar componentes).
 *
 * Reglas de contenido:
 * - Solo datos reales de las propuestas de Team Black. Nada de cifras, testimonios o
 *   promesas inventadas.
 * - Lo que falta se marca como [COMPLETAR: …] y se ve resaltado en la página hasta completarlo.
 * - Español rioplatense, trato de vos.
 */

export const marca = {
  broker: "Javier Peñalver",
  rol: "Broker inmobiliario",
  equipo: "Team Black",
  equipoCompleto: "Team Black by Amaya",
  empresa: "Amaya Real Estate",
  ciudad: "Buenos Aires",
  whatsappDisplay: "+54 9 11 2650-9698",
  email: "javier@amaya.realestate",
  web: "www.amaya.realestate",
  webUrl: "https://www.amaya.realestate",
  instagram: {
    teamblack: "@teamblack.amaya",
    javier: "@javierealestate.ar",
    amaya: "@amaya.realestate",
  },
  comunidad: "+15,8K",
  comunidadDetalle: "comunidad en Instagram (@amaya.realestate)",
} as const;

export const seo = {
  title: "Alquilá tu propiedad en CABA · Team Black by Amaya",
  description:
    "Alquiler tradicional y temporario en CABA con un broker a cargo de todo: tasación con comparables, filtro de inquilinos y garantía validada. Pedí tu tasación sin costo.",
  ogAlt: "Team Black by Amaya · Alquilá tu propiedad en CABA",
};

export const nav = {
  links: [
    { label: "Modalidades", href: "#modalidades" },
    { label: "Cómo trabajamos", href: "#proceso" },
    { label: "Honorarios", href: "#honorarios" },
    { label: "Comparativas", href: "#comparativas" },
    { label: "Alquiladas", href: "#alquiladas", soloConPropiedades: true },
    { label: "Preguntas", href: "#faq" },
  ],
  cta: "Pedir tasación",
  ctaMobile: "Pedir tasación gratis",
  whatsappAria: "Escribir a Javier por WhatsApp",
};

export const hero = {
  eyebrow: "Propietarios · Alquiler en CABA",
  titulo: ["Alquilá tu propiedad en CABA", "con un broker a cargo de todo."],
  subtitulo:
    "Tasación con propiedades comparables de la zona, filtro de inquilinos y garantía validada antes de firmar. Nosotros coordinamos cada paso; vos decidís.",
  ctaPrimario: "Pedir tasación",
  ctaSecundario: "Escribir por WhatsApp",
  zona: "Solo propiedades en la Ciudad de Buenos Aires",
  datos: [
    { valor: "4,15%", label: "Honorarios en alquiler tradicional" },
    { valor: "$0", label: "Comisión para el inquilino" },
    { valor: "6 pasos", label: "De la tasación a la entrega de llaves" },
  ],
  social: { valor: "+15,8K", label: "comunidad en Instagram (@amaya.realestate)" },
  panelTitulo: "Lo que hacemos por vos",
  panelItems: [
    "Tasación con comparables de la zona",
    "Publicación en portales y redes de Amaya",
    "Visitas coordinadas y acompañadas",
    "Filtro del candidato: ingresos y documentación",
    "Garantía validada o seguro de caución gestionado",
    "Contrato, firma y entrega de llaves",
  ],
  panelPie: "La decisión final sobre el inquilino siempre es tuya.",
};

export const modalidades = {
  eyebrow: "01 — La modalidad",
  titulo: "Dos formas de alquilar. Un solo broker a cargo.",
  intro: "La misma propiedad puede rendir distinto según cómo se alquile. Elegí la que mejor se adapta a vos.",
  tradicional: {
    tag: "Alquiler tradicional",
    titulo: "Un inquilino estable, un ingreso previsible.",
    resumen:
      "Contrato de vivienda permanente. El inquilino se instala por un año o más y vos cobrás un alquiler mensual fijado por contrato.",
    datos: [
      { valor: "12 meses", label: "Plazo mínimo" },
      { valor: "24 meses", label: "El más habitual" },
      { valor: "Sin tope", label: "Lo acordás con el inquilino" },
    ],
    respaldoTitulo: "Garantía · siempre una de estas dos",
    respaldo: [
      {
        titulo: "Garantía propietaria de CABA",
        texto: "Un inmueble en la Ciudad respalda el contrato. Revisamos la documentación antes de avanzar.",
      },
      {
        titulo: "Seguro de caución",
        texto: "Una póliza de aseguradora respalda las obligaciones del inquilino. La gestionamos junto con el candidato.",
      },
    ],
    paraQuien:
      "Para el propietario que prioriza estabilidad: ingreso mensual fijo, baja rotación y menor desgaste de la propiedad.",
    honorario: { valor: "4,15%", detalle: "del valor total del contrato · $0 para el inquilino" },
  },
  temporario: {
    tag: "Alquiler temporario",
    titulo: "Propiedades listas para habitar.",
    resumen:
      "Contratos mensuales de 3 a 12 meses. La propiedad se entrega amoblada y equipada, lista para recibir al inquilino, que paga mes a mes.",
    datos: [
      { valor: "3 a 12", label: "Meses de contrato" },
      { valor: "Mensual", label: "Pago del inquilino" },
      { valor: "Amoblada", label: "Y equipada" },
    ],
    respaldoTitulo: "Qué necesita tu propiedad",
    respaldo: [
      {
        titulo: "Equipamiento completo",
        texto: "Amoblada y equipada para su uso efectivo desde el primer día.",
      },
      {
        titulo: "Internet contratado",
        texto: "El servicio de internet y wifi tiene que estar activo antes de publicar.",
      },
    ],
    paraQuien:
      "Inquilinos del exterior y del interior del país que necesitan una vivienda equipada por unos meses.",
    paraQuienTitulo: "Quién alquila",
    honorario: { valor: "15%", detalle: "solo sobre el primer trimestre" },
  },
  paraQuienTitulo: "Para quién es",
  honorarioLabel: "Honorarios",
  guia: {
    titulo: "¿No sabés cuál te conviene?",
    texto: "Lo vemos con los números de tu propiedad: valor de alquiler en cada modalidad, plazos y costos.",
    cta: "Quiero que me asesoren",
  },
};

export const proceso = {
  eyebrow: "02 — Cómo trabajamos",
  titulo: "Nos ocupamos de todo hasta la firma.",
  intro: "Seis pasos, un solo interlocutor.",
  pasos: [
    {
      titulo: "Tasación del alquiler",
      texto: "Definimos el valor de salida con comparables de la zona.",
    },
    {
      titulo: "Publicación y difusión",
      texto: "Publicamos en portales inmobiliarios y en las redes de Amaya, con fotos y ficha completa.",
    },
    {
      titulo: "Visitas",
      texto: "Coordinamos y acompañamos cada visita. Vos no tenés que mostrar la propiedad.",
    },
    {
      titulo: "Filtro del candidato",
      texto: "Revisamos ingresos y documentación antes de presentarte a un interesado.",
    },
    {
      titulo: "Garantía",
      texto: "Validamos la garantía propietaria de CABA o gestionamos el seguro de caución.",
    },
    {
      titulo: "Contrato y firma",
      texto: "Preparamos el contrato, coordinamos la firma y la entrega de llaves.",
    },
  ],
  nota: "Te mantenemos al tanto en cada paso y la decisión final sobre el inquilino siempre es tuya.",
  temporario: {
    tag: "En alquiler temporario",
    titulo: "Cada propiedad tiene un valor único.",
    texto:
      "Lo estimamos a partir de tres aspectos que, en conjunto, definen la experiencia de quien la alquila y el valor con el que sale al mercado.",
    factores: ["Distribución", "Luminosidad", "Equipamiento"],
    duranteTitulo: "Durante el contrato nos ocupamos de",
    durante: [
      "Cobros directos al propietario",
      "Check-in y check-out",
      "Gestión de limpieza entre inquilinos",
      "Reporte mensual",
      "Depósito en manos del propietario",
    ],
  },
};

export const honorarios = {
  eyebrow: "03 — Honorarios transparentes",
  titulo: "Sabés cuánto vas a pagar antes de empezar.",
  tabs: { tradicional: "Tradicional", temporario: "Temporario" },
  disclaimer: "Valores ilustrativos; el cálculo final se hace sobre tu contrato.",
  incluyeTitulo: "Incluye",
  noIncluyeTitulo: "No incluye",
  calcTitulo: "Calculá tus honorarios",
  tradicional: {
    numero: "4,15%",
    numeroDetalle: "del valor total del contrato",
    texto:
      "Los honorarios están a cargo del propietario. Es el máximo que fija la normativa de la Ciudad para alquileres de vivienda (Ley 5859).",
    destacado: "Al inquilino no se le cobra comisión.",
    pago: "Forma de pago: contado, por transferencia o en efectivo.",
    calc: {
      alquilerLabel: "Alquiler mensual (en pesos)",
      alquilerDefault: 1000000,
      plazoLabel: "Plazo del contrato",
      plazos: [12, 24, 36],
      plazoDefault: 24,
      totalLabel: "Valor total del contrato",
      honorariosLabel: "Honorarios (4,15%)",
    },
    incluye: [
      "Tasación con comparables",
      "Publicación y difusión",
      "Coordinación de visitas",
      "Filtro del candidato",
      "Validación de garantía o seguro de caución",
      "Contrato, firma y entrega de llaves",
    ],
    noIncluye: [
      "Cobro mensual del alquiler",
      "Pago de servicios y expensas",
      "Administración durante el contrato",
    ],
    noIncluyeNota: "Eso lo gestionás vos, directo con el inquilino.",
  },
  temporario: {
    numero: "15%",
    numeroDetalle: "solo del primer trimestre",
    texto: "La comisión se calcula únicamente sobre los tres primeros meses de alquiler.",
    destacado: "El resto del contrato no suma honorarios.",
    pago: "",
    calc: {
      alquilerLabel: "Alquiler mensual (en dólares)",
      alquilerDefault: 700,
      trimestreLabel: "Primer trimestre (3 meses)",
      honorariosLabel: "Honorarios (15%)",
    },
    incluye: [
      "Cobros directos al propietario",
      "Check-in y check-out",
      "Gestión de limpieza",
      "Reporte mensual",
      "Depósito en manos del propietario",
    ],
    noIncluye: [
      "Pago de servicios de la propiedad",
      "Resolución de emergencias",
      "Gestión de arreglos",
    ],
    noIncluyeNota: "Eso queda a cargo del propietario.",
  },
};

export const comparativas = {
  eyebrow: "04 — Comparativas",
  titulo: "Para decidir con datos, no a ciegas.",
  tradVsTemp: {
    titulo: "Tradicional o temporario: qué cambia.",
    columnas: ["Tradicional", "Temporario"] as const,
    filas: [
      { label: "Plazo", a: "12 meses o más", b: "De 3 a 12 meses" },
      { label: "Destino", a: "Vivienda permanente", b: "Estadías temporarias" },
      {
        label: "Equipamiento",
        a: "No requiere amoblar la propiedad",
        b: "Amoblada y equipada, con internet contratado",
      },
      {
        label: "Respaldo",
        a: "Garantía propietaria de CABA o seguro de caución",
        b: "Depósito, que retiene el propietario",
      },
      { label: "Rotación", a: "Baja: un inquilino por contrato", b: "Mayor: varios ingresos y salidas por año" },
      { label: "Honorarios", a: "4,15% del total del contrato", b: "15% del primer trimestre" },
      {
        label: "Durante el contrato",
        a: "Cobros y servicios a cargo del propietario",
        b: "Limpieza, check-in y check-out, reporte mensual",
      },
    ],
  },
  tempVsAirbnb: {
    titulo: "Temporario mensual o Airbnb: por mes o por noche.",
    intro: "Una comparación honesta: cada opción tiene su costo y su beneficio.",
    columnas: ["Temporario mensual", "Airbnb"] as const,
    grupos: [
      {
        titulo: "Ingresos",
        filas: [
          { label: "Ingreso mensual", a: "Más bajo, pero constante", b: "Más alto, pero variable" },
          { label: "Precio", a: "Se fija en el contrato", b: "Se ajusta según la demanda" },
          { label: "Temporadas", a: "No afectan el precio", b: "En temporada alta se puede cobrar más" },
        ],
      },
      {
        titulo: "Costos",
        filas: [
          {
            label: "Gastos operativos",
            a: "Bajos: mantenimiento básico",
            b: "Altos: limpieza frecuente y reposición de artículos",
          },
          { label: "Servicios", a: "Generalmente los paga el inquilino", b: "Los paga el propietario" },
          { label: "Plataforma", a: "Sin comisión de plataforma", b: "Airbnb cobra entre 3% y 15%" },
        ],
      },
      {
        titulo: "Estabilidad y riesgo",
        filas: [
          { label: "Desocupación", a: "Baja: contratos de 3 meses o más", b: "Alta si no hay demanda" },
          {
            label: "Cobro",
            a: "Mensual, a cargo del inquilino",
            b: "Asegurado por la plataforma antes del ingreso",
          },
          {
            label: "Desgaste",
            a: "Menos rotación, menor desgaste",
            b: "Mayor riesgo de daños por huéspedes ocasionales",
          },
        ],
      },
    ],
    resumen:
      "En resumen: el contrato mensual resigna algo de ingreso a cambio de previsibilidad y menos trabajo operativo.",
  },
  rangos: {
    titulo: "Rangos base · Alquiler temporario mensual",
    texto: "El valor final depende de tres aspectos: distribución, luminosidad y equipamiento.",
    items: [
      { label: "Monoambiente", valor: "USD 500" },
      { label: "2 ambientes", valor: "USD 700" },
      { label: "3 ambientes", valor: "USD 900" },
      { label: "4 amb. o más", valor: "USD 1.200" },
    ],
    desde: "Desde",
    disclaimer: "Valores de referencia. El valor final de tu propiedad surge de la tasación.",
  },
  cta: "Quiero tasar mi propiedad",
};

export const porQue = {
  eyebrow: "05 — Por qué Team Black",
  titulo: "Un broker a cargo de tu propiedad, de principio a fin.",
  diferenciales: [
    {
      titulo: "Seguridad jurídica",
      texto: "Contrato y garantía (o depósito, en temporario) revisados antes del ingreso.",
    },
    {
      titulo: "Mejor exposición",
      texto: "Comunidad de +15,8K en Instagram: @amaya.realestate.",
    },
    {
      titulo: "Trato exclusivo",
      texto: "Un broker a cargo de tu propiedad, de principio a fin.",
    },
    {
      titulo: "Proceso simplificado",
      texto: "Coordinamos cada paso. Vos decidís.",
    },
  ],
  temporarioTitulo: "En alquiler temporario, además",
  temporarioExtra: [
    { titulo: "Más demanda", texto: "Inquilinos del exterior y del interior del país." },
    { titulo: "Propiedad cuidada", texto: "Limpieza gestionada entre inquilinos." },
  ],
  javier: {
    nombre: "Javier Peñalver",
    rol: "Broker inmobiliario · Team Black by Amaya",
    bio: "[COMPLETAR: bio corta de Javier]",
    fotoAlt: "Javier Peñalver, broker inmobiliario de Team Black by Amaya",
    fotoPlaceholder: "TODO-FOTO-JAVIER",
    cta: "Hablar con Javier",
  },
  social: {
    valor: "+15,8K",
    label: "comunidad en Instagram",
    cuenta: "@amaya.realestate",
  },
};

export const alquiladas = {
  eyebrow: "06 — Propiedades que ya alquilamos",
  /** {n} se reemplaza por la cantidad real calculada desde los datos */
  contador: "{n} propiedades alquiladas en CABA",
  intro: "Casos reales, siempre mostrando solo el barrio.",
  filtros: { todas: "Todas", tradicional: "Tradicional", temporario: "Temporario" },
  alquiladaEn: "Alquilada en {d} días",
  contrato: "Contrato de {m} meses",
  verFotos: "Ver fotos",
  cerrar: "Cerrar",
  cta: "¿Tu propiedad es la próxima? Pedí tu tasación",
  placeholderDev:
    "Acá van las propiedades alquiladas — cargalas en content/propiedades-alquiladas.ts (se muestra sola desde 3 propiedades; este aviso solo se ve en desarrollo).",
};

export const formulario = {
  eyebrow: "Tasación sin costo",
  titulo: "Empecemos por la tasación.",
  intro:
    "Contanos sobre tu propiedad y te pasamos el valor de alquiler con comparables de la zona. Con ese número definimos juntos la estrategia.",
  zona: "Solo propiedades ubicadas en la Ciudad Autónoma de Buenos Aires.",
  pasos: ["Contacto", "Tu propiedad", "Detalles"],
  pasoDe: "Paso {a} de {b}",
  siguiente: "Siguiente",
  anterior: "Volver",
  enviar: "Pedir tasación",
  enviando: "Enviando…",
  microcopy: "Sin costo ni compromiso · Te respondemos por WhatsApp",
  opcional: "opcional",
  errorGeneral: "Revisá los campos marcados.",
  errorRed: "No pudimos enviar tus datos. Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.",
  campos: {
    nombre: { label: "Nombre y apellido", placeholder: "Ej: María González" },
    whatsapp: {
      label: "WhatsApp",
      placeholder: "11 1234-5678",
      ayuda: "Con código de área. Te escribimos por acá.",
    },
    email: { label: "Email", placeholder: "nombre@mail.com", ayuda: "Recomendado, para enviarte la tasación." },
    modalidad: {
      label: "¿Qué modalidad te interesa?",
      opciones: [
        { value: "tradicional", label: "Alquiler tradicional", detalle: "12 meses o más" },
        { value: "temporario", label: "Alquiler temporario", detalle: "3 a 12 meses, amoblado" },
        { value: "no_se", label: "No sé, quiero que me asesoren", detalle: "Lo vemos con tus números" },
      ],
    },
    tipo_propiedad: {
      label: "Tipo de propiedad",
      opciones: [
        { value: "departamento", label: "Departamento" },
        { value: "ph", label: "PH" },
        { value: "casa", label: "Casa" },
        { value: "local_otro", label: "Local u otro" },
      ],
    },
    barrio: { label: "Barrio (CABA)", placeholder: "Elegí el barrio" },
    direccion_aprox: { label: "Calle y altura aproximada", placeholder: "Ej: Av. Santa Fe al 3200" },
    ambientes: {
      label: "Ambientes",
      opciones: [
        { value: "monoambiente", label: "Mono" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4_o_mas", label: "4+" },
      ],
    },
    m2: { label: "m²", placeholder: "Ej: 55" },
    piso_unidad: { label: "Piso y depto", placeholder: "Ej: 4° B" },
    equipamientoNota: "Para temporario se requiere equipamiento completo e internet contratado.",
    amoblada: {
      label: "¿Está amoblada y equipada?",
      opciones: [
        { value: "si", label: "Sí" },
        { value: "parcialmente", label: "Parcialmente" },
        { value: "no", label: "No" },
      ],
    },
    internet: {
      label: "¿Tiene internet/wifi contratado?",
      opciones: [
        { value: "si", label: "Sí" },
        { value: "no", label: "No" },
      ],
    },
    valor_esperado: {
      label: "¿Qué valor de alquiler tenés en mente?",
      placeholder: "Ej: $800.000 o USD 700",
    },
    disponibilidad: {
      label: "¿Cuándo está disponible?",
      opciones: [
        { value: "ya", label: "Ya" },
        { value: "1_mes", label: "En 1 mes" },
        { value: "2_3_meses", label: "En 2–3 meses" },
        { value: "mas_adelante", label: "Más adelante" },
      ],
    },
    comentarios: {
      label: "Comentarios",
      placeholder: "Algo que quieras contarnos de la propiedad",
    },
    consentimiento: {
      antes: "Acepto ser contactado/a por Javier Peñalver / Team Black y el tratamiento de mis datos según la ",
      link: "Política de Privacidad",
      despues: " (Ley 25.326 de Protección de Datos Personales).",
    },
  },
  exito: {
    titulo: "Gracias, {nombre}.",
    texto: "Ya recibimos los datos de tu propiedad en {barrio}.",
    ahoraTitulo: "Qué pasa ahora",
    ahora: [
      { titulo: "Revisamos tu propiedad", texto: "Analizamos los datos y los comparables de la zona." },
      { titulo: "Te escribimos por WhatsApp", texto: "[COMPLETAR: plazo de respuesta]" },
      { titulo: "Coordinamos visita y tasación", texto: "Vemos la propiedad y te pasamos el valor de salida." },
    ],
    whatsapp: "Escribirle a Javier por WhatsApp",
    whatsappMensaje:
      "Hola Javier, soy {nombre}. Te dejé los datos para tasar mi propiedad en {barrio} (modalidad: {modalidad}).",
    seguinos: "Mientras tanto, seguinos en Instagram",
    nuevo: "Cargar otra propiedad",
  },
};

export const faq = {
  eyebrow: "Preguntas frecuentes",
  titulo: "Lo que más nos preguntan.",
  items: [
    {
      q: "¿Cuánto cuesta?",
      a: "Pedir la tasación no tiene costo ni compromiso. Si alquilamos tu propiedad: en alquiler tradicional los honorarios son del 4,15% del valor total del contrato, a cargo del propietario, y el inquilino no paga comisión (Ley 5859). En temporario son del 15% solo sobre el primer trimestre; el resto del contrato no suma honorarios. El cálculo final se hace sobre tu contrato.",
    },
    {
      q: "¿Tengo que mostrar yo la propiedad?",
      a: "No. Coordinamos y acompañamos cada visita. Vos no tenés que mostrar la propiedad.",
    },
    {
      q: "¿Qué garantías aceptan?",
      a: "En alquiler tradicional, siempre una de dos: garantía propietaria de CABA (revisamos la documentación antes de avanzar) o seguro de caución (una póliza de aseguradora que gestionamos junto con el candidato). En temporario, el respaldo es un depósito, que queda en manos del propietario.",
    },
    {
      q: "¿Qué pasa si no me gusta el candidato?",
      a: "La decisión final sobre el inquilino siempre es tuya. Antes de presentarte a un interesado revisamos sus ingresos y documentación, y vos decidís si avanzar.",
    },
    {
      q: "¿Qué diferencia hay entre tradicional y temporario?",
      a: "El tradicional es un contrato de vivienda permanente de 12 meses o más (lo habitual son 24), sin amoblar, con garantía propietaria de CABA o seguro de caución. El temporario son contratos mensuales de 3 a 12 meses, con la propiedad amoblada, equipada y con internet contratado, y el respaldo es un depósito. Si no sabés cuál te conviene, lo vemos con los números de tu propiedad.",
    },
    {
      q: "¿Qué necesita mi propiedad para alquiler temporario?",
      a: "Equipamiento completo para su uso efectivo desde el primer día e internet/wifi contratado antes de publicar.",
    },
    {
      q: "¿Quién se ocupa de la propiedad durante el contrato?",
      a: "En tradicional, el cobro mensual, los servicios, las expensas y la administración los gestionás vos, directo con el inquilino. En temporario nos ocupamos de los cobros directos al propietario, check-in y check-out, limpieza y reporte mensual; el pago de servicios, las emergencias y los arreglos quedan a cargo del propietario.",
    },
    {
      q: "¿Trabajan fuera de CABA?",
      a: "No. Trabajamos solo con propiedades ubicadas en la Ciudad Autónoma de Buenos Aires.",
    },
    {
      q: "¿Cuánto tarda la tasación?",
      a: "[COMPLETAR: tiempo de respuesta de Javier]",
    },
  ],
};

export const ctaFinal = {
  titulo: "Empecemos por la tasación.",
  texto:
    "Te pasamos el valor de alquiler de tu propiedad con comparables de la zona. Con ese número definimos juntos la estrategia de publicación.",
  cta: "Pedir tasación",
  whatsapp: "Escribime y coordinamos una visita",
};

export const footer = {
  contactoTitulo: "Contacto",
  redesTitulo: "Instagram",
  legal: [
    "Corredor responsable: Juan Amaya · CPI 9004.",
    "Alquiler de vivienda en CABA: la comisión máxima que se puede requerir al propietario es del 4,15% del valor total del contrato (Ley 5859).",
  ],
  privacidad: "Política de privacidad",
  zona: "Solo propiedades en la Ciudad Autónoma de Buenos Aires.",
  derechos: "Team Black by Amaya · Amaya Real Estate",
};

export const cookies = {
  texto:
    "Usamos cookies de medición (Meta Pixel) para entender qué anuncios funcionan. No compartimos tus datos de contacto.",
  aceptar: "Aceptar",
  rechazar: "Rechazar",
  mas: "Más info",
};
