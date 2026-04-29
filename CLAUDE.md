@AGENTS.md

# RoundDrop — Working Memory

**Last updated:** April 26, 2026
**Founder:** Twinee Madan (twinee.madan@gmail.com)

---

## What RoundDrop Is

A two-sided fundraising platform for pre-seed and seed founders ($250K–$4M raises). Founders package and "drop" their round to a curated investor network. Investors get early, high-signal deal flow. The platform handles matching, tracking, warm intros, and post-close updates.

**Tech stack:** Next.js frontend, Node.js backend, PostgreSQL + Redis, OpenAI/Claude for AI features.
**Stage:** Preview/prototype built (see `preview-dashboard.html`). Not yet in production.

---

## What's Already Built (preview-dashboard.html)

The following pages and features are fully implemented in the HTML preview:

| Page / Feature | Status | Notes |
|---|---|---|
| Round dashboard (founder view) | Done | KPI strip, progress bar, committed investors list, pipeline funnel chart, "eyes on you" analytics, activity feed |
| Investor portfolio view | Done | Full KPIs, sector allocation stacked bar, by-stage, portfolio table with status tags |
| Profile editor (founder + investor) | Done | Cover, avatar, company tile, traction fields, doc links, sector chips, verified badge |
| Public profiles (founder + investor) | Done | page-founderview and page-investorview |
| Role switcher (Founder ↔ Investor) | Done | Topbar toggle wired to all view states |
| Connections / Network page | Done | RoundDrop network grid, suggested connections with mutual counts |
| LinkedIn import (CSV + manual URL) | Done | Foundation for warm intro — CSV upload + manual add, shows "X mutual connections" |
| Messages | Done | Thread list + conversation UI |
| Notifications | Done | Notification feed with action CTAs |
| Events | Done | Event card grid |
| Resources / Fundraising toolkit | Done | 6 static cards including SAFE vs. Note primer |

**Not yet built (the 6 true gaps):**

| Gap | Priority | Quarter |
|---|---|---|
| G1 — Investors page + AI matching | P0 | Q2 2026 |
| G2 — Pipeline Kanban CRM | P0 | Q2 2026 |
| G3 — Warm intro path on investor cards | P1 | Q2 2026 (LinkedIn import already done) |
| G4 — SAFE / convertible note interactive generator | P1 | Q3 2026 (static article already in Resources) |
| G5 — Investor Update Room (post-close) | P2 | Q3 2026 |
| G6 — SPV Commitment Tracker | P3 | Q4 2026 |

---

## Key Decisions Made (April 26, 2026 session)

### Competitive positioning vs. Raisi.ai
- Raisi.ai's moat is **live behavioral investor signals + compounding ML** (data flywheel from running campaigns). They are service-heavy, not self-serve, and skip the pre-seed/angel segment entirely.
- RoundDrop's positioning: own the **first-check fundraising OS** — the $50K–$2M pre-seed/seed layer Raisi won't touch. Transparent pricing, self-serve, with investor-side tools no competitor has built.
- Raisi does NOT publish pricing (custom quotes). RoundDrop's transparency is a competitive advantage — keep it.

### Pricing architecture (revised)
| Tier | Price | Key features |
|---|---|---|
| Starter | Free | 1 pitch page, browse 50 investors/month, preview 5 AI matches, 10 CRM contacts |
| Launch (was Boost) | $79/mo annual | Unlimited pitch pages, full investor DB, Pipeline Kanban, SAFE templates |
| Raise (was Pro) | $129/mo annual | + warm intro finder, investor update room, 3 power-up sessions/month |
| Scale | $399/mo | + AI signals, managed LinkedIn outreach, SPV tracker included, 5 sessions/month |
| Investor | $99/mo | Separate investor-side portal — deal flow feed, portfolio tracker, GP suite |
| SPV (a la carte) | $499/SPV | Per-deal for occasional syndicators |

### Investor-side expansion (the blue ocean)
Three personas to serve — none are served well by any competitor today:
- **Angel investors** — curated deal flow, co-invest coordination, portfolio tracker
- **Solo GPs** — deal pipeline CRM, LP update composer, investment memo templates ($199–299/mo GP Suite)
- **SPV / Syndicate managers** — LP roster, wire tracker, DocuSign routing, LP update blasts

### AI Investor Matching — 3-phase roadmap
- **V1 (Q2):** Rule-based. Pull recent deal activity from Crunchbase/Harmonic API. "Last Active" badge. Sort by recency + sector fit.
- **V2 (Q3):** NLP thesis match score. Tag founder description + compare to investor portfolio. Show % match badge.
- **V3 (Q1 2027):** Reply prediction model. Instrument all platform outreach. Train anonymized model on reply/no-reply outcomes. This is the data flywheel / moat.

### Warm intro — already half built
The Connections page already has LinkedIn CSV import and shows "X mutual connections" on suggestions. G3 is just wiring this data to investor search results and adding the intro request flow (low effort).

---

## Files in This Folder

| File | Description |
|---|---|
| `preview-dashboard.html` | Full UI prototype — all pages, both roles, role switcher |
| `PRD.md` | Original PRD v1.1 (April 6, 2026) — good for vision and user flows |
| `rounddrop_prd_v2.docx` | **Current PRD** — revised April 26, 2026 against existing build. 9 sections, 6 true gaps specced with acceptance criteria, revised pricing, integration notes, timeline. USE THIS ONE. |
| `CLAUDE.md` | This file — working memory for Claude sessions |

---

## Open Questions (as of April 26, 2026)

1. **Investor data API:** Crunchbase vs. Harmonic.ai vs. Apollo — which gives best recent-deal signal at what cost? Needed before G1 V1 can be scoped.
2. **LinkedIn API access tier:** Full 2nd-degree graph requires LinkedIn Partner Program — timeline unknown.
3. **SAFE template legal review:** Which attorney, what timeline and cost?
4. **DocuSign vs. HelloSign vs. native e-sign** for SPV commitment tracker.
5. **SPV accreditation verification:** Self-certification checkbox for V1, or Parallel Markets integration required?
6. **Free tier feature gating:** Client-side (easy, bypassable) or server-side (required for production)?

---

## Competitive Context

| Competitor | Positioning | Key gap vs. RoundDrop |
|---|---|---|
| Raisi.ai | AI-managed investor outreach (done-with-you) | Service-heavy, no self-serve, no pre-seed/angel focus, no pitch page, no SPV |
| Visible.vc | Investor updates + CRM + DB | No AI matching, limited investor-side, post-seed focus |
| OpenVC | Free investor DB + CRM | No pitch pages, no AI, no SPV, no investor portal |
| Foundersuite | Investor CRM + database | Expensive, no AI, no investor side |
| AngelList | Full-stack SPV + fund admin | Too complex/expensive for pre-seed founders; doesn't serve the earliest check |
