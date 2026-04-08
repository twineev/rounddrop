import Link from "next/link";

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-green-500" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      Launching Q2 2026 &middot; Limited early access
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
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
        <h3 className="font-bold text-gray-900">{name}</h3>
        <div className="flex gap-1.5">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: tagBg, color: tagColor }}
          >
            {stage}
          </span>
          {closing && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              Closing Friday
            </span>
          )}
          {hot && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              Hot
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex gap-4 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-xs">
            <span className="text-gray-500">{m.label}</span>
            <p className="font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-green-500 transition-all"
            style={{ width: `${filled}%` }}
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 font-bold text-sm mb-4">
        {number}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
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
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">
              Round<span className="text-green-600">Drop</span>
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
            href="#join"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 hover:-translate-y-px"
          >
            Join the waitlist &rarr;
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white pt-16 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 text-center">
          <Badge />
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl" style={{ letterSpacing: "-1.5px" }}>
            Fundraising should feel like a{" "}
            <span className="text-green-600">launch</span>, not a cold call
            marathon.
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
              href="#join"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px"
            >
              Drop Your Round
            </Link>
            <Link
              href="#join"
              className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-green-300 hover:-translate-y-px"
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
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors underline underline-offset-4"
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
            <p className="text-sm font-semibold text-green-600 mb-2">How it works</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
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
            <p className="text-sm font-semibold text-green-600 mb-2">Live rounds</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
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
              tagColor="#92400e"
              tagBg="#fef3c7"
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
              tagColor="#15803d"
              tagBg="#dcfce7"
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
              tagColor="#92400e"
              tagBg="#fef3c7"
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
            <p className="text-sm font-semibold text-green-600 mb-2">Why it&apos;s different</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Fundraising is broken. We&apos;re fixing it.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Problems */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h3 className="font-bold text-gray-900 mb-5">The current way</h3>
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
            <div className="rounded-xl border border-green-200 bg-green-50/30 p-8">
              <h3 className="font-bold text-gray-900 mb-5">The RoundDrop way</h3>
              <ul className="space-y-3">
                {[
                  "Investor attention within 24 hours of drop",
                  "Verified, active investors browse weekly",
                  "Real-time follow counts show live interest",
                  "One-click calendar-native booking",
                  "Traction-first ranking system",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
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
            <p className="text-sm font-semibold text-green-600 mb-2">Join the waitlist</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Get early access
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Limited to 10 founders and 50 investors in the first cohort.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 max-w-3xl mx-auto">
            {/* Founder card */}
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-8 pt-0 overflow-hidden">
              <div className="h-1 bg-green-500 -mx-8 mb-8" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">I&apos;m Raising</h3>
              <p className="text-sm text-gray-500 mb-6">Drop your round to verified investors</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Access to 50+ verified investors on day one",
                  "Featured placement in launch week drops",
                  "Real-time follow tracking and investor signals",
                  "Calendar-native intro scheduling",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">&#10003;</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
                <button className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:-translate-y-px">
                  Apply for First Drop &rarr;
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">
                Free to apply. No credit card. Limited spots in Q2 cohort.
              </p>
            </div>

            {/* Investor card */}
            <div className="rounded-xl border-[1.5px] border-gray-200 bg-white p-8 pt-0 overflow-hidden">
              <div className="h-1 bg-purple-500 -mx-8 mb-8" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">I&apos;m Investing</h3>
              <p className="text-sm text-gray-500 mb-6">Get curated deal flow every week</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Weekly curated deal flow drops",
                  "Full metrics before requesting intro",
                  "One-click meeting booking",
                  "Trending sector signals and deal data",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 mt-0.5">&#10003;</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                />
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100">
                  <option value="">Investor type</option>
                  <option>Angel</option>
                  <option>Solo GP</option>
                  <option>VC firm</option>
                  <option>Family office</option>
                  <option>Corporate</option>
                </select>
                <button className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 hover:-translate-y-px">
                  Get Early Investor Access &rarr;
                </button>
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
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
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
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-10">
        <div className="mx-auto max-w-[1100px] px-5 text-center">
          <p className="text-sm font-bold text-white mb-3">
            Round<span className="text-green-400">Drop</span>
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
          <p className="text-xs text-gray-600">
            &copy; 2026 RoundDrop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
