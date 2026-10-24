-- Trainingsplan: Datenbank einrichten
-- In Supabase unter "SQL Editor" einfügen und einmal mit "Run" ausführen.

-- Eine Tabelle für alle Daten der App: Einheiten, Einstellungen, Vorlagen.
create table if not exists public.docs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  collection text        not null check (collection in ('sessions', 'settings', 'templates')),
  id         text        not null check (char_length(id) between 1 and 200),
  data       jsonb,
  deleted    boolean     not null default false,
  updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, collection, id)
);

create index if not exists docs_user_updated on public.docs (user_id, updated_at);

-- Zeitstempel bei jeder Änderung neu setzen (für den Abgleich zwischen Geräten)
create or replace function public.docs_touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before insert or update on public.docs
  for each row execute function public.docs_touch();

-- Zugriffsregeln (Row Level Security): Jede Person sieht und ändert nur ihre eigenen Zeilen.
alter table public.docs enable row level security;
alter table public.docs force row level security;

drop policy if exists "eigene Daten lesen"    on public.docs;
drop policy if exists "eigene Daten anlegen"  on public.docs;
drop policy if exists "eigene Daten ändern"   on public.docs;
drop policy if exists "eigene Daten löschen"  on public.docs;

create policy "eigene Daten lesen"   on public.docs for select to authenticated using ((select auth.uid()) = user_id);
create policy "eigene Daten anlegen" on public.docs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "eigene Daten ändern"  on public.docs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "eigene Daten löschen" on public.docs for delete to authenticated using ((select auth.uid()) = user_id);

-- Nur angemeldete Personen bekommen überhaupt Zugriff auf die Tabelle, Anonyme gar keinen.
revoke all on public.docs from anon;
grant select, insert, update, delete on public.docs to authenticated;
