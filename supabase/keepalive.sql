-- Wachhalter: eine winzige Funktion, die nur "ok" zurückgibt.
-- GitHub ruft sie alle 3 Tage auf, damit Supabase das kostenlose Projekt nicht pausiert.
-- Sie liest und verändert keine Daten. In Supabase unter "SQL Editor" einmal ausführen.

create or replace function public.keepalive()
returns text
language sql
stable
security invoker
set search_path = ''
as $$ select 'ok'::text $$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;
