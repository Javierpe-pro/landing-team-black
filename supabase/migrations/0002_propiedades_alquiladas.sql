-- =====================================================================
-- 0002_propiedades_alquiladas.sql · OPCIONAL
-- Para cuando Javier quiera cargar "Propiedades que ya alquilamos" desde
-- Supabase en lugar del archivo content/propiedades-alquiladas.ts.
-- La landing funciona igual sin esta tabla (usa el archivo local).
--
-- Privacidad: solo barrio. Nunca dirección exacta ni datos del inquilino.
-- valor_* y testimonio_* requieren autorización del propietario.
-- =====================================================================

create table if not exists public.propiedades_alquiladas (
  id                     text primary key,                 -- ej: 'palermo-2amb-2026-03'
  created_at             timestamptz not null default now(),
  titulo                 text not null check (char_length(titulo) <= 120),
  barrio                 text not null check (barrio in (
    'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito', 'Chacarita',
    'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca', 'La Paternal', 'Liniers',
    'Mataderos', 'Monte Castro', 'Montserrat', 'Nueva Pompeya', 'Núñez', 'Palermo', 'Parque Avellaneda',
    'Parque Chacabuco', 'Parque Chas', 'Parque Patricios', 'Puerto Madero', 'Recoleta', 'Retiro',
    'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sarsfield', 'Versalles',
    'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa General Mitre', 'Villa Lugano',
    'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo',
    'Villa Santa Rita', 'Villa Soldati', 'Villa Urquiza'
  )),
  tipo                   text not null check (tipo in ('Departamento', 'PH', 'Casa', 'Local')),
  ambientes              integer not null check (ambientes between 1 and 20),
  modalidad              text not null check (modalidad in ('tradicional', 'temporario')),
  fotos                  text[] not null default '{}',     -- URLs (Supabase Storage o /img/alquiladas/...)
  dias_hasta_alquilar    integer check (dias_hasta_alquilar is null or dias_hasta_alquilar >= 0),
  valor_monto            numeric check (valor_monto is null or valor_monto > 0),
  valor_moneda           text check (valor_moneda is null or valor_moneda in ('ARS', 'USD')),
  plazo_contrato_meses   integer check (plazo_contrato_meses is null or plazo_contrato_meses between 1 and 120),
  testimonio_texto       text,
  testimonio_nombre      text,
  destacada              boolean not null default false,
  fecha_alquiler         date,
  publicada              boolean not null default false,  -- solo las publicadas se ven en la web
  orden                  integer not null default 0
);

create index if not exists propiedades_alquiladas_publicada_idx
  on public.propiedades_alquiladas (publicada, orden);

alter table public.propiedades_alquiladas enable row level security;

-- Lectura pública SOLO de filas publicadas. Sin políticas de escritura:
-- se carga desde el panel de Supabase (o un futuro /admin con service role).
drop policy if exists "lectura publica de publicadas" on public.propiedades_alquiladas;
create policy "lectura publica de publicadas"
  on public.propiedades_alquiladas
  for select
  to anon, authenticated
  using (publicada = true);
