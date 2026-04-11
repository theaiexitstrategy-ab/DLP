// Supabase client for Daniels' Legacy Planning
// ------------------------------------------------------------------
// Canonical module for bundler/Node-based builds. The static index.html
// uses inline fetch calls instead (same REST endpoints) and does NOT
// import this file; keep the two paths in sync if you change either one.
//
// Backend: existing GoElev8 multi-tenant Supabase project
//   Project ref:  bnkoqybkmwtrlorhowyv
//   URL:          https://bnkoqybkmwtrlorhowyv.supabase.co
//   DLP client:   slug=daniels-legacy-planning, id=28151249-7f0d-4544-8b2f-dd1b2ed1ec70
//
// Env vars are read via `process.env` so this works with Vite/Webpack/
// Next.js after they replace the vars at build time. Never hardcode the
// service_role key in source.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) ||
  (typeof window !== 'undefined' && window.DLP_CONFIG && window.DLP_CONFIG.SUPABASE_URL)

const supabaseKey =
  (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) ||
  (typeof window !== 'undefined' && window.DLP_CONFIG && window.DLP_CONFIG.SUPABASE_ANON_KEY)

export const DLP_CLIENT_ID = '28151249-7f0d-4544-8b2f-dd1b2ed1ec70'
export const DLP_CLIENT_SLUG = 'daniels-legacy-planning'
export const DLP_PORTAL_URL = 'https://portal.goelev8.ai'
export const CAPTURE_LEAD_URL =
  (supabaseUrl || 'https://bnkoqybkmwtrlorhowyv.supabase.co') +
  '/functions/v1/capture-lead'

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[dlp/supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. ' +
      'Set them in your .env file (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ------------------------------------------------------------------
// Tracking helpers — fire-and-forget, never block navigation.
//
// NOTE: supabase-js defaults to `Prefer: return=minimal` on inserts
// as long as you do NOT chain `.select()`. Do not add `.select()` here,
// because the SELECT RLS policy on these tables is authenticated-only
// and PostgREST will surface a misleading 401 RLS error if it tries to
// read the row back with the anon key.
// ------------------------------------------------------------------

export function trackPortalClick({ label, section } = {}) {
  try {
    return supabase.from('portal_clicks').insert({
      client_id: DLP_CLIENT_ID,
      button_label: label || null,
      page_section: section || null,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[dlp/supabase] trackPortalClick failed:', err)
  }
}

export async function saveFunnelResponse({ email, responses, recommendation }) {
  return supabase.from('funnel_responses').insert({
    client_id: DLP_CLIENT_ID,
    email: email || null,
    responses: responses || {},
    recommendation: recommendation || null,
    source: 'dlp-website',
  })
}

// Leads are captured via the existing `capture-lead` Edge Function.
// That function runs with the service_role key server-side so it can
// bypass the authenticated-only insert RLS policy on `leads` and
// trigger the Twilio welcome SMS.
export async function captureLead({ firstName, lastName, email, phone, notes }) {
  const resp = await fetch(CAPTURE_LEAD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + supabaseKey,
    },
    body: JSON.stringify({
      client_id: DLP_CLIENT_SLUG,
      full_name: [firstName, lastName].filter(Boolean).join(' ') || null,
      email: email || null,
      phone: phone || null,
      source: 'dlp-website',
      notes: notes || null,
    }),
  })
  if (!resp.ok) {
    const body = await resp.text().catch(() => '')
    throw new Error('capture-lead ' + resp.status + ': ' + body)
  }
  return resp.json()
}
