-- Martega Web — solicitudes comerciales con mínimo privilegio
-- Ejecutar en Supabase SQL Editor o mediante Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.solicitudes_web (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null check (char_length(trim(nombre)) between 2 and 100),
  telefono text check (telefono is null or char_length(trim(telefono)) between 6 and 30),
  email text check (email is null or (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  tipo_cliente text check (tipo_cliente is null or tipo_cliente in ('particular','empresa','comunidad','profesional')),
  servicio text not null check (servicio in ('instalaciones','reforma','mantenimiento','incidencia','otro')),
  codigo_postal text check (codigo_postal is null or codigo_postal ~ '^[0-9]{5}$'),
  mensaje text not null check (char_length(trim(mensaje)) between 10 and 2000),
  acepta_privacidad boolean not null check (acepta_privacidad = true),
  acepta_marketing boolean not null default false,
  version_privacidad text not null check (char_length(version_privacidad) between 8 and 30),
  consentimiento_at timestamptz not null default now(),
  origen text not null default 'web' check (origen = 'web'),
  estado text not null default 'nueva' check (estado in ('nueva','contactada','presupuestada','cerrada','descartada')),
  notas_internas text,
  closed_at timestamptz,
  constraint solicitud_contacto_requerido check (
    nullif(trim(coalesce(telefono, '')), '') is not null
    or nullif(trim(coalesce(email, '')), '') is not null
  )
);

comment on table public.solicitudes_web is 'Solicitudes recibidas desde el formulario público de martega.es';
comment on column public.solicitudes_web.acepta_marketing is 'Consentimiento independiente y opcional para comunicaciones comerciales';
comment on column public.solicitudes_web.version_privacidad is 'Versión del texto informativo aceptado por el interesado';

alter table public.solicitudes_web enable row level security;
alter table public.solicitudes_web force row level security;

revoke all on table public.solicitudes_web from public, anon, authenticated;

grant insert (
  nombre,
  telefono,
  email,
  tipo_cliente,
  servicio,
  codigo_postal,
  mensaje,
  acepta_privacidad,
  acepta_marketing,
  version_privacidad,
  origen
) on table public.solicitudes_web to anon;

drop policy if exists "web_publica_solo_crea_solicitudes" on public.solicitudes_web;
create policy "web_publica_solo_crea_solicitudes"
on public.solicitudes_web
for insert
to anon
with check (
  acepta_privacidad = true
  and origen = 'web'
  and estado = 'nueva'
  and notas_internas is null
  and closed_at is null
  and char_length(trim(nombre)) between 2 and 100
  and char_length(trim(mensaje)) between 10 and 2000
  and (
    nullif(trim(coalesce(telefono, '')), '') is not null
    or nullif(trim(coalesce(email, '')), '') is not null
  )
);

-- No se crea ninguna política SELECT/UPDATE/DELETE para anon o authenticated.
-- La gestión debe hacerse desde un backend privado, Supabase Studio o una app
-- autenticada con políticas específicas añadidas en una migración posterior.

create index if not exists solicitudes_web_created_at_idx
  on public.solicitudes_web (created_at desc);

create index if not exists solicitudes_web_estado_idx
  on public.solicitudes_web (estado, created_at desc);

create index if not exists solicitudes_web_email_idx
  on public.solicitudes_web (lower(email))
  where email is not null;

-- Función de limpieza para solicitudes cerradas/descartadas sin contratación.
-- Programarla mensualmente solo tras validar la política interna de conservación.
create or replace function public.purgar_solicitudes_web_cerradas()
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  eliminadas bigint;
begin
  delete from public.solicitudes_web
  where estado in ('cerrada', 'descartada')
    and coalesce(closed_at, created_at) < now() - interval '12 months';
  get diagnostics eliminadas = row_count;
  return eliminadas;
end;
$$;

revoke all on function public.purgar_solicitudes_web_cerradas() from public, anon, authenticated;
