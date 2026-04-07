# RoundDrop - Product Requirements Document

**Version:** 1.1
**Date:** April 6, 2026
**Status:** Draft

---

## 1. Vision

RoundDrop is the fastest way for pre-seed and seed founders to get their round in front of the right investors — and for investors to discover high-signal deals before anyone else.

Think of it as a **deal drop platform**: founders package their round, drop it to a curated network, and investors commit — all in days, not months.

---

## 2. Problem

### For Founders
- Cold outreach to investors has a <2% response rate
- Fundraising takes 3-6 months and pulls focus from building
- No central place to manage who's seen your round, who's interested, and who's committed
- Warm intros are the #1 channel but founders don't know who knows who

### For Investors
- Deal flow is fragmented across email, Twitter DMs, Signal groups, and intro requests
- Hard to discover quality pre-seed/seed deals early — by the time you hear about it, the round is full
- No structured way to evaluate and track deals at the earliest stages
- FOMO on fast-closing rounds with no visibility into timing

---

## 3. Target Users

### Founders (Supply Side)
- **Stage:** Pre-seed and Seed
- **Profile:** Technical or domain-expert founders, often first-time, raising $250K - $4M
- **Pain:** Spending 40-60% of their time on fundraising instead of building
- **Goal:** Close their round fast with the right investors who add value

### Investors (Demand Side)
- **Profile:** Angel investors, scout programs, micro-VCs, solo GPs, emerging fund managers
- **Check size:** $5K - $500K
- **Pain:** Missing early-stage deals, drowning in low-quality inbound
- **Goal:** See high-quality pre-seed/seed deals first, move fast on the best ones

---

## 4. Core Concepts

### The "Round Drop"
A Round Drop is a founder's fundraising package — a structured, time-bound presentation of their round to a curated set of investors. It includes:
- Pitch summary (not a full deck — concise, structured data)
- Round terms (target raise, valuation/cap, instrument type — SAFE, convertible note, priced round)
- Team background
- Traction metrics (MRR, ARR, users, growth rate, retention, etc.)
- Supporting materials (pitch deck, one-pager, financials)
- Timeline (when the round closes)
- Social proof (existing investors, accelerator, notable backers)
- Calendar availability (Calendly / Cal.com link) for direct investor booking

