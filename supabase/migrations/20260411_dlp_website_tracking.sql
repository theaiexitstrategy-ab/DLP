-- Migration: DLP website tracking tables
-- Project: bnkoqybkmwtrlorhowyv (existing GoElev8 multi-tenant Supabase)
-- Applied:  2026-04-11 via Supabase Management API
--
-- Context
-- -------
-- The `clients` and `leads` tables already exist in this project and are
-- shared across all GoElev8 client sites (iSlay Studios, Daniels Legacy
-- Planning, The Flex Facility, etc.). DLP has client_id
--   28151249-7f0d-4544-8b2f-dd1b2ed1ec70 (slug: daniels-legacy-planning)
--
-- DLP leads are captured via the existing `capture-lead` edge function at
--   POST https://bnkoqybkmwtrlorhowyv.supabase.co/functions/v1/capture-lead
-- so no schema changes are needed for `leads` itself. This migration ONLY
-- adds the two tracking tables the DLP site needs that did not exist:
-- `portal_clicks` and `funnel_responses`. Both are multi-tenant (scoped
-- by client_id) so any future client site can reuse them.

-- ============================================================================
-- portal_clicks — fires on any click that routes to portal.goelev8.ai
-- ============================================================================
create table if not exists public.portal_clicks (
  id            uuid default gen_random_uuid() primary key,
  client_id     uuid references public.clients(id) on delete cascade,
  clicked_at    timestamp with time zone default now(),
  button_label  text,
  page_section  text,
  referrer      text,
  user_agent    text
);

create index if not exists portal_clicks_client_id_clicked_at_idx
  on public.portal_clicks (client_id, clicked_at desc);

-- ============================================================================
-- funnel_responses — full quiz/funnel JSON + AI recommendation per submission
-- ============================================================================
create table if not exists public.funnel_responses (
  id             uuid default gen_random_uuid() primary key,
  client_id      uuid references public.clients(id) on delete cascade,
  submitted_at   timestamp with time zone default now(),
  email          text,
  responses      jsonb,
  recommendation text,
  source         text default 'dlp-website'
);

create index if not exists funnel_responses_client_id_submitted_at_idx
  on public.funnel_responses (client_id, submitted_at desc);
create index if not exists funnel_responses_email_idx
  on public.funnel_responses (email);

-- ============================================================================
-- Grants — anon + authenticated need INSERT; only authenticated gets SELECT
-- ============================================================================
grant insert on public.portal_clicks    to anon, authenticated;
grant insert on public.funnel_responses to anon, authenticated;
grant select on public.portal_clicks    to authenticated;
grant select on public.funnel_responses to authenticated;

-- ============================================================================
-- RLS — insert-only for public visitors, select restricted to the client's
-- authenticated portal users via the existing client_users join.
-- ============================================================================
alter table public.portal_clicks    enable row level security;
alter table public.funnel_responses enable row level security;

drop policy if exists portal_clicks_insert on public.portal_clicks;
create policy portal_clicks_insert
  on public.portal_clicks
  for insert
  to public
  with check (true);

drop policy if exists portal_clicks_select on public.portal_clicks;
create policy portal_clicks_select
  on public.portal_clicks
  for select
  to authenticated
  using (
    client_id in (
      select client_users.client_id
        from public.client_users
       where client_users.user_id = auth.uid()
    )
  );

drop policy if exists funnel_responses_insert on public.funnel_responses;
create policy funnel_responses_insert
  on public.funnel_responses
  for insert
  to public
  with check (true);

drop policy if exists funnel_responses_select on public.funnel_responses;
create policy funnel_responses_select
  on public.funnel_responses
  for select
  to authenticated
  using (
    client_id in (
      select client_users.client_id
        from public.client_users
       where client_users.user_id = auth.uid()
    )
  );

-- IMPORTANT CLIENT-SIDE NOTE
-- Because the SELECT policy is authenticated-only, any INSERT issued from
-- the browser with the anon key MUST use `Prefer: return=minimal` (or
-- avoid `.select()` chained after `.insert()` in supabase-js). Otherwise
-- PostgREST will try to read the row back, get filtered out by the SELECT
-- policy, and return a misleading "new row violates row-level security
-- policy" 401 error.

-- Trigger PostgREST to reload its schema cache so the new tables + policies
-- are visible over REST immediately.
notify pgrst, 'reload schema';
