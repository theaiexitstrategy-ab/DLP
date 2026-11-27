// © 2026 GoElev8.ai | Aaron Bryant. All rights reserved. Unauthorized use prohibited.
//
// Shared quote quiz for index.html, the city hubs (lawton.html, stl.html) and
// the market product pages (lawton-*.html, stl-*.html, fort-sill-*.html).
// Links in here are root-absolute because product pages live at nested URLs
// (e.g. /lawton/final-expense-insurance).
// Each page includes <div id="quizModalMount"></div> and loads this file at
// the end of <body>. The quiz markup below is the single copy of the form
// (formerly inline in index.html) and is mounted synchronously, before any
// of the handlers further down look it up.
//
// City pages set window.DLP_PAGE before loading this file:
//   { market: "lawton" | "stl", state: "Oklahoma" | "Missouri", section: "city-lawton" | "city-stl" }
// section must be "city-<market>": the portal's Lead Creator report counts
// page views by that prefix. The page path goes in the view's label and in
// the lead notes, so leads can be traced to the exact page.
// index.html leaves it unset, so none of the city-only behavior runs there.

const QUIZ_MODAL_HTML = `
<div class="quiz-modal" id="quizModal" role="dialog" aria-modal="true" aria-labelledby="quizModalTitle" aria-hidden="true">
  <div class="quiz-modal-backdrop" data-quiz-close aria-hidden="true"></div>
  <div class="quiz-modal-panel">
    <button type="button" class="quiz-modal-close" data-quiz-close aria-label="Close quote form">&times;</button>
    <div class="form-card">
      <div class="form-header">
        <div class="ai-badge"><div class="ai-dot"></div> Licensed Agent Review</div>
        <h3 id="quizModalTitle">Get Your Free Quote</h3>
        <p>Answer 4 quick questions. We'll handle the rest.</p>
      </div>
      <div class="step-indicator" id="stepIndicator">
        <div class="step-dot active" id="dot1"></div>
        <div class="step-dot" id="dot2"></div>
        <div class="step-dot" id="dot3"></div>
        <div class="step-dot" id="dot4"></div>
      </div>

      <!-- STEP 1 -->
      <div class="step active" id="step1">
        <div class="step-label">Step 1 of 4 — What Are You Looking For?</div>
        <div class="choice-grid">
          <button class="choice-btn" onclick="selectChoice(this,'coverage','Term Life Insurance')">
            <span class="choice-icon">📋</span>Term Life
          </button>
          <button class="choice-btn" onclick="selectChoice(this,'coverage','Whole Life Insurance')">
            <span class="choice-icon">🏠</span>Whole Life
          </button>
          <button class="choice-btn" onclick="selectChoice(this,'coverage','Annuity / Retirement')">
            <span class="choice-icon">📈</span>Annuity
          </button>
          <button class="choice-btn" onclick="selectChoice(this,'coverage','Final Expense')">
            <span class="choice-icon">💛</span>Final Expense
          </button>
        </div>
        <button class="btn-primary" onclick="nextStep(2)">Continue →</button>
      </div>

      <!-- STEP 2 -->
      <div class="step" id="step2">
        <div class="step-label">Step 2 of 4 — About You</div>
        <div class="field-row">
          <div class="field-group"><label>First Name</label><input type="text" id="firstName" placeholder="First" /></div>
          <div class="field-group"><label>Last Name</label><input type="text" id="lastName" placeholder="Last" /></div>
        </div>
        <div class="field-row">
          <div class="field-group"><label>Age</label><input type="number" id="age" placeholder="35" min="18" max="85" /></div>
          <div class="field-group">
            <label>State</label>
            <select id="state">
              <option value="">Select...</option>
              <option>Missouri</option>
              <option>Oklahoma</option>
            </select>
          </div>
        </div>
        <div class="field-group">
          <label>Health Status</label>
          <select id="health">
            <option value="">Select...</option>
            <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
          </select>
        </div>
        <button class="btn-primary" onclick="nextStep(3)">Continue →</button>
        <button class="btn-back" onclick="prevStep(1)">← Back</button>
      </div>

      <!-- STEP 3 -->
      <div class="step" id="step3">
        <div class="step-label">Step 3 of 4 — Coverage Details</div>
        <div class="field-group">
          <label>Desired Coverage Amount</label>
          <select id="amount">
            <option value="">Select amount...</option>
            <option>$25,000 – $50,000</option>
            <option>$50,000 – $100,000</option>
            <option>$100,000 – $250,000</option>
            <option>$250,000 – $500,000</option>
            <option>$500,000 – $1,000,000</option>
            <option>$1,000,000+</option>
          </select>
        </div>
        <div class="field-group">
          <label>Monthly Budget</label>
          <select id="budget">
            <option value="">Select range...</option>
            <option>Under $50/month</option>
            <option>$50 – $100/month</option>
            <option>$100 – $200/month</option>
            <option>$200 – $500/month</option>
            <option>$500+/month</option>
          </select>
        </div>
        <div class="field-group">
          <label>Primary Goal</label>
          <select id="goal">
            <option value="">Select goal...</option>
            <option>Protect my family if I pass away</option>
            <option>Build wealth for retirement</option>
            <option>Cover final expenses</option>
            <option>Leave a legacy for my children</option>
            <option>Business protection</option>
          </select>
        </div>
        <div class="ai-response" id="aiInsight">
          <div class="ai-response-header"><div class="ai-dot"></div> Your Next Step</div>
          <p id="aiInsightText"><div class="typing-dots"><span></span><span></span><span></span></div></p>
        </div>
        <button class="btn-primary" onclick="generateInsight()">Continue →</button>
        <button class="btn-back" onclick="prevStep(2)">← Back</button>
      </div>

      <!-- STEP 4 -->
      <div class="step" id="step4">
        <div class="step-label">Step 4 of 4 — How to Reach You</div>
        <div class="field-group"><label>Email Address</label><input type="email" id="email" placeholder="you@email.com" /></div>
        <div class="field-group"><label>Phone Number</label><input type="tel" id="phone" placeholder="(555) 000-0000" /></div>
        <div class="field-group">
          <label>Best Time to Call</label>
          <select id="callTime">
            <option value="">Select...</option>
            <option>Morning (8am – 12pm)</option>
            <option>Afternoon (12pm – 5pm)</option>
            <option>Evening (5pm – 8pm)</option>
            <option>Anytime</option>
          </select>
        </div>
        <!-- ============================================================
             TCPA CONSENT — ATTORNEY REVIEW REQUIRED
             This consent language should be reviewed by an attorney before
             paid traffic is driven to this page. The checkbox MUST stay
             unchecked by default. The exact text in #tcpaConsentText is
             captured verbatim into the submitted payload (consent_text),
             so any wording change here is automatically recorded per lead.
             ============================================================ -->
        <div class="consent-block" id="tcpaConsentBlock">
          <input type="checkbox" id="tcpaConsent" name="tcpa_consent" required onchange="if (this.checked) this.parentNode.classList.remove('error')" />
          <label for="tcpaConsent" id="tcpaConsentText">By checking this box, I agree that Daniels' Legacy Planning and its licensed agents may contact me at the number and email provided, including by calls and texts, which may use automated technology, about insurance and annuity products. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.</label>
        </div>
        <!-- /TCPA CONSENT -->
        <div class="consent-links">
          <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="/terms.html" target="_blank" rel="noopener">Terms</a>
        </div>
        <button class="btn-primary" onclick="submitForm()">🔒 Submit — Get My Free Quote</button>
        <button class="btn-back" onclick="prevStep(3)">← Back</button>
        <!-- DECISION (2026-10-11): DLP plans to sell/share overflow leads to other
             licensed agents eventually, but not yet. Do NOT restore 'never sell'
             language. BEFORE any lead sharing starts, the TCPA consent text and the
             privacy policy must disclose it (attorney review). Leads collected
             before that disclosure should not be shared. -->
        <p class="privacy-note">🔒 We respect your privacy. See our <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> for how your information is used.</p>
      </div>

      <!-- SUCCESS -->
      <div class="success-state" id="successState">
        <div class="success-icon">✓</div>
        <h3>You're All Set!</h3>
        <p>Redirecting you to book your consultation…</p>
      </div>
    </div><!-- /.form-card -->
  </div><!-- /.quiz-modal-panel -->
</div><!-- /.quiz-modal -->
`;

