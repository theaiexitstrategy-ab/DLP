// © 2026 GoElev8.ai | Aaron Bryant. All rights reserved. Unauthorized use prohibited.
//
// Builds the market product pages from one template so every page carries the
// same tracking, quote form, footer and schema.org markup.
//
//   node scripts/build-seo-pages.mjs
//
// Writes <file>.html at the repo root for each page below. vercel.json maps the
// clean URL (e.g. /lawton/final-expense-insurance) to that file, so every asset
// and link in the template is root-absolute. Edit the content here and re-run;
// don't hand-edit the generated files. Strategy and page plan: docs/seo/.
//
// Compliance rules for anything added here (docs/seo/strategy.md section 7):
// no carrier names or prices without a source, "guaranteed" only for
// guaranteed-issue plans, no Texas or Illinois targeting, no trusts or wills,
// Medicare pages need the TPMO disclaimer, annuity pages the annuity disclosure.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.danielslegacyplanning.com';
const PHONE = { display: '(314) 363-4892', tel: '+13143634892', schema: '+1-314-363-4892' };

export const AGENCY_SCHEMA = {
  '@type': 'InsuranceAgency',
  '@id': `${SITE}/#agency`,
  name: "Daniels' Legacy Planning",
  url: `${SITE}/`,
  logo: `${SITE}/assets/logo.png`,
  image: `${SITE}/assets/daniels-family.png`,
  telephone: PHONE.schema,
  address: { '@type': 'PostalAddress', addressLocality: 'Lawton', addressRegion: 'OK', addressCountry: 'US' },
  founder: { '@type': 'Person', name: 'Anthony Daniels', jobTitle: 'Licensed Insurance Agent' },
  areaServed: [
    { '@type': 'State', name: 'Oklahoma' },
    { '@type': 'State', name: 'Missouri' },
    { '@type': 'City', name: 'Lawton, OK' },
    { '@type': 'City', name: 'St. Louis, MO' }
  ],
  knowsAbout: ['Final expense insurance', 'Mortgage protection insurance', 'Term life insurance',
    'Whole life insurance', 'Annuities', 'Medicare'],
  description: 'Family-owned, independent insurance agency licensed in Oklahoma and Missouri.'
};

