import Link from "next/link";

function LogoMark({ size = 28, id = "nav" }: { size?: number; id?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="shrink-0">
      <defs>
        <linearGradient id={`${id}L`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#F0D848" />
        </linearGradient>
        <linearGradient id={`${id}R`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2A9D5C" />
          <stop offset="100%" stopColor="#7EDDA0" />
        </linearGradient>
      </defs>
      <path d="M152 162 Q172 80 102 38" fill="none" stroke={`url(#${id}R)`} strokeWidth="22" strokeLinecap="round" />
      <path d="M48 162 Q28 80 98 38" fill="none" stroke={`url(#${id}L)`} strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

function Badge() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
      style={{ border: "1px solid #7EDDA0", background: "rgba(80,200,120,0.08)", color: "#2A9D5C" }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full" style={{ background: "#50C878" }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#50C878" }} />
      </span>
      Launching Q2 2026 &middot; Limited early access
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ color: "#0F1A2E" }}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function DealCard({
  name,
  stage,
  tagColor,
  tagBg,
  description,
  metrics,
  filled,
  follows,
  hot,
  closing,
}: {
  name: string;
  stage: string;
  tagColor: string;
  tagBg: string;
  description: string;
  metrics: { label: string; value: string }[];
  filled: number;
  follows: number;
  hot?: boolean;
  closing?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold" style={{ color: "#0F1A2E" }}>{name}</h3>
        <div className="flex gap-1.5">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: tagBg, color: tagColor }}
          >
            {stage}
          </span>
          {closing ? (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              Closing Friday
            </span>
          ) : null}
          {hot ? (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              Hot
            </span>
          ) : null}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex gap-4 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-xs">
            <span className="text-gray-500">{m.label}</span>
            <p className="font-semibold" style={{ color: "#0F1A2E" }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${filled}%`, background: "linear-gradient(90deg, #E8C026, #50C878)" }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{filled}% filled</span>
        <span>{follows} follows</span>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-7">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm mb-4"
        style={{ background: "rgba(232,192,38,0.12)", color: "#D4A017" }}
      >
        {number}
      </div>
      <h3 className="font-bold mb-2" style={{ color: "#0F1A2E" }}>{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1100px] flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} id="nav" />
            <span className="text-base font-bold" style={{ color: "#0F1A2E" }}>
              Round<span style={{ color: "#50C878" }}>Drop</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#live-rounds" className="hover:text-gray-900 transition-colors">
              Live rounds
            </a>
            <a href="#join" className="hover:text-gray-900 transition-colors">
              Join the waitlist
            </a>
          </div>
          <Link
            href="/sign-up"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-105 hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
          >
            Join the waitlist &rarr;
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white pt-16 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 text-center">
          <Badge />
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{ letterSpacing: "-1.5px", color: "#0F1A2E" }}>
            Fundraising should feel like a{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #E8C026, #50C878)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              launch
            </span>
            , not a cold call marathon.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            RoundDrop is the public launchpad where startups drop their live
            investment rounds — and investors discover the next big thing before
            anyone else.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-12 flex max-w-xl justify-between gap-8">
            <StatCard value="6+ months" label="Avg time to close pre-seed" />
            <StatCard value="70%" label="Founders cite fundraising as biggest blocker" />
            <StatCard value="1,000s" label="Investors searching for deal flow daily" />
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-105 hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
            >
              Drop Your Round
            </Link>
            <Link
              href="/sign-up"
              className="btn-secondary-investor inline-flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-px"
            >
              Browse as Investor
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Join 200+ founders and investors already on the early access waitlist &middot; New drops every Friday
          </p>

          <div className="mt-4">
            <Link
              href="/demo"
              className="text-sm font-medium transition-colors underline underline-offset-4"
              style={{ color: "#2E6BAD" }}
            >
              Or try the interactive demo &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-200 bg-white py-20">
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: "#E8C026" }}>How it works</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#0F1A2E" }}>
              A launch moment, not a listing
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              number={1}
              title="Drop your round"
              description="Founders upload raise details, valuation, metrics, deck. Goes live weekly."
            />
            <StepCard
              number={2}
              title="Rounds trend up"
              description="Investors follow, view, and request intros. Strong signals bubble up the leaderboard."
            />
            <StepCard
              number={3}
              title="Direct intros, instantly"
              description="Verified investors request meetings in one click. No gatekeepers."
            />
            <StepCard
              number={4}
              title="Calendar-native booking"
              description="Accepted intros go to both calendars in under 60 seconds."
            />
          </div>
        </div>
      </section>

      {/* Live rounds preview */}
      <section id="live-rounds" className="border-t border-gray-200 bg-white py-20">
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: "#E8C026" }}>Live rounds</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#0F1A2E" }}>
              See what&apos;s dropping
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Real rounds from real founders. Browse metrics, traction, and team — then request an intro in one click.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DealCard
              name="Arcana AI"
              stage="Pre-Seed"
              tagColor="#D4A017"
              tagBg="rgba(232,192,38,0.15)"
              description="AI-native legal research for solo practitioners"
              metrics={[
                { label: "MRR", value: "$42K" },
                { label: "Raising", value: "$1.2M" },
                { label: "Growth", value: "3.8x MoM" },
              ]}
              filled={72}
              follows={148}
              closing
            />
            <DealCard
              name="Vaultic"
              stage="Seed"
              tagColor="#2A9D5C"
              tagBg="rgba(80,200,120,0.15)"
              description="Supply chain risk intelligence for mid-market manufacturers"
              metrics={[
                { label: "ARR", value: "$118K" },
                { label: "Raising", value: "$2.5M" },
                { label: "Team", value: "2 ex-Google" },
              ]}
              filled={45}
              follows={94}
            />
            <DealCard
              name="Nudge Health"
              stage="Pre-Seed"
              tagColor="#D4A017"
              tagBg="rgba(232,192,38,0.15)"
              description="Behavioral nudges that cut patient no-show rates by 60%"
              metrics={[
                { label: "Clients", value: "14 clinics" },
                { label: "Raising", value: "$800K" },
                { label: "Impact", value: "-60% no-shows" },
              ]}
              filled={88}
              follows={211}
              hot
            />
          </div>
        </div>
      </section>

      {/* Why it's different */}
      <section className="border-t border-gray-200 bg-gray-50 py-20">
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: "#E8C026" }}>Why it&apos;s different</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#0F1A2E" }}>
              Fundraising is broken. We&apos;re fixing it.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Problems */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h3 className="font-bold mb-5" style={{ color: "#0F1A2E" }}>The current way</h3>
              <ul className="space-y-3">
                {[
                  "Months of cold outreach with no response",
                  "Outdated investor lists and broken intros",
                  "No signal on investor interest or timeline",
                  "Meeting coordination takes 2 weeks",
                  "Great companies invisible before network established",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 text-xs">
                      &times;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div
              className="rounded-xl p-8"
              style={{ border: "1px solid #7EDDA0", background: "rgba(80,200,120,0.04)" }}
            >
              <h3 className="font-bold mb-5" style={{ color: "#0F1A2E" }}>The RoundDrop way</h3>
              <ul className="space-y-3">
                {[
                  "Investor attention within 24 hours of drop",
                  "Verified, active investors browse weekly",
                  "Real-time follow counts show live interest",
                  "One-click calendar-native booking",
                  "Traction-first ranking system",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: "rgba(80,200,120,0.15)", color: "#2A9D5C" }}
                    >
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Join / Waitlist */}
      <section id="join" className="border-t border-gray-200 bg-white py-20">
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2" style={{ color: "#E8C026" }}>Join the waitlist</p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#0F1A2E" }}>
              Get early access
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Limited to 10 founders and 50 investors in the first cohort.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 max-w-3xl mx-auto">
            {/* Founder card */}
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-8 pt-0 overflow-hidden">
              <div
                className="h-1 -mx-8 mb-8"
                style={{ background: "linear-gradient(90deg, #E8C026, #50C878)" }}
              />
              <h3 className="text-lg font-bold mb-1" style={{ color: "#0F1A2E" }}>I&apos;m Raising</h3>
              <p className="text-sm text-gray-500 mb-6">Drop your round to verified investors</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Access to 50+ verified investors on day one",
                  "Featured placement in launch week drops",
                  "Real-time follow tracking and investor signals",
                  "Calendar-native intro scheduling",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5" style={{ color: "#50C878" }}>&#10003;</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Link
                  href="/sign-up"
                  className="block w-full rounded-lg py-3 text-sm font-semibold text-white text-center transition-all hover:brightness-105 hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg, #E8C026, #50C878)" }}
                >
                  Apply for First Drop &rarr;
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">
                Free to apply. No credit card. Limited spots in Q2 cohort.
              </p>
            </div>

            {/* Investor card */}
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-8 pt-0 overflow-hidden">
              <div
                className="h-1 -mx-8 mb-8"
                style={{ background: "linear-gradient(90deg, #2E6BAD, #5BA4E6)" }}
              />
              <h3 className="text-lg font-bold mb-1" style={{ color: "#0F1A2E" }}>I&apos;m Investing</h3>
              <p className="text-sm text-gray-500 mb-6">Get curated deal flow every week</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Weekly curated deal flow drops",
                  "Full metrics before requesting intro",
                  "One-click meeting booking",
                  "Trending sector signals and deal data",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5" style={{ color: "#2E6BAD" }}>&#10003;</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Link
                  href="/sign-up"
                  className="btn-investor-cta block w-full rounded-lg py-3 text-sm font-semibold text-white text-center transition-all hover:-translate-y-px"
                >
                  Get Early Investor Access &rarr;
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">
                Free to join. Verification required before round access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-gray-50 py-20">
        <div className="mx-auto max-w-[700px] px-5">
          <h2 className="text-2xl font-extrabold text-center mb-10" style={{ color: "#0F1A2E" }}>
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is RoundDrop free?",
                a: "Free for founders. Investors get free basic access with premium features available for a subscription.",
              },
              {
                q: "How is this different from AngelList or a pitch deck database?",
                a: "RoundDrop creates exclusivity and urgency. Rounds drop weekly like a launch, not a static listing. Think Product Hunt for fundraising.",
              },
              {
                q: "How are investors verified?",
                a: "We verify via fund pages, LinkedIn, and investment history before granting access to rounds.",
              },
              {
                q: "Can investors see my full deck just by browsing?",
                a: "Follows show interest. Accessing your full deck and requesting an intro requires explicit action — you stay in control.",
              },
              {
                q: "When does RoundDrop launch?",
                a: "Q2 2026. The first cohort is limited to 10 founders and 50 investors.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold mb-2" style={{ color: "#0F1A2E" }}>{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ borderTop: "1px solid #1B3A5C", background: "#0F1A2E" }}>
        <div className="mx-auto max-w-[1100px] px-5 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-white mb-3">
            <LogoMark size={20} id="footer" />
            Round<span style={{ color: "#7EDDA0" }}>Drop</span>
          </p>
          <p className="text-xs text-gray-400 mb-4">
            The launchpad for investment rounds.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-500 mb-6">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#join" className="hover:text-white transition-colors">
              Apply
            </a>
            <a href="mailto:hello@rounddrop.co" className="hover:text-white transition-colors">
              hello@rounddrop.co
            </a>
          </div>
          <p className="text-xs" style={{ color: "#374151" }}>
            &copy; 2026 RoundDrop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
