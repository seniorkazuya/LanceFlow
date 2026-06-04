import Image from 'next/image';
import Link from 'next/link';

import { ContactForm } from '@/components/marketing/contact-form';
import { HeroSlider } from '@/components/marketing/hero-slider';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { WhyTabs } from '@/components/marketing/why-tabs';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Precise matching',
    body: 'We match each project with people whose strengths fit the work — not just a résumé keyword.',
  },
  {
    icon: '🤝',
    title: 'Seamless collaboration',
    body: 'Clear scopes, transparent communication, and a workflow that keeps everyone aligned end to end.',
  },
  {
    icon: '🚀',
    title: 'Built to grow',
    body: 'From a single task to a full team, Lanceflows scales with your ambitions and your timeline.',
  },
] as const;

const STATS = [
  { value: '500+', label: 'Projects delivered' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '1,200+', label: 'Talents in flow' },
  { value: '30+', label: 'Industries served' },
] as const;

export function LandingPage() {
  return (
    <MarketingShell activePage="overview">
      <main id="top">
        <section className="hero">
          <div className="wrap">
            <HeroSlider />
            <div className="stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="stat">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="about-short">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">What we do</span>
              <h2>A simpler, more human way to work together</h2>
              <p>
                Lanceflows is the bridge between great companies and great people. We remove the
                friction of finding, hiring, and collaborating with talent — so projects move with
                confidence and flow.
              </p>
            </div>
            <div className="feature-grid">
              {FEATURES.map((item) => (
                <div key={item.title} className="card">
                  <div className="ic">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-media">
                <Image
                  src="/marketing/img/com_slogan.png"
                  alt="Lanceflows — where strong action meets seamless flow"
                  width={960}
                  height={720}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="about-text">
                <span className="eyebrow">About us · Who we are</span>
                <h2>One coordinated delivery system</h2>
                <p>
                  We are a full-service software engineering and AI delivery team made up of{' '}
                  <strong>senior engineers with 8+ years of experience</strong> across product
                  engineering, cloud architecture, automation, data systems, and applied artificial
                  intelligence. Our strength comes from combining each specialist&apos;s expertise into
                  one coordinated delivery system.
                </p>
                <p>
                  We don&apos;t simply implement a client&apos;s initial idea. We help discover the full
                  architecture, identify potential risks, design for stable scalability, prepare a
                  future-ready technical roadmap, and execute through clear milestones — for controlled,
                  predictable delivery without chaos.
                </p>
                <ul className="about-points">
                  <li>Senior-led, architecture-first delivery from idea to stable, scalable reality.</li>
                  <li>Transparent milestones, documented decisions, and predictable results.</li>
                  <li>Future-ready engineering built for scale, security, and growth.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section alt" id="why">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">Why Lanceflows</span>
              <h2>One platform, two kinds of winners</h2>
              <p>
                Lanceflows is built to create advantages on both sides — measurable value for clients,
                and real growth for the talented people who power the work.
              </p>
            </div>
            <WhyTabs />
          </div>
        </section>

        <section>
          <div className="cta">
            <h2>Ready to flow with us?</h2>
            <p>
              Whether you&apos;re hiring talent or bringing your strengths, Lanceflows makes the next
              step seamless.
            </p>
            <Link className="btn btn-ghost" href="/#contact">
              Contact us
            </Link>
          </div>
        </section>

        <section className="section alt" id="contact">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Contact us</span>
              <h2>Let&apos;s start the conversation</h2>
              <p>Tell us about your project or your strengths — we&apos;ll get back to you shortly.</p>
            </div>
            <div className="contact-grid">
              <ContactForm />
              <ul className="contact-info">
                <li>
                  <span className="ic">✉️</span>
                  <div>
                    <strong>Email</strong>
                    <small>hello@lanceflows.com</small>
                  </div>
                </li>
                <li>
                  <span className="ic">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <small>+1 (000) 000-0000</small>
                  </div>
                </li>
                <li>
                  <span className="ic">📍</span>
                  <div>
                    <strong>Office</strong>
                    <small>[Your company address]</small>
                  </div>
                </li>
                <li>
                  <span className="ic">⏰</span>
                  <div>
                    <strong>Hours</strong>
                    <small>Mon–Fri, 9:00–18:00</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <span id="signin" aria-hidden />
    </MarketingShell>
  );
}