const MARKETS = {
  lawton: { state: 'Oklahoma', hub: '/lawton', hubName: 'Lawton', section: 'city-lawton',
    pills: ['🏛 Oklahoma Licensed', '🏛 Missouri Licensed'],
    area: { '@type': 'City', name: 'Lawton, OK' } },
  stl: { state: 'Missouri', hub: '/stl', hubName: 'St. Louis', section: 'city-stl',
    pills: ['🏛 Missouri Licensed', '🏛 Oklahoma Licensed'],
    area: { '@type': 'City', name: 'St. Louis, MO' } }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── Pages ────────────────────────────────────────────────────────────────
// body strings below are trusted HTML written here, not user input.
export const PAGES = [
  {
    file: 'lawton-final-expense-insurance.html',
    path: '/lawton/final-expense-insurance',
    market: 'lawton',
    serviceType: 'Final expense insurance',
    title: 'Final Expense Insurance in Lawton, OK | Daniels\' Legacy',
    description: 'Burial and final expense coverage for Lawton and Comanche County families. Simple applications and a local, licensed agent. Free, no-obligation quote.',
    eyebrow: 'Lawton · Fort Sill · Comanche County',
    h1: 'Final Expense Insurance<br><em>for Lawton Families</em>',
    sub: 'A smaller life insurance policy meant for one job: covering funeral and end-of-life costs, so the people you love can grieve without a bill hanging over them.',
    cta: 'Get My Final Expense Quote',
    sections: [
      { eyebrow: 'What It Covers', h2: 'Coverage Sized for the Costs Families Actually Face',
        lead: 'Final expense insurance is whole life insurance with a smaller benefit. Your family can use the money however they need to.',
        cards: [
          ['⚱️', 'Funeral, Burial or Cremation', 'The service, the plot or urn, the headstone, and the fees that come with them.'],
          ['🧾', 'Final Bills', 'Medical bills, credit cards or other debts that would otherwise fall to your family.'],
          ['🏡', 'Room to Breathe', 'Travel for family, time off work, or simply a cushion while everything is settled.']
        ] },
      { eyebrow: 'Your Options', h2: 'Two Ways to Qualify', alt: true,
        lead: 'Most people qualify one of two ways. We will tell you plainly which fits your health and budget.',
        cards: [
          ['📝', 'Simplified Issue', 'A short set of health questions and no medical exam. If you qualify, coverage can start right away.'],
          ['🤝', 'Guaranteed-Issue Plans', 'Some plans ask no health questions at all. These plans usually pay the full benefit only after a waiting period, commonly two years, so we look at simplified-issue options first.'],
          ['🔒', 'Coverage That Lasts', 'Final expense is a form of whole life insurance: as long as premiums are paid, it does not expire at a certain age.']
        ] },
      { eyebrow: 'Who It Helps', h2: 'Is Final Expense Right for You?',
        lead: 'It is often a fit if you are roughly 50 to 85, live on a fixed income, or have health conditions that make larger policies hard to get. If you need more coverage, for a mortgage or young children, we will show you term or whole life options too, and help Fort Sill families compare with VGLI.',
        links: [['/fort-sill-life-insurance', 'Leaving the military? Read about VGLI and your options →'],
                ['/lawton/mortgage-protection-insurance', 'Need to protect the house too? See mortgage protection →']] }
    ],
    faqs: [
      ['How much does final expense insurance cost?', 'It depends on your age, health, tobacco use and the coverage amount. We quote options from several highly rated carriers so you can choose a monthly premium that fits your budget. The quote is free.'],
      ['Can I get coverage with health problems?', 'Often, yes. Many simplified-issue plans accept common conditions such as controlled diabetes or high blood pressure. If not, guaranteed-issue plans ask no health questions, though they usually have a waiting period before the full benefit is paid.'],
      ['Is there a waiting period?', 'Simplified-issue plans usually have none if you qualify. Guaranteed-issue plans usually do, commonly two years, and during that time they typically return premiums plus interest instead of the full benefit for death from illness.'],
      ['What is the difference between burial insurance and life insurance?', 'Burial or final expense insurance is life insurance. It is whole life with a smaller benefit, sold with a simpler application. The benefit is paid to your beneficiary, who can use it for any cost.'],
      ['Do you serve towns outside Lawton?', 'Yes. We help families across Comanche County and the surrounding area, including Cache, Elgin, Duncan, Anadarko and Frederick. We are licensed in Oklahoma and Missouri, so we cannot quote people who live in Texas.']
    ]
  },
  {
    file: 'lawton-mortgage-protection-insurance.html',
    path: '/lawton/mortgage-protection-insurance',
    market: 'lawton',
    serviceType: 'Mortgage protection insurance',
    title: 'Mortgage Protection Insurance in Lawton, OK',
    description: 'Mortgage protection life insurance for Lawton and Fort Sill homeowners, including families with a VA loan. Free, no-obligation quote from a local agent.',
    eyebrow: 'Lawton · Fort Sill · Comanche County',
    h1: 'Mortgage Protection<br><em>for Lawton Homeowners</em>',
    sub: 'If something happened to you, could your family keep the house? Mortgage protection is life insurance sized to your mortgage, paid to your family, not the bank.',
    cta: 'Get My Mortgage Protection Quote',
    sections: [
      { eyebrow: 'How It Works', h2: 'Your Family Decides What to Do With the Money',
        cards: [
          ['🏠', 'Sized to Your Mortgage', 'Usually a term life policy with a benefit close to your loan balance, for about the years left on your loan.'],
          ['👨‍👩‍👧', 'Paid to Your Family', 'The benefit goes to your beneficiary. They can pay off the house, keep making payments, or use it for other needs.'],
          ['🩺', 'Optional Living Benefits', 'Some policies can pay part of the benefit early for a qualifying serious illness. We will show you which options include this.']
        ] },
      { eyebrow: 'Know the Difference', h2: 'Mortgage Protection Is Not PMI or the Lender\'s Offer', alt: true,
        cards: [
          ['🏦', 'PMI Protects the Lender', 'Private mortgage insurance covers the lender if a loan defaults. It does not pay anything to your family if you die. VA loans do not require PMI.'],
          ['📉', 'Lender Mortgage Life', 'Coverage offered through a lender often pays the lender directly, and the benefit may shrink as your balance goes down.'],
          ['✅', 'Your Own Policy', 'An individual policy belongs to you, names your family as beneficiary, and stays with you if you refinance or move.']
        ] },
      { eyebrow: 'Military Families', h2: 'Bought With a VA Loan Near Fort Sill?',
        lead: 'A VA loan guarantee protects the lender, not your family. It does not pay off your home if you pass away. If orders take you elsewhere, an individual policy generally stays in force as long as premiums are paid, so your coverage can move with you.',
        links: [['/fort-sill-life-insurance', 'Leaving the service? Compare VGLI and private coverage →'],
                ['/lawton/final-expense-insurance', 'Looking for smaller coverage for final expenses? →']] }
    ],
    faqs: [
      ['Is mortgage protection insurance worth it?', 'If your family would struggle to make the payments without your income, it can be. We will look at your loan balance, your existing coverage (including any coverage through work or the military) and your budget before recommending anything.'],
      ['What is the difference between PMI and mortgage protection?', 'PMI protects the lender if the loan defaults. Mortgage protection is life insurance that pays your family if you die, so they can decide how to handle the house.'],
      ['Does it pay the bank or my family?', 'An individual mortgage protection policy pays your named beneficiary, usually your spouse or family, not the bank.'],
      ['Does the VA pay off my mortgage if I die?', 'Generally, no. The VA home loan guarantee protects the lender. Veterans\' Mortgage Life Insurance exists only for certain veterans with severe service-connected disabilities who received a specially adapted housing grant. Check va.gov for details.'],
      ['How much coverage do I need?', 'Many families start with the loan balance and a term that matches the years left on the mortgage, then adjust for other debts and goals. We will help you find a number that fits your budget.']
    ]
  },
  {
    file: 'fort-sill-life-insurance.html',
    path: '/fort-sill-life-insurance',
    market: 'lawton',
    serviceType: 'Life insurance for military families',
    title: 'Life Insurance After Fort Sill: VGLI and Your Options',
    description: 'Leaving the Army at Fort Sill? A plain guide to the SGLI-to-VGLI timeline and how private life insurance compares, from a local licensed agent.',
    eyebrow: 'Fort Sill · Lawton · Military Families',
    h1: 'Life Insurance When<br><em>You Leave Fort Sill</em>',
    sub: 'SGLI does not follow you into civilian life on its own. Here is the timeline, your options, and how to compare them calmly, with no pressure either way.',
    cta: 'Get My Free Coverage Review',
    articleSchema: true,
    sections: [
      { eyebrow: 'The Timeline', h2: 'What Happens to SGLI After You Separate', military: true,
        lead: 'These dates are summarized from VA guidance. Program details can change, so confirm them at va.gov before you decide.',
        cards: [
          ['120 days', 'SGLI Keeps Going for 120 Days', 'Your SGLI coverage generally continues for 120 days after separation at no cost. After that it ends unless you have converted it or replaced it.'],
          ['240 days', 'VGLI With No Health Questions', 'If you apply for Veterans\' Group Life Insurance within 240 days of separating, you generally do not have to answer health questions.'],
          ['1 year + 120 days', 'The Final VGLI Deadline', 'You can still apply up to 1 year and 120 days after separating, but health questions apply after day 240. VGLI coverage cannot exceed the SGLI amount you had when you separated.']
        ] },
      { eyebrow: 'Compare', h2: 'VGLI or Private Coverage? Look at Both', alt: true,
        lead: 'Neither choice is right for everyone. Many veterans keep VGLI, some replace it, and some combine the two.',
        cards: [
          ['📈', 'How VGLI Is Priced', 'VGLI premiums are set by age group and go up as you get older. Its biggest advantage is the no-health-questions window.'],
          ['🧮', 'How Private Coverage Differs', 'A private term or whole life policy is priced on your age and health when you apply. For some healthy veterans, a level-premium term policy can cost less over time. For others, VGLI is the better deal.'],
          ['👪', 'Your Spouse\'s Coverage', 'Family SGLI coverage for a spouse generally ends after separation. Spouses usually need their own policy, and we can quote one alongside yours.']
        ] },
      { eyebrow: 'A Simple Checklist', h2: 'Before You Decide',
        list: [
          'Write down your separation date and mark day 120 and day 240 on a calendar.',
          'Check your current SGLI amount and whether you have Family SGLI for your spouse.',
          'Get a VGLI premium estimate for your age from va.gov.',
          'Get a private quote for the same coverage amount, so you compare like with like.',
          'If you are unsure about your health questions, apply for VGLI inside the 240-day window first. You can always add or replace coverage later; you cannot get the no-health-questions window back.'
        ],
        links: [['/lawton', 'More about our Lawton agency →'],
                ['/lawton/mortgage-protection-insurance', 'Buying a home near Fort Sill? See mortgage protection →']] }
    ],
    fine: 'Program details can change. Confirm current SGLI, FSGLI and VGLI rules at <a href="https://www.va.gov/life-insurance/" target="_blank" rel="noopener">va.gov/life-insurance</a>. Daniels\' Legacy Planning is an independent insurance agency and is not affiliated with or endorsed by the U.S. Army, the Department of Defense, or the Department of Veterans Affairs. We do not recommend dropping VGLI without comparable coverage in place.',
    faqs: [
      ['Should I convert SGLI to VGLI?', 'It depends on your health, budget and family. VGLI\'s big advantage is that you can get it with no health questions if you apply within 240 days of separation. We can show you a private quote next to it so you can compare.'],
      ['What happens to my life insurance when I leave the military?', 'SGLI generally continues for 120 days after separation at no cost, then ends. You can convert to VGLI, buy private coverage, or both.'],
      ['Can I have both VGLI and private coverage?', 'Yes. Some veterans keep VGLI and add a private policy, or keep VGLI until private coverage is approved and in force.'],
      ['Does my spouse\'s coverage end when I separate?', 'Family SGLI coverage for a spouse generally ends after separation. Check va.gov for the current rules and conversion options, and ask us for a quote for your spouse.'],
      ['Are you part of the Army or the VA?', 'No. We are an independent, family-owned insurance agency licensed in Oklahoma and Missouri. We are not affiliated with the Army, the Department of Defense, or the VA.']
    ]
  },
  {
    file: 'stl-final-expense-insurance.html',
    path: '/stl/final-expense-insurance',
    market: 'stl',
    serviceType: 'Final expense insurance',
    title: 'Final Expense Insurance in St. Louis, MO | Daniels\' Legacy',
    description: 'Final expense and burial insurance for St. Louis, St. Charles and Jefferson County families. A local, independent agent. Free, no-obligation quote.',
    eyebrow: 'St. Louis · St. Charles · Jefferson County',
    h1: 'Final Expense Insurance<br><em>for St. Louis Families</em>',
    sub: 'A smaller life insurance policy meant to cover funeral and end-of-life costs, so your family can focus on each other instead of the bills.',
    cta: 'Get My Final Expense Quote',
    sections: [
      { eyebrow: 'What It Covers', h2: 'Coverage Sized for the Costs Families Actually Face',
        lead: 'Final expense insurance is whole life insurance with a smaller benefit. Your family can use the money however they need to.',
        cards: [
          ['⚱️', 'Funeral, Burial or Cremation', 'The service, the plot or urn, the headstone, and the fees that come with them.'],
          ['🧾', 'Final Bills', 'Medical bills, credit cards or other debts that would otherwise fall to your family.'],
          ['🏡', 'Room to Breathe', 'Travel for family, time off work, or simply a cushion while everything is settled.']
        ] },
      { eyebrow: 'Your Options', h2: 'Two Ways to Qualify', alt: true,
        lead: 'Most people qualify one of two ways. We will tell you plainly which fits your health and budget.',
        cards: [
          ['📝', 'Simplified Issue', 'A short set of health questions and no medical exam. If you qualify, coverage can start right away.'],
          ['🤝', 'Guaranteed-Issue Plans', 'Some plans ask no health questions at all. These plans usually pay the full benefit only after a waiting period, commonly two years, so we look at simplified-issue options first.'],
          ['🔒', 'Coverage That Lasts', 'Final expense is a form of whole life insurance: as long as premiums are paid, it does not expire at a certain age.']
        ] },
      { eyebrow: 'Where We Help', h2: 'Serving the Missouri Side of the Metro',
        lead: 'We work with families in St. Louis City and St. Louis, St. Charles, Jefferson, Franklin, Lincoln and Warren counties. We are licensed in Missouri and Oklahoma, so we cannot quote people who live in Illinois.',
        links: [['/stl/mortgage-protection-insurance', 'Need to protect the house too? See mortgage protection →'],
                ['/stl', 'More about our St. Louis agency →']] }
    ],
    faqs: [
      ['How much does final expense insurance cost in Missouri?', 'It depends on your age, health, tobacco use and the coverage amount. We quote options from several highly rated carriers so you can choose a monthly premium that fits your budget. The quote is free.'],
      ['Can I get coverage with health problems?', 'Often, yes. Many simplified-issue plans accept common conditions such as controlled diabetes or high blood pressure. If not, guaranteed-issue plans ask no health questions, though they usually have a waiting period before the full benefit is paid.'],
      ['Is there a waiting period?', 'Simplified-issue plans usually have none if you qualify. Guaranteed-issue plans usually do, commonly two years, and during that time they typically return premiums plus interest instead of the full benefit for death from illness.'],
      ['Does it pay out quickly?', 'Life insurance claims are usually paid to the beneficiary once the insurer receives the death certificate and claim form. We help your family with the claim paperwork.'],
      ['I live in the Metro East. Can you help?', 'Not yet. We are licensed in Missouri and Oklahoma, so we can only quote people who live in those two states.']
    ]
  },
  {
    file: 'stl-mortgage-protection-insurance.html',
    path: '/stl/mortgage-protection-insurance',
    market: 'stl',
    serviceType: 'Mortgage protection insurance',
    title: 'Mortgage Protection Insurance in St. Louis, MO',
    description: 'Keep your family in the house if something happens to you. Mortgage protection life insurance for St. Louis-area homeowners. Free quote.',
    eyebrow: 'St. Louis · St. Charles · Jefferson County',
    h1: 'Mortgage Protection<br><em>for St. Louis Homeowners</em>',
    sub: 'If something happened to you, could your family keep the house? Mortgage protection is life insurance sized to your mortgage, paid to your family, not the bank.',
    cta: 'Get My Mortgage Protection Quote',
    sections: [
      { eyebrow: 'How It Works', h2: 'Your Family Decides What to Do With the Money',
        cards: [
          ['🏠', 'Sized to Your Mortgage', 'Usually a term life policy with a benefit close to your loan balance, for about the years left on your loan.'],
          ['👨‍👩‍👧', 'Paid to Your Family', 'The benefit goes to your beneficiary. They can pay off the house, keep making payments, or use it for other needs.'],
          ['🩺', 'Optional Living Benefits', 'Some policies can pay part of the benefit early for a qualifying serious illness. We will show you which options include this.']
        ] },
      { eyebrow: 'Know the Difference', h2: 'Mortgage Protection Is Not PMI or the Lender\'s Offer', alt: true,
        cards: [
          ['🏦', 'PMI Protects the Lender', 'Private mortgage insurance covers the lender if a loan defaults. It does not pay anything to your family if you die.'],
          ['📉', 'Lender Mortgage Life', 'Coverage offered through a lender often pays the lender directly, and the benefit may shrink as your balance goes down.'],
          ['✅', 'Your Own Policy', 'An individual policy belongs to you, names your family as beneficiary, and stays with you if you refinance or move.']
        ] },
      { eyebrow: 'New Homeowners', h2: 'Just Bought in St. Charles County or the City?',
        lead: 'The months after closing are when most families think about this, and when rates are based on your current age and health. We serve the Missouri side of the metro: St. Louis City and St. Louis, St. Charles, Jefferson, Franklin, Lincoln and Warren counties. We cannot quote homes in Illinois.',
        links: [['/stl/final-expense-insurance', 'Looking for smaller coverage for final expenses? →'],
                ['/stl', 'More about our St. Louis agency →']] }
    ],
    faqs: [
      ['Is mortgage protection insurance worth it?', 'If your family would struggle to make the payments without your income, it can be. We will look at your loan balance, any coverage through work, and your budget before recommending anything.'],
      ['What is the difference between PMI and mortgage protection?', 'PMI protects the lender if the loan defaults. Mortgage protection is life insurance that pays your family if you die, so they can decide how to handle the house.'],
      ['Does it pay the bank or my family?', 'An individual mortgage protection policy pays your named beneficiary, usually your spouse or family, not the bank.'],
      ['Is my life insurance through work enough?', 'Sometimes. Group coverage through work is often a multiple of salary and usually ends if you leave the job. We will look at it with you before suggesting anything new.'],
      ['How much coverage do I need?', 'Many families start with the loan balance and a term that matches the years left on the mortgage, then adjust for other debts and goals. We will help you find a number that fits your budget.']
    ]
  }
];

// ── Template ─────────────────────────────────────────────────────────────
function jsonLd(page) {
  const m = MARKETS[page.market];
  const url = SITE + page.path;
  const graph = [
    AGENCY_SCHEMA,
    {
      '@type': 'Service', '@id': `${url}#service`, name: page.serviceType, serviceType: page.serviceType,
      url, provider: { '@id': AGENCY_SCHEMA['@id'] }, areaServed: [m.area, { '@type': 'State', name: m.state }]
    },
    {
      '@type': 'FAQPage', '@id': `${url}#faq`,
      mainEntity: page.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: m.hubName, item: SITE + m.hub },
        { '@type': 'ListItem', position: 3, name: page.serviceType, item: url }
      ]
    }
  ];
  if (page.articleSchema) {
    graph.push({ '@type': 'Article', headline: page.title, url, author: { '@id': AGENCY_SCHEMA['@id'] },
      publisher: { '@id': AGENCY_SCHEMA['@id'] } });
  }
  // Escape "<" so no string can close the script tag early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
}

