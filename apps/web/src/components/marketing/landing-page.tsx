import { BrandHighlight, Button, GlassCard, SectionLabel } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';

import { LandingNav } from '@/components/marketing/landing-nav';

const BRAND_ICON = '/brand/lanceflow-icon.png';
const BRAND_LOCKUP = '/brand/lanceflow-lockup.png';

const pillars = [
  {
    title: 'Rules, not chaos',
    body: 'Leadership judgment encoded as versioned scores and policies — not ad-hoc marketplace noise.',
  },
  {
    title: 'Role-aware by design',
    body: 'CEO and Ops see exceptions; engineers, callers, and bidders stay in their lane.',
  },
  {
    title: 'Audited automation',
    body: 'Every automated decision stores inputs, formula version, and override trail.',
  },
] as const;

const trustItems = ['RBAC enforced', 'Role-aware shell', 'Rules + scores'] as const;

const promises = [
  {
    audience: 'Employees & talent',
    items: [
      'Protection and clarity in how work is assigned',
      'Stable opportunity through structured pipelines',
      'Fair systems with transparent performance rewards',
    ],
  },
  {
    audience: 'Clients',
    items: [
      'Reliability and controlled delivery process',
      'Predictable outcomes from disciplined ops',
      'Risk-aware engagement — not marketplace chaos',
    ],
  },
] as const;

const howItWorks = [
  {
    step: '01',
    title: 'Encode judgment',
    body: 'Leadership policies become versioned scores, thresholds, and rules — not ad-hoc decisions.',
  },
  {
    step: '02',
    title: 'Route by role',
    body: 'Callers, bidders, engineers, and ops each see the surfaces they need — CEO sees exceptions.',
  },
  {
    step: '03',
    title: 'Automate with audit',
    body: 'Auto-approve when safe; every decision stores inputs, formula version, and overrides.',
  },
  {
    step: '04',
    title: 'Measure & improve',
    body: 'KPIs, hiring scores (THS/RS), and control-center aggregates close the loop.',
  },
] as const;

const orgRoles = [
  { role: 'Caller', focus: 'Client contact, conversion, communication quality' },
  { role: 'Bidder', focus: 'Proposals, scope, pricing, deal closure' },
  { role: 'Engineer', focus: 'Delivery, quality, speed — focused shell' },
  { role: 'Ops Manager', focus: 'Daily workflow, assignment, KPI reporting' },
  { role: 'CEO', focus: 'Strategy, exceptions, high-value deals (<5% ops)' },
] as const;

export function LandingPage() {
  return (
    <div className="lf-page-grid lf-mesh-bg relative min-h-screen">
      <LandingNav />

      <main className="relative">
        {/* Hero — centered copy like screenpi.pe/team */}
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 text-center lg:px-8 lg:pt-28">
          <p className="lf-eyebrow mb-8">lanceflow</p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Where strong action meets{' '}
            <span className="lf-gradient-text">seamless flow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The operating layer for digital professionals — encode judgment as rules and scores,
            route work by role, and automate with an audit trail. Not a chaotic marketplace.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth/signin">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                View dashboard <span aria-hidden>→</span>
              </Link>
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Brand showcase — single glass panel (Screenpipe "sample output" pattern) */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <GlassCard variant="strong" className="overflow-hidden p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.06] pb-6 md:flex-row md:items-end md:justify-between">
              <div className="text-left">
                <SectionLabel>brand identity</SectionLabel>
                <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                  Official LanceFlow marks
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  Monogram and full lockup — navy and teal from the product identity, highlighted for
                  app shell, marketing, and client-facing surfaces.
                </p>
              </div>
              <span className="lf-eyebrow w-fit text-[0.65rem]">highlighted in UI</span>
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <BrandHighlight glow="strong" label="Monogram (app icon)">
                <Image
                  src={BRAND_ICON}
                  alt="LanceFlow icon — L and F monogram"
                  width={280}
                  height={280}
                  className="relative z-10 mx-auto h-auto w-full max-w-[200px] object-contain md:max-w-[240px]"
                  priority
                />
              </BrandHighlight>
              <BrandHighlight glow="strong" label="Full lockup + tagline">
                <Image
                  src={BRAND_LOCKUP}
                  alt="LanceFlow — where strong action meets seamless flow"
                  width={400}
                  height={320}
                  className="relative z-10 mx-auto h-auto w-full max-w-[300px] object-contain md:max-w-[340px]"
                  priority
                />
              </BrandHighlight>
            </div>
          </GlassCard>
        </section>

        {/* Foundation narrative — employee & client promises */}
        <section className="lf-divider mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <SectionLabel>foundation</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              A performance ecosystem — not a chaotic marketplace.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              <strong className="font-medium text-foreground">Lance</strong> — courage and excellence in
              action. <strong className="font-medium text-foreground">Flow</strong> — systems that remove
              uncertainty. Strong individuals plus seamless operations deliver predictable, high-quality
              outcomes.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {promises.map((group) => (
              <GlassCard key={group.audience} className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-foreground">{group.audience}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="max-w-2xl">
            <SectionLabel>how it works</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              From rules to measurable flow.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <GlassCard key={item.step} className="p-6">
                <span className="font-mono text-xs text-primary">{item.step}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Organizational model */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
          <GlassCard variant="strong" className="overflow-hidden p-6 md:p-10">
            <SectionLabel>organizational model</SectionLabel>
            <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
              Role-aware from day one.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every role has a primary function in the operating layer. Cross-role growth paths (e.g.
              Caller → Bidder) are scored — not guessed.
            </p>
            <ul className="mt-8 divide-y divide-white/[0.06]">
              {orgRoles.map((row) => (
                <li
                  key={row.role}
                  className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="text-sm font-semibold text-foreground">{row.role}</span>
                  <span className="text-sm text-muted-foreground sm:text-right">{row.focus}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* Pillars — Screenpipe "three things" section rhythm */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <SectionLabel>three pillars</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Built for operational clarity.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Dark glass surfaces, crisp hierarchy, and teal accents — the same modern enterprise
              rhythm as workflow intelligence products, tuned for LanceFlow&apos;s performance model.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <GlassCard
                key={item.title}
                className="flex flex-col p-6 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA — full-width band */}
        <section className="lf-divider mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <GlassCard variant="strong" className="p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
            <div className="flex items-center gap-5">
              <div className="lf-brand-glow-strong shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <Image
                  src={BRAND_ICON}
                  alt=""
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain md:h-14 md:w-14"
                />
              </div>
              <div className="text-left">
                <SectionLabel>get started</SectionLabel>
                <p className="mt-2 text-lg font-semibold tracking-tight md:text-xl">
                  Ready to flow?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in and explore the role-aware app shell on staging or local.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="mt-6 w-full shrink-0 md:mt-0 md:w-auto">
              <Link href="/auth/signin">Sign in to LanceFlow</Link>
            </Button>
          </GlassCard>
        </section>
      </main>

      <footer className="lf-divider py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <Image src={BRAND_ICON} alt="" width={22} height={22} className="h-5 w-5 opacity-70" />
            <span className="font-medium text-foreground/80">LanceFlow</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs tracking-wide">where strong action meets seamless flow</p>
            {process.env.VERCEL_GIT_COMMIT_SHA ? (
              <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground/60">
                staging · {process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)}
              </p>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