(function mountQuizModal() {
  const mount = document.getElementById("quizModalMount");
  if (mount && !document.getElementById("quizModal")) mount.outerHTML = QUIZ_MODAL_HTML;
})();

  // ---------------------------------------------------------------
  // DLP backend integration — direct REST calls into the existing
  // GoElev8 multi-tenant Supabase project. No supabase-js dependency.
  //
  // leads           → POST to capture-lead edge function (service_role)
  // portal_clicks   → POST /rest/v1/portal_clicks     (anon, RLS insert policy)
  // funnel_responses→ POST /rest/v1/funnel_responses (anon, RLS insert policy)
  //
  // IMPORTANT: REST inserts use `Prefer: return=minimal` because the
  // SELECT policy on those tables is authenticated-only; anything else
  // causes PostgREST to surface a misleading RLS 401 when it tries to
  // read the row back.
  // ---------------------------------------------------------------
  const DLP_CFG = window.DLP_CONFIG || {};
  const PORTAL_URL      = DLP_CFG.PORTAL_URL      || "https://portal.goelev8.ai";
  const THANK_YOU_URL   = DLP_CFG.THANK_YOU_URL   || "/thanks.html";
  const SB_URL          = DLP_CFG.SUPABASE_URL    || "";
  const SB_KEY          = DLP_CFG.SUPABASE_ANON_KEY || "";
  const CLIENT_SLUG     = DLP_CFG.CLIENT_SLUG     || "daniels-legacy-planning";
  const CAPTURE_LEAD_URL= DLP_CFG.CAPTURE_LEAD_URL|| (SB_URL ? SB_URL + "/functions/v1/capture-lead" : "");

  // ---------------------------------------------------------------
  // City landing pages (lawton.html, stl.html). Everything in this
  // block is a no-op on index.html, where window.DLP_PAGE is unset.
  // ---------------------------------------------------------------
  const DLP_PAGE = window.DLP_PAGE || {};
  const LICENSED_STATES = ["Missouri", "Oklahoma"];
  const OTHER_STATE = "Other";
  const STATE_BLOCK_MSG = "We're licensed in Missouri and Oklahoma. We can't quote your state yet.";

  // market + UTM attribution, read once from the landing URL. Null on
  // index.html so its payloads are unchanged.
  const ATTRIBUTION = (function () {
    if (!DLP_PAGE.market) return null;
    let params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
    const get = function (k) { return (params && params.get(k)) || null; };
    return {
      market: DLP_PAGE.market,
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content")
    };
  })();

  function isLicensedState(state) {
    return LICENSED_STATES.indexOf(state) !== -1;
  }

  // Shows or hides the "can't quote your state" notice under the State field.
  function setStateBlocked(blocked) {
    let msg = document.getElementById("stateBlockMsg");
    if (!msg && blocked) {
      const select = document.getElementById("state");
      if (!select) return;
      msg = document.createElement("p");
      msg.id = "stateBlockMsg";
      msg.className = "state-block-msg";
      msg.setAttribute("role", "alert");
      msg.textContent = STATE_BLOCK_MSG;
      select.parentNode.appendChild(msg);
    }
    if (msg) msg.hidden = !blocked;
  }

  (function setUpCityQuiz() {
    if (!DLP_PAGE.market) return;
    const select = document.getElementById("state");
    if (!select) return;
    const other = document.createElement("option");
    other.value = OTHER_STATE;
    other.textContent = "I live in another state";
    select.appendChild(other);
    if (DLP_PAGE.state) select.value = DLP_PAGE.state;
    select.addEventListener("change", function () {
      setStateBlocked(!!select.value && !isLicensedState(select.value));
    });
  })();

  function supaInsert(table, row) {
    if (!SB_URL || !SB_KEY) {
      return Promise.resolve({ ok: false, reason: "no-config" });
    }
    return fetch(SB_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: {
        "apikey": SB_KEY,
        "Authorization": "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(row),
      keepalive: true
    }).then(function (resp) {
      if (!resp.ok) console.warn("[dlp] " + table + " insert HTTP " + resp.status);
      return { ok: resp.ok };
    }).catch(function (err) {
      console.warn("[dlp] " + table + " insert failed:", err);
      return { ok: false, reason: String(err) };
    });
  }

  // ---------------------------------------------------------------
  // Tracking helpers — fire-and-forget, never block navigation
  // ---------------------------------------------------------------
  function trackPortalClick(label, section) {
    try {
      supaInsert("portal_clicks", {
        client_id: DLP_CFG.CLIENT_ID || "28151249-7f0d-4544-8b2f-dd1b2ed1ec70",
        button_label: label || null,
        page_section: section || null,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null
      });
    } catch (err) {
      console.warn("[dlp] trackPortalClick failed:", err);
    }
  }

  // ---------------------------------------------------------------
  // Quiz modal open/close + click tracking
  //
  // Any element with [data-portal-link] fires a portal_clicks row and
  // lets the browser handle the navigation (portal links).
  //
  // Any element with [data-quiz-open] opens the quiz modal and fires a
  // "(Quiz Open)" portal_clicks row so CTA engagement stays measurable.
  //
  // Any element with [data-quiz-close] (or an Escape keypress while the
  // modal is open, or a click on the backdrop) closes the modal.
  // ---------------------------------------------------------------
  const quizModal = document.getElementById("quizModal");

  function openQuizModal() {
    if (!quizModal) return;
    quizModal.classList.add("open");
    quizModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("quiz-open");
    // Reset scroll so long forms always open at step 1 header
    quizModal.scrollTop = 0;
    // Focus the close button for keyboard users
    const closeBtn = quizModal.querySelector(".quiz-modal-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);
  }

  function closeQuizModal() {
    if (!quizModal) return;
    quizModal.classList.remove("open");
    quizModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("quiz-open");
  }

  // Expose for inline step handlers that need to scroll the modal
  window.dlpQuizModal = quizModal;

  document.addEventListener("DOMContentLoaded", function () {
    // City pages: one fire-and-forget page-view row (index.html unchanged).
    if (DLP_PAGE.section) trackPortalClick("Page View: " + window.location.pathname, DLP_PAGE.section);

    document.querySelectorAll("[data-portal-link]").forEach(function (el) {
      el.addEventListener("click", function () {
        trackPortalClick(
          el.getAttribute("data-portal-label") || el.textContent.trim(),
          el.getAttribute("data-portal-section") || "unknown"
        );
      });
    });

    document.querySelectorAll("[data-quiz-open]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        trackPortalClick(
          (el.getAttribute("data-quiz-label") || el.textContent.trim()) + " (Quiz Open)",
          el.getAttribute("data-quiz-section") || "quiz-open"
        );
        openQuizModal();
      });
    });

    document.querySelectorAll("[data-quiz-close]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        closeQuizModal();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && quizModal && quizModal.classList.contains("open")) {
        closeQuizModal();
      }
    });
  });

  // ---------------------------------------------------------------
  // Quiz funnel state
  // ---------------------------------------------------------------
  const formData = {};
  let lastRecommendation = "";
  let currentStep = 1;

  function updateDots(step) {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById('dot' + i);
      if (i < step) dot.className = 'step-dot done';
      else if (i === step) dot.className = 'step-dot active';
      else dot.className = 'step-dot';
    }
  }

  function selectChoice(el, key, value) {
    el.closest('.choice-grid').querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    formData[key] = value;
  }

  function nextStep(n) {
    if (n === 3) {
      const fn = document.getElementById('firstName').value;
      const ln = document.getElementById('lastName').value;
      const age = document.getElementById('age').value;
      const state = document.getElementById('state').value;
      if (!fn || !ln || !age || !state) { alert('Please fill in all fields to continue.'); return; }
      // Only MO/OK can be quoted. index.html offers only those two, so this
      // can only trigger on the city pages' "another state" option.
      if (!isLicensedState(state)) { setStateBlocked(true); return; }
      setStateBlocked(false);
      formData.firstName = fn; formData.lastName = ln;
      formData.age = age; formData.state = state;
      formData.health = document.getElementById('health').value;
    }
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep = n;
    document.getElementById('step' + currentStep).classList.add('active');
    updateDots(currentStep);
    // Scroll the quiz modal back to the top so the new step's heading is
    // always visible (important on mobile where the modal scrolls, not the page).
    if (window.dlpQuizModal) {
      window.dlpQuizModal.scrollTop = 0;
    }
  }

  function prevStep(n) {
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep = n;
    document.getElementById('step' + currentStep).classList.add('active');
    updateDots(currentStep);
  }

  async function generateInsight() {
    const amount = document.getElementById('amount').value;
    const budget = document.getElementById('budget').value;
    const goal = document.getElementById('goal').value;
    if (!amount || !budget || !goal) { alert('Please fill in all fields.'); return; }
    formData.amount = amount; formData.budget = budget; formData.goal = goal;

    const insightBox = document.getElementById('aiInsight');
    const insightText = document.getElementById('aiInsightText');
    insightBox.classList.add('visible');
    insightText.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are a warm, knowledgeable insurance advisor for Daniels' Legacy Planning — a family-owned life insurance agency in Missouri and Oklahoma. Based on this prospect's information, write a brief, warm, personalized 2-3 sentence recommendation. Be encouraging and specific. Never mention exact prices or guarantee approval. Never promise guaranteed returns, no risk of loss, or tax savings.

Prospect: Age ${formData.age}, ${formData.health} health, ${formData.state}, seeking ${formData.coverage || 'life insurance'}, coverage amount ${amount}, budget ${budget}, goal: ${goal}.

Respond in 2-3 sentences only. Be warm and personal.` }]
        })
      });
      const data = await resp.json();
      lastRecommendation = data.content?.[0]?.text || "Great news — based on your profile, there are strong options available for you in " + formData.state + ". Our advisor will find the right fit within your budget.";
      insightText.textContent = lastRecommendation;
    } catch(e) {
      lastRecommendation = `Based on your profile in ${formData.state}, we have excellent options to help you ${goal.toLowerCase()} within your budget. A DLP advisor will walk you through everything!`;
      insightText.textContent = lastRecommendation;
    }
    setTimeout(() => nextStep(4), 2400);
  }

  async function submitForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    if (!email || !phone) { alert('Please enter your email and phone number.'); return; }

    // Never submit a lead from a state DLP isn't licensed in.
    if (!isLicensedState(formData.state)) {
      prevStep(2);
      setStateBlocked(true);
      return;
    }

    // TCPA consent is required to submit. Capture the exact text shown to
    // the visitor plus a timestamp so each lead carries its own consent record.
    const consentBox = document.getElementById('tcpaConsent');
    const consentBlock = document.getElementById('tcpaConsentBlock');
    if (!consentBox || !consentBox.checked) {
      if (consentBlock) consentBlock.classList.add('error');
      alert('Please check the consent box so a licensed DLP advisor can contact you.');
      return;
    }
    if (consentBlock) consentBlock.classList.remove('error');
    formData.tcpa_consent = true;
    formData.consent_text = document.getElementById('tcpaConsentText').textContent.replace(/\s+/g, ' ').trim();
    formData.consent_timestamp = new Date().toISOString();

    formData.email = email; formData.phone = phone;
    formData.callTime = document.getElementById('callTime').value;

    const submitBtn = document.querySelector('#step4 .btn-primary');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

    // 1) Persist the lead via the existing capture-lead edge function.
    //    This is the canonical path — it handles client_id slug lookup,
    //    phone normalization, and triggers the welcome SMS if enabled.
    let leadOk = false;
    if (CAPTURE_LEAD_URL) {
      try {
        const leadPayload = {
          client_id: CLIENT_SLUG,
          full_name: (formData.firstName || '') + ' ' + (formData.lastName || ''),
          email: formData.email,
          phone: formData.phone,
          source: 'dlp-website',
          // TCPA consent record. capture-lead (goelev8.ai-portal repo) saves
          // these to leads.tcpa_consent / consent_text / consent_timestamp and
          // stamps consent_received_at server-side (portal migration 0084).
          tcpa_consent: formData.tcpa_consent === true,
          consent_text: formData.consent_text || null,
          consent_timestamp: formData.consent_timestamp || null,
          notes: 'Coverage: ' + (formData.coverage || '-') +
                 ' | State: ' + (formData.state || '-') +
                 ' | Age: ' + (formData.age || '-') +
                 ' | Health: ' + (formData.health || '-') +
                 ' | Amount: ' + (formData.amount || '-') +
                 ' | Budget: ' + (formData.budget || '-') +
                 ' | Goal: ' + (formData.goal || '-') +
                 ' | Call time: ' + (formData.callTime || '-')
        };
        // City pages: send market + UTM as top-level fields (saved to
        // leads.market / utm_* by capture-lead, portal migration 0084), and
        // also append them to notes so they're readable in the Leads tab.
        if (ATTRIBUTION) {
          Object.assign(leadPayload, ATTRIBUTION);
          leadPayload.notes += ' | Market: ' + ATTRIBUTION.market +
            ' | Page: ' + window.location.pathname +
            ' | UTM: ' + ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
              .map(function (k) { return k + '=' + (ATTRIBUTION[k] || '-'); }).join(', ');
        }
        const leadResp = await fetch(CAPTURE_LEAD_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + SB_KEY
          },
          body: JSON.stringify(leadPayload)
        });
        leadOk = leadResp.ok;
        if (!leadOk) {
          const body = await leadResp.text();
          console.warn('[dlp] capture-lead failed:', leadResp.status, body);
        }
      } catch (err) {
        console.warn('[dlp] capture-lead network error:', err);
      }
    } else {
      console.log('[dlp] capture-lead URL not configured — lead not persisted. Payload:', formData);
    }

    // 2) Persist the full funnel response (quiz answers + AI recommendation)
    //    directly to the funnel_responses table. Fire-and-forget.
    const funnelResponses = {
      coverage: formData.coverage || null,
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      age: formData.age || null,
      state: formData.state || null,
      health: formData.health || null,
      amount: formData.amount || null,
      budget: formData.budget || null,
      goal: formData.goal || null,
      phone: formData.phone || null,
      callTime: formData.callTime || null,
      // Stored in the existing jsonb column, so this consent record
      // persists today with no schema change.
      tcpa_consent: formData.tcpa_consent === true,
      consent_text: formData.consent_text || null,
      consent_timestamp: formData.consent_timestamp || null
    };
    if (ATTRIBUTION) Object.assign(funnelResponses, ATTRIBUTION);
    supaInsert('funnel_responses', {
      client_id: '28151249-7f0d-4544-8b2f-dd1b2ed1ec70',
      email: formData.email,
      responses: funnelResponses,
      recommendation: lastRecommendation || null,
      source: 'dlp-website'
    });

    // 3) Track the portal redirect (non-blocking) and send the user to the
    //    branded thank-you page. The thank-you page has the portal handoff.
    trackPortalClick('Funnel Submit', 'funnel-submit');

    // Stash the lead basics so thanks.html can personalize the greeting
    // and prefill the Calendly booking widget.
    try {
      sessionStorage.setItem('dlp_lead', JSON.stringify({
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        callTime: formData.callTime || ''
      }));
    } catch (e) { /* sessionStorage may be disabled — safe to ignore */ }

    // 4) Ad conversions (Meta "Lead" + Google "generate_lead") — only when
    //    capture-lead confirmed the lead was saved.
    if (leadOk && typeof window.dlpTrackLeadConversion === 'function') {
      try { await window.dlpTrackLeadConversion(); } catch (e) { /* never block redirect */ }
    }

    window.location.href = THANK_YOU_URL;
  }