function cardsHtml(cards, military) {
  return `<div class="city-cards">\n${cards.map(([icon, h, p]) => `      <div class="city-card">
        ${military ? `<span class="sgli-step">${esc(icon)}</span>` : `<div class="product-icon">${icon}</div>`}
        <h3>${esc(h)}</h3>
        <p>${esc(p)}</p>
      </div>`).join('\n')}\n    </div>`;
}

function sectionHtml(s) {
  const cls = s.military ? 'military-section' : `city-section${s.alt ? ' alt' : ''}`;
  return `<section class="${cls}">
  <div class="city-inner">
    <div class="section-eyebrow"${s.military ? '' : ' style="text-align:center;"'}>${esc(s.eyebrow)}</div>
    <h2>${esc(s.h2)}</h2>
    ${s.lead ? `<p class="city-lead">${esc(s.lead)}</p>` : ''}
    ${s.cards ? cardsHtml(s.cards, s.military) : ''}
    ${s.list ? `<ol class="seo-checklist">\n${s.list.map(i => `      <li>${esc(i)}</li>`).join('\n')}\n    </ol>` : ''}
    ${s.links ? `<p class="seo-links">${s.links.map(([href, text]) => `<a href="${href}">${esc(text)}</a>`).join('<br>')}</p>` : ''}
  </div>
</section>`;
}

