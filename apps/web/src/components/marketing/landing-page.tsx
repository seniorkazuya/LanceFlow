import { BrandHighlight, Button, GlassCard } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';

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

export function LandingPage() {
  return (
    <div className="lf-mesh-bg min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={BRAND_ICON}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <span className="text-sm font-semibold tracking-tight">LanceFlow</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/auth/signin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Open app</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — brand icons highlighted (Screenpipe-style modern landing) */}
        <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                Structured performance ecosystem
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Where{' '}
                <span className="lf-gradient-text">strong action</span> meets seamless flow.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                LanceFlow is the operating layer for digital professionals — rules, scores, and
                role-aware workflows instead of a chaotic freelance marketplace.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                  <Link href="/auth/signin">Get started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8 xl:grid-cols-2">
              <BrandHighlight glow="strong" label="Brand mark" className="sm:col-span-2 lg:col-span-1">
                <Image
                  src={BRAND_ICON}
                  alt="LanceFlow icon — L and F monogram"
                  width={280}
                  height={280}
                  className="relative z-10 mx-auto h-auto w-full max-w-[220px] object-contain drop-shadow-2xl md:max-w-[260px]"
                  priority
                />
              </BrandHighlight>
              <BrandHighlight glow="strong" label="Full lockup" className="sm:col-span-2 lg:col-span-1">
                <Image
                  src={BRAND_LOCKUP}
                  alt="LanceFlow — where strong action meets seamless flow"
                  width={400}
                  height={320}
                  className="relative z-10 mx-auto h-auto w-full max-w-[320px] object-contain"
                  priority
                />
              </BrandHighlight>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Built for <span className="lf-gradient-text">operational clarity</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Inspired by modern workflow intelligence UIs — dark glass surfaces, teal accents, and
              focus on what your team actually does.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <GlassCard key={item.title} className="p-6 transition-colors hover:border-primary/30">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <GlassCard variant="strong" className="lf-mesh-bg overflow-hidden p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="lf-brand-glow rounded-xl bg-brand-navy/50 p-3">
                  <Image
                    src={BRAND_ICON}
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <div>
                  <p className="text-xl font-semibold">Ready to flow?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in with your environment credentials and explore the role-aware shell.
                  </p>
                </div>
              </div>
              <Button asChild size="lg">
                <Link href="/auth/signin">Sign in to LanceFlow</Link>
              </Button>
            </div>
          </GlassCard>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Image src={BRAND_ICON} alt="" width={24} height={24} className="h-6 w-6 opacity-80" />
            <span>LanceFlow</span>
          </div>
          <p className="text-center italic md:text-right">
            where strong action meets seamless flow
          </p>
        </div>
      </footer>
    </div>
  );
}
