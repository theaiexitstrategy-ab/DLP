-- Migration: TCPA consent columns on public.leads
-- Project: bnkoqybkmwtrlorhowyv (shared GoElev8 multi-tenant Supabase)
-- Status:  NOT APPLIED — review before running.
--
-- Context
-- -------
-- The DLP quote form now requires an unchecked-by-default TCPA consent
-- checkbox and sends `tcpa_consent`, `consent_text`, and
-- `consent_timestamp` to the `capture-lead` edge function.
--
-- `leads` is shared across all GoElev8 client sites, so the columns are
-- nullable / defaulted and do not affect other tenants.
--
-- FOLLOW-UP REQUIRED: `capture-lead` (goelev8.ai-portal repo,
-- supabase/functions/capture-lead/index.ts) builds the insert row from a
-- fixed list of fields and will drop these values until it is updated, e.g.:
--
--   tcpa_consent:      body.tcpa_consent === true,
--   consent_text:      body.consent_text || null,
--   consent_timestamp: body.consent_timestamp || null,
--
-- Until then, the same consent record is also written to
-- funnel_responses.responses (jsonb), which needs no schema change.

alter table public.leads
  add column if not exists tcpa_consent      boolean not null default false,
  add column if not exists consent_text      text,
  add column if not exists consent_timestamp timestamp with time zone;

comment on column public.leads.tcpa_consent is
  'True when the lead checked the TCPA consent box on submission.';
comment on column public.leads.consent_text is
  'Exact consent wording shown to the lead at submission time.';
comment on column public.leads.consent_timestamp is
  'Client-side ISO timestamp when the lead submitted with consent checked.';