export function renderPage(page) {
  const m = MARKETS[page.market];
  const quiz = (label) => `data-quiz-open data-quiz-label="${esc(label)}" data-quiz-section="${page.market}"`;
  return `<!-- © 2026 GoElev8.ai | Aaron Bryant. All rights reserved. Unauthorized use prohibited. -->
<!-- GENERATED by scripts/build-seo-pages.mjs. Edit the content there and re-run; don't edit this file. -->
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BXLC9EZSYK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-BXLC9EZSYK');
</script>
<!-- Conversion tracking scaffolding, same as index.html. While an ID still
     starts with "TODO" its tag is not loaded. Conversions fire only from
     dlpTrackLeadConversion(), after a successful form submission. -->
<script>
  window.DLP_TRACKING = {
    META_PIXEL_ID: "TODO_META_PIXEL_ID",
    GOOGLE_ADS_ID: "TODO_GOOGLE_ADS_ID"
  };
  (function (t) {
    function isSet(id) { return id && id.indexOf("TODO") !== 0; }
    if (isSet(t.GOOGLE_ADS_ID)) gtag('config', t.GOOGLE_ADS_ID);
    if (isSet(t.META_PIXEL_ID)) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', t.META_PIXEL_ID);
      fbq('track', 'PageView');
    }
    let fired = false;
    window.dlpTrackLeadConversion = function () {
      if (fired) return Promise.resolve();
      fired = true;
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
      return new Promise(function (resolve) {
        const done = setTimeout(resolve, 800);
        try {
          gtag('event', 'generate_lead', {
            transport_type: 'beacon',
            event_callback: function () { clearTimeout(done); resolve(); }
          });
        } catch (e) { clearTimeout(done); resolve(); }
      });
    };
  })(window.DLP_TRACKING);
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${SITE}${page.path}">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">
${jsonLd(page)}
</script>

<!-- Runtime config, same values as index.html. The anon key is Supabase's
     public-facing key and is safe in client JS (protected by RLS). -->
<script>
  window.DLP_CONFIG = {
    SUPABASE_URL: "https://bnkoqybkmwtrlorhowyv.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJua29xeWJrbXd0cmxvcmhvd3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MzUzODIsImV4cCI6MjA5MTAxMTM4Mn0.9_zS120_HF89HR4u_u48UOT2wgHKVHPg1W4sg4_h1mU",
    CLIENT_SLUG: "daniels-legacy-planning",
    PORTAL_URL: "https://portal.goelev8.ai",
    THANK_YOU_URL: "/thanks.html",
    CAPTURE_LEAD_URL: "https://bnkoqybkmwtrlorhowyv.supabase.co/functions/v1/capture-lead"
  };
  // Market settings read by assets/quiz.js (state pre-select, market, tracking section).
  window.DLP_PAGE = { market: "${page.market}", state: "${m.state}", section: "${m.section}" };
</script>
</head>
<body>

<!-- NAV -->
<nav class="nav">
  <a href="/"><img src="/assets/logo.png" alt="Daniels' Legacy Planning" class="nav-logo" /></a>
  <a class="nav-phone" href="tel:${PHONE.tel}">${PHONE.display}</a>
  <button type="button" class="nav-cta" ${quiz(page.cta)}>Free Quote</button>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-pattern"></div>
  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-eyebrow">✦ ${esc(page.eyebrow)}</div>
      <h1>${page.h1}</h1>
      <p class="hero-sub">${esc(page.sub)}</p>
      <div class="states-row">
        ${m.pills.map(p => `<span class="state-pill">${p}</span>`).join('\n        ')}
      </div>
      <button type="button" class="hero-cta" ${quiz(page.cta)}>${esc(page.cta)} →</button>
      <div class="hero-trust">
        <div class="trust-item"><div class="trust-check">✓</div> Free quote, no obligation</div>
        <div class="trust-item"><div class="trust-check">✓</div> Family-owned agency</div>
        <div class="trust-item"><div class="trust-check">✓</div> Or call <a href="tel:${PHONE.tel}">${PHONE.display}</a></div>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-photo-wrap">
        <img src="/assets/daniels-family.png" alt="The Daniels Family" width="452" height="640" />
        <div class="hero-photo-caption">
          <strong>Anthony Daniels</strong>
          <span>Licensed Insurance Professional · MO &amp; OK</span>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="proof-strip">Family-Owned &nbsp;·&nbsp; Licensed in Missouri and Oklahoma &nbsp;·&nbsp; No-Pressure Promise</div>

${page.sections.map(sectionHtml).join('\n\n')}
${page.fine ? `\n<section class="city-section"><div class="city-inner narrow"><p class="city-fine-print">${page.fine}</p></div></section>\n` : ''}
<!-- FAQ (same questions as the FAQPage schema above) -->
<section class="city-section alt">
  <div class="city-inner narrow">
    <div class="section-eyebrow" style="text-align:center;">Common Questions</div>
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
${page.faqs.map(([q, a]) => `      <details class="faq-item">
        <summary>${esc(q)}</summary>
        <p>${esc(a)}</p>
      </details>`).join('\n')}
    </div>
  </div>
</section>

<!-- BOTTOM CTA -->
<section class="bottom-cta">
  <h2>Whenever You're Ready, We're Here</h2>
  <p>Get a free, no-obligation quote, or call Anthony at <a href="tel:${PHONE.tel}">${PHONE.display}</a>.</p>
  <button type="button" class="btn-dark" ${quiz(page.cta)}>${esc(page.cta)} →</button>
</section>

<!-- Shared quote quiz (markup + logic live in assets/quiz.js) -->
<div id="quizModalMount"></div>

<!-- FOOTER -->
<footer>
  <img src="/assets/logo.png" alt="Daniels' Legacy Planning" style="height:50px;margin-bottom:12px;opacity:0.8;" />
  <br>
  <strong>Daniels' Legacy Planning</strong><br>
  <a href="tel:${PHONE.tel}">${PHONE.display}</a><br>
  Licensed in Missouri and Oklahoma.<!-- [TODO: NPN / MO license # / OK license #] --><br>
  <div class="disclaimer">
    This website is for informational purposes only and does not constitute a binding insurance offer.
    Coverage is subject to underwriting approval. Daniels' Legacy Planning is licensed to sell insurance products in Missouri and Oklahoma.
    Guarantees are backed by the financial strength and claims-paying ability of the issuing insurance company. DLP does not provide tax or legal advice; consult a qualified professional.
    Daniels' Legacy Planning is not affiliated with or endorsed by the U.S. Army, the Department of Defense, or the Department of Veterans Affairs.
    © <span id="footerYear"></span> Daniels' Legacy Planning. All rights reserved.
    <script>document.getElementById('footerYear').textContent = new Date().getFullYear();</script>
  </div>
  <div class="disclaimer">
    <a href="/">Home</a> &nbsp;·&nbsp; <a href="/lawton">Lawton</a> &nbsp;·&nbsp; <a href="/stl">St. Louis</a> &nbsp;·&nbsp; <a href="/fort-sill-life-insurance">Fort Sill</a> &nbsp;·&nbsp; <a href="/privacy-policy.html">Privacy Policy</a> &nbsp;·&nbsp; <a href="/terms.html">Terms</a>
  </div>
  <div class="site-credit">Site by <a href="https://goelev8.ai" target="_blank" rel="noopener">GoElev8.ai</a></div>
</footer>

<script src="/assets/quiz.js"></script>
</body>
</html>
`;
}

// ── sitemap ──────────────────────────────────────────────────────────────
export const STATIC_PATHS = ['/', '/lawton', '/stl'];
export function renderSitemap(today) {
  const paths = [...STATIC_PATHS, ...PAGES.map(p => p.path)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const page of PAGES) {
    for (const [k, max] of [['title', 60], ['description', 160]]) {
      if (page[k].length > max) throw new Error(`${page.path}: ${k} is ${page[k].length} chars (max ${max})`);
    }
    writeFileSync(join(ROOT, page.file), renderPage(page));
    console.log(`wrote ${page.file}  →  ${page.path}`);
  }
  writeFileSync(join(ROOT, 'sitemap.xml'), renderSitemap(new Date().toISOString().slice(0, 10)));
  console.log('wrote sitemap.xml');
}