### Trust Network
Investors and founders exist within overlapping trust circles:
- Co-investor groups (investors who've co-invested before)
- Accelerator cohorts
- Referral chains (who vouched for whom)
- Sector communities (fintech, AI, health, etc.)

### Deal Signal Score
An AI-generated signal score that helps investors prioritize deals based on:
- Founder background strength
- Traction velocity
- Round momentum (how fast allocation is filling)
- Network overlap (mutual connections, shared investors)
- Sector/thesis fit with the investor's profile

---

## 5. Feature Set

### 5.1 Founder Profile

The founder profile is the core of their presence on the platform. It must convey credibility and make it dead simple for investors to evaluate and reach out.

**Profile Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| Name & photo | Yes | Founder identity |
| LinkedIn URL | Yes | Background verification |
| Company name & one-liner | Yes | What they're building |
| Sector / industry | Yes | For investor matching (AI, fintech, health, SaaS, etc.) |
| Company website | No | Link to product/landing page |
| Accelerator / affiliations | No | YC, Techstars, On Deck, etc. — social proof |
| Calendar link | Yes | Calendly / Cal.com URL — investors can book calls directly |

**Round Drop Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| Raise amount | Yes | Target total raise (e.g., $1.5M) |
| Amount raised so far | No | Shows momentum — "$600K of $1.5M committed" |
| Instrument type | Yes | SAFE, SAFE + MFN, Convertible Note, Priced Round |
| Valuation cap | Yes (if SAFE/note) | e.g., $10M cap |
| Discount | No | e.g., 20% discount |
| Minimum check size | Yes | Filters out mismatched investors |
| Round close date | Yes | Creates urgency |
| Traction metrics | Yes | Structured fields — pick what applies: MRR, ARR, revenue, users, DAU/MAU, growth rate (MoM), retention, GMV |
| Pitch deck | Yes | Upload PDF — viewable on platform |
| Supporting docs | No | One-pager, financials, demo video link |
| Existing investors | No | Names of investors already in the round — social proof |

### 5.2 Founder Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Round Builder | P0 | Guided flow to create a Round Drop with all structured fields above |
| Calendar Integration | P0 | Add Calendly/Cal.com link so investors can book calls directly |
| Investor Discovery | P0 | See which investors match your sector, stage, and check size |
| Direct Intro Requests | P1 | Request warm intros through mutual connections on the platform |
| Round Dashboard | P0 | Track who viewed, who's interested, who's committed, total raised |
| Booking Notifications | P0 | Get notified when an investor books a call through your calendar link |
| Round Timeline | P1 | Set a close date, show urgency to investors |
| Update Broadcasts | P1 | Send progress updates to all investors tracking your round |
| Data Room (Lite) | P1 | Upload key docs (deck, financials, cap table) — access-gated per investor |
| Commitment Tracking | P2 | Track soft commits vs. signed, wire status |
| Post-Round Wrap | P2 | Auto-generate a close summary for your investor network |

### 5.3 Investor Profile

The investor profile establishes credibility and helps founders understand who's looking at their round. It also powers the matching algorithm.

**Profile Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| Name & photo | Yes | Investor identity |
| LinkedIn URL | Yes | Background verification |
| Firm / fund name | No | If affiliated (e.g., "Precursor Ventures", or "Angel — independent") |
| Investor type | Yes | Angel, Scout, Micro-VC, Solo GP, Fund, Syndicate Lead |
| Check size range | Yes | Min and max (e.g., $10K - $100K) |
| Sectors of interest | Yes | Multi-select: AI, fintech, health, SaaS, consumer, climate, etc. |
| Stage preference | Yes | Pre-seed, Seed, or both |
| Investment thesis | No | Free text — what excites them, what they look for |
| Portfolio companies | No | List of companies invested in — each entry includes: company name, round participated in (pre-seed/seed/etc.), check size (optional, can be hidden), year, and status (active / exited / write-off) |
| Total investments made | No | Aggregate count — "23 investments since 2019" |
| Notable exits | No | Highlight successful outcomes for social proof |
| Value-add description | No | What they bring beyond capital (intros, ops help, hiring, etc.) |
| Geography focus | No | Where they prefer to invest |

### 5.4 Investor Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Deal Feed | P0 | Curated feed of Round Drops matching your thesis, stage, sector |
| Signal Score | P0 | AI-ranked deals based on fit, momentum, and network overlap |
| Quick Pass / Track / Commit | P0 | Three-action triage: pass, add to watchlist, or express interest |
| Founder Profiles | P0 | Structured view of team, traction, round terms, and calendar link |
| Book a Call | P0 | One-click booking through founder's calendar link directly from the deal card |
| Direct Intro to Founder | P0 | Express interest and message the founder directly — no middleman needed |
| Intro Facilitation | P1 | Accept or facilitate warm intro requests from founders in your network |
| Portfolio Tracker | P1 | Track all investments — active, committed, pipeline — with check sizes and round details |
| Co-Investor Circles | P1 | See what other investors in your network are looking at / committing to |
| Deal Alerts | P1 | Real-time notifications when a high-signal deal drops |
| Deal Notes | P2 | Private notes on deals, share with co-investor circle |

### 5.3 Platform Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Onboarding Flow | P0 | Role-based onboarding (founder vs investor), verify identity |
| Trust Graph | P1 | Visualize connections between founders, investors, and deals |
| Referral System | P1 | Invite-based growth — "vouch" for founders/investors you trust |
| Notifications Engine | P1 | Email + push for deal drops, interest signals, intros, commitments |
| Analytics Dashboard | P2 | Platform-level insights: avg time to close, deal velocity, conversion |
| Mobile App | P2 | Native mobile for on-the-go deal triage (investors) and round management (founders) |

---

## 6. Revenue Model Options

Exploring three models — will validate during beta:

### Option A: Freemium SaaS
- **Free tier:** 1 active round (founders), 10 deal views/month (investors)
- **Pro tier ($49/mo founders, $99/mo investors):** Unlimited rounds, full signal scores, data room, priority matching
- **Pros:** Predictable revenue, low friction to start
- **Cons:** Hard to convert at pre-seed stage (founders are cash-strapped)

### Option B: Success Fee
- **2% of capital raised** through the platform (charged to founder on close)
- **Pros:** Aligned incentives, zero upfront cost
- **Cons:** Revenue is lumpy, harder to track attribution

### Option C: Investor-Paid Marketplace
- **Free for founders** (maximize supply)
- **Investors pay $199-499/mo** for premium deal flow, signal scores, early access
- **Pros:** Investors have money, founders get in free (solves cold-start)
- **Cons:** Need strong deal flow quality to justify price

### Recommendation
**Start with Option C** — free for founders to maximize deal supply, charge investors for premium access. This solves the cold-start problem (founders list for free) and aligns with investor willingness to pay for deal flow.

---

## 7. User Flows

### 7.1 Founder Flow

```
[Sign Up] --> [Onboarding: Role = Founder]
    |
    v
[Build Profile]
  - Name, photo, LinkedIn
  - Company name, one-liner, sector
  - Company website
  - Accelerator / notable affiliations
  - Calendar link (Calendly / Cal.com) <-- REQUIRED
    |
    v
[Create Round Drop]
  - Instrument type (SAFE, convertible note, priced round)
  - Target raise amount + amount raised so far
  - Valuation cap / discount
  - Minimum check size
  - Traction metrics (structured: MRR, users, growth %, retention, etc.)
  - Upload pitch deck (PDF)
  - Supporting docs (one-pager, financials, demo link)
  - Existing investors in the round
  - Round close date
    |
    v
[Review & Drop]
  - Preview exactly how investors will see the Round Drop
  - Choose visibility: public feed, invite-only, or trust network only
  - Hit "Drop Round"
    |
    v
[Round is Live]
    |
    +---> [Monitor Dashboard]
    |       - Views, saves, interest signals
    |       - Who's tracking your round
    |       - Commitment amounts
    |       - Calls booked through your calendar
    |
    +---> [Respond to Investor Interest]
    |       - See investor profiles + their portfolio
    |       - Investors may book calls directly via your calendar
    |       - Investors may message you directly
    |       - Accept/decline warm intro requests
    |       - Grant data room access
    |
    +---> [Send Updates]
    |       - "50% committed" milestones
    |       - New investor joined
    |       - Timeline changes
    |
    +---> [Close Round]
            - Mark round as closed
            - Final summary generated
            - Thank-you sent to all participants
```

### 7.2 Investor Flow

```
[Sign Up] --> [Onboarding: Role = Investor]
    |
    v
[Build Investor Profile]
  - Name, photo, LinkedIn
  - Firm / fund name (or "Angel — independent")
  - Investor type (Angel, Scout, Micro-VC, Solo GP, etc.)
  - Check size range (min - max)
  - Sectors of interest
  - Stage preference
  - Investment thesis (free text)
  - Portfolio companies:
      - Company name, round, check size (optional), year, status
  - Notable exits
  - Value-add description
    |
    v
[Browse Deal Feed]
  - Curated Round Drops ranked by Signal Score
  - Filter by: sector, stage, raise size, instrument type, geography
  - Each card shows: company, one-liner, raise amount, % committed,
    signal score, traction snapshot, close date countdown
    |
    v
[Triage Deals]
    |
    +---> [Pass] --> removed from feed, logged
    |
    +---> [Track] --> added to watchlist, get updates
    |
    +---> [Interested] --> two paths:
              |
              +---> [Book a Call] (Direct)
              |       - Click "Book Call" on the Round Drop
              |       - Opens founder's Calendly/Cal.com inline
              |       - Founder gets notified with investor's profile
              |       - No permission needed — calendar is open
              |
              +---> [Message Founder] (Direct)
              |       - Send a direct message to the founder
              |       - Founder sees investor profile + portfolio
              |       - In-platform messaging thread
              |
              +---> [Request Warm Intro] (Network)
                      - See mutual connections
                      - Request intro through a shared connection
                      - Connection vouches, founder gets endorsed intro
    |
    v
[Due Diligence]
  - View pitch deck on platform
  - Request data room access for additional docs
  - Review traction metrics
  - Check existing investors in the round
    |
    v
[Commit to Round]
  - Enter commitment amount
  - Receive SAFE/instrument details
  - Wire instructions (external)
  - Status tracked: committed -> signed -> wired
    |
    v
[Post-Investment]
  - Round appears in portfolio tracker
  - Receive founder updates
  - Can refer the founder to other investors
```

### 7.3 Investor → Founder Direct Intro Flow

The primary connection path. Investors see a deal they like and reach out directly — no gatekeeping.

```
[Investor sees Round Drop they like]
    |
    v
[Two direct options on every Round Drop card:]
    |
    +---> [Book a Call]
    |       - Opens founder's Calendly/Cal.com embed
    |       - Investor selects a time slot
    |       - Both parties get calendar invite
    |       - Founder sees: investor name, firm, check size,
    |         portfolio, and which Round Drop they're booking about
    |       - No approval step — founders opted in by adding their calendar
    |
    +---> [Send Message]
            - Investor writes a note to the founder
            - Founder receives notification with full investor profile
            - Threaded messaging in-platform
            - Founder can respond, share docs, or ignore
```

### 7.4 Warm Intro Flow (Network-Assisted)

A secondary path when investors or founders want a trusted introduction through a mutual connection.

```
[Founder wants to reach Investor X]
    |
    v
[Platform shows mutual connections]
  - "You and Investor X share 3 connections"
  - Ranked by closeness / trust level
    |
    v
[Founder requests intro through Connection Y]
    |
    v
[Connection Y receives request]
  - Sees founder's Round Drop summary
  - Options: Vouch & Intro / Decline / Ignore
    |
    v
[If Vouched]
  - Investor X receives intro with Connection Y's endorsement
  - Founder's Signal Score gets a boost from the vouch
  - Investor X can: Book Call / Message / Track / Pass
```

**Note:** Investors can also request warm intros to founders through mutual connections — the flow works in both directions.

### 7.4 Round Drop Lifecycle

```
DRAFT --> LIVE --> CLOSING --> CLOSED
  |         |        |          |
  |         |        |          +-- Summary generated
  |         |        |              Portfolio updated
  |         |        |
  |         |        +-- <30% allocation left
  |         |            Urgency signals sent
  |         |            "Closing soon" badge
  |         |
  |         +-- Visible to investors
  |             Signal scores calculated
  |             Matching algorithm active
  |
  +-- Founder editing
      Not visible to investors
```

---

## 8. Signal Score Algorithm (v1)

Inputs and rough weighting:

| Factor | Weight | Source |
|--------|--------|--------|
| Founder background | 20% | LinkedIn data, prior exits, domain expertise |
| Traction velocity | 25% | MoM growth in key metric (revenue, users) |
| Round momentum | 20% | % committed, rate of new interest, time since drop |
| Network signal | 20% | Vouches from trusted investors, co-investor overlap |
| Thesis fit | 15% | Match between deal attributes and investor's stated preferences |

Output: Score from 0-100, bucketed as:
- **90+** Hot — closing fast, strong signals
- **70-89** Warm — solid fundamentals, good fit
- **50-69** Interesting — worth a look
- **<50** Low match — likely a pass for this investor

*Score is personalized per investor, not universal.*

---

## 9. Technical Architecture (High Level)

```
Frontend:     Next.js (web) + React Native (mobile, P2)
Backend:      Node.js API (Express or Fastify)
Database:     PostgreSQL (primary) + Redis (caching, real-time)
Auth:         Clerk or Auth0 (social login, email magic link)
AI/ML:        OpenAI / Claude API for signal scoring, matching
Search:       Typesense or Algolia (deal search, filtering)
Storage:      S3 (pitch decks, data room files)
Real-time:    WebSockets (deal updates, notifications)
Payments:     Stripe (subscription billing)
Hosting:      Vercel (frontend) + Railway or AWS (backend)
```

---

## 10. MVP Scope (v0.1)

Ship the smallest thing that delivers value:

**Founders can:**
- Sign up, build a full profile (company, sector, LinkedIn, calendar link)
- Create a Round Drop with structured fields (raise amount, instrument type, cap, metrics, deck)
- See who's viewed, who's interested, who's booked a call
- Receive direct messages and call bookings from investors

**Investors can:**
- Sign up, build investor profile (check size, sectors, thesis, portfolio companies)
- Browse a deal feed with basic matching and filtering
- Pass / Track / Express Interest on deals
- Book a call directly through founder's calendar link
- Message founders directly from the deal card
- View pitch decks on-platform

**Platform:**
- Role-based onboarding (founder vs investor)
- Basic deal matching (rules-based, not AI yet)
- Email notifications (new interest, call booked, messages)
- In-platform messaging (founder <> investor)
- Calendly/Cal.com embed for direct booking

**Not in MVP:**
- Signal Score AI (use simple rules-based ranking)
- Warm intro / vouch system (direct intros only in v1)
- Data Room (deck upload covers this initially)
- Co-investor circles
- Portfolio tracker (investors list companies in profile, no live tracking)
- Mobile app
- Payment / subscriptions (free during beta)
- Commitment tracking / wire status

---

## 11. Success Metrics

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Founders signed up | 200 |
| Round Drops published | 50 |
| Investors signed up | 500 |
| Interest signals sent | 1,000 |
| Rounds closed via platform | 5 |
| Avg time from Drop to first interest | < 48 hours |
| Founder NPS | > 50 |
| Investor weekly active rate | > 30% |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cold start — no deals, no investors | High | Launch with a curated batch of 10-20 founders from accelerators. Seed the investor side with angel networks |
| Low quality deals flood the feed | High | Invite-only or application-based for founders in v1. Vouch system gates quality |
| Regulatory (broker-dealer concerns) | Medium | Platform facilitates intros and tracking, NOT capital movement. No money flows through RoundDrop |
| Investors ghost after expressing interest | Medium | Track response rates, surface "responsive investor" badges |
| Founders share sensitive info to unvetted investors | Medium | Investor verification during onboarding (LinkedIn, accredited investor check) |

---

## 13. Go-to-Market

### Phase 1: Closed Beta (Month 1-2)
- Hand-pick 20 founders from YC, Techstars, On Deck alumni
- Invite 50-100 active angel investors
- Gather feedback, iterate on matching quality

### Phase 2: Invite-Only Launch (Month 3-4)
- Open to founders via application (keep quality high)
- Investors can join via referral from existing members
- Launch on Product Hunt, Hacker News

### Phase 3: Open Access (Month 5+)
- Open founder signups with lightweight screening
- Introduce investor subscription tiers
- Partnership with accelerators for deal pipeline

---

## 14. Competitive Landscape

| Platform | What they do | RoundDrop differentiator |
|----------|-------------|------------------------|
| AngelList | Full-stack fundraising + SPVs | Too complex for pre-seed. RoundDrop is faster, lighter |
| Carta | Cap table + fundraising tools | Enterprise-focused, expensive. We're founder-first |
| DocSend | Deck sharing + analytics | No investor matching, no community layer |
| Signal NFX | VC signal tracking | Investor-side only. We serve both sides |
| Twitter/X | Where deals actually happen | Unstructured, no tracking, no matching |

**RoundDrop's edge:** Purpose-built for the speed of pre-seed/seed. Not a full platform — a deal drop with smart matching and trust-based intros. Get in, get funded, get back to building.

---

*Next steps: Validate with 5 founders and 5 investors. Then start building the MVP.*
