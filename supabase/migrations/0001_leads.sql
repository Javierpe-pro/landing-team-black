-- =====================================================================
-- 0001_leads.sql · Team Black by Amaya · Landing de captación de propietarios
-- Tabla de leads del formulario de tasación.
--
-- Seguridad:
--   * RLS activado y SIN políticas: nadie puede leer ni escribir con la anon key.
--   * La inserción ocurre SOLO desde el servidor (Route Handler /api/leads)
--     con la SUPABASE_SERVICE_ROLE_KEY, que nunca llega al navegador.
--   * Los leads se consultan desde el panel de Supabase (Table Editor).
-- =====================================================================

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- Contacto
  nombre             text not null check (char_length(nombre) between 2 and 80),
  whatsapp           text not null check (whatsapp ~ '^\+549[1-3][0-9]{9}$'),
  email              text check (email is null or char_length(email) <= 120),

  -- Propiedad (solo CABA)
  modalidad          text not null check (modalidad in ('tradicional', 'temporario', 'no_se')),
  tipo_propiedad     text not null check (tipo_propiedad in ('departamento', 'ph', 'casa', 'local_otro')),
  barrio             text not null check (barrio in (
    'Agronomía',
    'Almagro',
    'Balvanera',
    'Barracas',
    'Belgrano',
    'Boedo',
    'Caballito',
    'Chacarita',
    'Coghlan',
    'Colegiales',
    'Constitución',
    'Flores',
    'Floresta',
    'La Boca',
    'La Paternal',
    'Liniers',
    'Mataderos',
    'Monte Castro',
    'Montserrat',
    'Nueva Pompeya',
    'Núñez',
    'Palermo',
    'Parque Avellaneda',
    'Parque Chacabuco',
    'Parque Chas',
    'Parque Patricios',
    'Puerto Madero',
    'Recoleta',
    'Retiro',
    'Saavedra',
    'San Cristóbal',
    'San Nicolás',
    'San Telmo',
    'Vélez Sarsfield',
    'Versalles',
    'Villa Crespo',
    'Villa del Parque',
    'Villa Devoto',
    'Villa General Mitre',
    'Villa Lugano',
    'Villa Luro',
    'Villa Ortúzar',
    'Villa Pueyrredón',
    'Villa Real',
    'Villa Riachuelo',
    'Villa Santa Rita',
    'Villa Soldati',
    'Villa Urquiza'
  )),
  direccion_aprox    text check (direccion_aprox is null or char_length(direccion_aprox) <= 120),
  ambientes          text not null check (ambientes in ('monoambiente', '2', '3', '4_o_mas')),
  m2                 integer check (m2 is null or m2 between 10 and 10000),
  piso_unidad        text check (piso_unidad is null or char_length(piso_unidad) <= 30),
  amoblada           text check (amoblada is null or amoblada in ('si', 'parcialmente', 'no')),
  internet           text check (internet is null or internet in ('si', 'no')),

  -- Detalles
  valor_esperado     text check (valor_esperado is null or char_length(valor_esperado) <= 60),
  disponibilidad     text not null check (disponibilidad in ('ya', '1_mes', '2_3_meses', 'mas_adelante')),
  comentarios        text check (comentarios is null or char_length(comentarios) <= 1000),

  -- Consentimiento (Ley 25.326)
  consentimiento     boolean not null check (consentimiento = true),
  consentimiento_at  timestamptz not null default now(),

  -- Atribución (Meta Ads / UTM)
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  utm_term           text,
  fbclid             text,
  referrer           text,
  landing_url        text,
  user_agent         text,
  ip_hash            text,
  -- Mismo event_id que el evento Lead del Pixel (para deduplicar con Conversions API)
  event_id           text,

  -- CRM (Kanban): nuevo → contactado → tasacion → publicado → cerrado
  status             text not null default 'nuevo'
                     check (status in ('nuevo', 'contactado', 'tasacion', 'publicado', 'cerrado', 'descartado')),
  notas_internas     text
);

comment on table public.leads is 'Leads del formulario de tasación (landing Team Black). Solo CABA.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_event_id_idx on public.leads (event_id);

alter table public.leads enable row level security;
-- Intencionalmente SIN políticas: anon y authenticated no pueden leer ni escribir.
-- La service role key (solo servidor) saltea RLS.
revoke all on table public.leads from anon, authenticated;
