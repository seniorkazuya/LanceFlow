import Image from 'next/image';
import Link from 'next/link';

import { MarketingShell } from '@/components/marketing/marketing-shell';

const SERVICES = [
  { icon: '🧩', title: 'Product Engineering', body: 'Custom SaaS platforms, enterprise applications, portals, dashboards, and business systems.' },
  { icon: '🤖', title: 'AI & Automation', body: 'AI voice agents, RAG assistants, document intelligence, workflow agents, and computer vision.' },
  { icon: '☁️', title: 'Cloud & DevOps', body: 'Cloud architecture, CI/CD, monitoring, scalability, reliability, and cost-aware operations.' },
  { icon: '🔗', title: 'Data & Integration', body: 'API integrations, data extraction, web scraping, analytics pipelines, and CRM/ERP integration.' },
  { icon: '📐', title: 'Architecture & Consulting', body: 'Discovery, system design, risk analysis, roadmap planning, and engineering leadership.' },
  { icon: '🌱', title: 'Maintenance & Growth', body: 'Ongoing support, optimization, feature expansion, security improvements, and product evolution.' },
] as const;

const INDUSTRIES = [
  { img: 'fintech.svg', title: 'Fintech & Payments', body: 'Digital banking, transaction workflows, reconciliation, fraud monitoring, KYC/AML, portfolio dashboards.' },
  { img: 'healthcare.svg', title: 'Healthcare & Medical', body: 'HIPAA-conscious apps, telemedicine, patient portals, EHR/EMR integrations, clinical AI assistants.' },
  { img: 'realestate.svg', title: 'Real Estate / PropTech', body: 'Property management platforms, MLS/listing integrations, valuation tools, underwriting automation.' },
  { img: 'travel.svg', title: 'Travel & Hospitality', body: 'Booking systems, guest portals, ordering platforms, ticketing, revenue and occupancy analytics.' },
  { img: 'logistics.svg', title: 'Logistics & Supply Chain', body: 'Shipment tracking, route optimization, warehouse systems, freight automation, inventory analytics.' },
  { img: 'insurance.svg', title: 'Insurance / InsurTech', body: 'Claims workflows, underwriting automation, policy administration, risk modeling, self-service portals.' },
  { img: 'aerospace.svg', title: 'Aerospace & Defense', body: 'Simulation tools, training systems, drone/autonomous systems, secure dashboards, digital twins.' },
  { img: 'ai.svg', title: 'Vertical AI Applications', body: 'Voice agents, RAG assistants, workflow agents, document intelligence, computer vision.' },
] as const;

const TECH_STACK = [
  { title: 'AI & Data', pills: ['OpenAI', 'LangChain', 'RAG', 'Agentic AI', 'NLP', 'Computer Vision', 'Data Mining', 'Web Scraping'] },
  { title: 'Automation & Integration', pills: ['n8n', 'Zapier', 'Make.com', 'API Integration', 'Selenium', 'Beautiful Soup'] },
  { title: 'Frontend', pills: ['React', 'Next.js', 'MUI', 'Tailwind CSS', 'Styled Components'] },
  { title: 'Backend', pills: ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'FastAPI'] },
  { title: 'Databases & Tooling', pills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NPM', 'GitHub Actions', 'Docker'] },
  { title: 'Cloud & Infrastructure', pills: ['AWS', 'Azure', 'Cloudflare', 'CI/CD', 'Monitoring', 'Scalable Deployment'] },
] as const;

const DIFFERENTIATORS = [
  { title: 'Senior-led delivery', body: 'Projects guided by experienced engineers who understand architecture, risk, scale, and production realities.' },
  { title: 'Architecture before execution', body: 'We clarify the goal, blueprint, risk points, data flow, integrations, and milestones before building.' },
  { title: 'Seamless workflow', body: 'Clients experience one coordinated system rather than disconnected developers working in isolation.' },
  { title: 'Business-focused engineering', body: 'Every technical decision is tied to reliability, maintainability, cost, speed, and long-term growth.' },
  { title: 'Controlled process, zero chaos', body: 'Clear communication, documented progress, predictable delivery, and disciplined quality control.' },
  { title: 'Future-ready thinking', body: "We build for scaling, security, extensibility, and future product direction — not just today's features." },
] as const;

const PAIN_POINTS = [
  { num: '?', title: 'Unclear project direction', body: 'We convert vague ideas into a structured blueprint, roadmap, milestones, and execution plan.' },
  { num: '!', title: 'Poor technical decisions early on', body: 'We identify architecture risks before they become expensive rebuilds.' },
  { num: '⚑', title: 'Unreliable freelancers or scattered teams', body: 'We provide a coordinated senior team with ownership, communication, and accountability.' },
  { num: '⏱', title: 'Slow manual operations', body: 'We automate repetitive workflows and connect tools, APIs, CRMs, databases, and internal systems.' },
  { num: 'AI', title: 'Difficulty adopting AI', body: 'We design practical AI systems that fit real business workflows rather than experimental demos.' },
  { num: '↗', title: 'Scaling and maintenance problems', body: 'We build clean, maintainable systems designed for future features, traffic, and team growth.' },
] as const;

const DELIVERABLES = [
  { title: 'A production-ready product', body: 'Software, AI system, automation workflow, or platform aligned with the business goal.' },
  { title: 'Clear architecture & docs', body: 'Technical documentation explaining how the system works and how it can grow.' },
  { title: 'Clean, maintainable codebase', body: 'Organized repositories, version control, and a structured deployment setup.' },
  { title: 'Integrated systems', body: 'APIs, databases, cloud infrastructure, and user-facing interfaces per the project scope.' },
  { title: 'Testing & handover', body: 'Deployment support, performance checks, and clear handover guidance.' },
  { title: 'A future roadmap', body: 'A realistic plan for improvements, scalability, maintenance, and next-phase development.' },
] as const;

const ENGAGEMENTS = [
  { icon: '👥', title: 'Dedicated team', body: 'A dedicated development team for long-term product delivery.' },
  { icon: '🎯', title: 'Fixed-scope project', body: 'Fixed-scope delivery for clearly defined outcomes.' },
  { icon: '➕', title: 'Staff augmentation', body: 'Extra engineering capacity and specialist support for your team.' },
  { icon: '📐', title: 'Technical consulting', body: 'Architecture review and engineering leadership.' },
  { icon: '🛠️', title: 'Ongoing support', body: 'Maintenance, optimization, and continuous product support.' },
] as const;

export function ServicesPage() {
  return (
    <MarketingShell activePage="services">
      <main>
        <section className="page-hero">
          <div className="wrap">
            <span className="eyebrow">Software Engineering &amp; AI Services</span>
            <h1>From idea to stable, scalable reality.</h1>
            <p>
              A senior software engineering and applied AI team that turns client ideas into reliable
              products — through clear architecture, disciplined execution, transparent milestones, and
              long-term scalability planning.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">What we provide</span>
              <h2>Full-service delivery, one coordinated system</h2>
              <p>
                Six core capability areas that cover the full lifecycle — from discovery and design to
                delivery, maintenance, and growth.
              </p>
            </div>
            <div className="service-grid">
              {SERVICES.map((s) => (
                <div key={s.title} className="service-card">
                  <div className="ic">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">Industries &amp; use cases</span>
              <h2>Where we deliver</h2>
              <p>We support both industry-specific platforms and cross-industry automation systems.</p>
            </div>
            <div className="industry-grid">
              {INDUSTRIES.map((ind) => (
                <div key={ind.title} className="industry">
                  <Image
                    className="industry-img"
                    src={`/marketing/img/${ind.img}`}
                    alt={ind.title}
                    width={400}
                    height={240}
                  />
                  <div className="industry-body">
                    <b>{ind.title}</b>
                    <span>{ind.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">Technology stack</span>
              <h2>Modern, production-grade tools</h2>
              <p>A proven toolset spanning AI, automation, frontend, backend, data, and cloud.</p>
            </div>
            <div className="tech-stack">
              {TECH_STACK.map((row) => (
                <div key={row.title} className="tech-row">
                  <h4>{row.title}</h4>
                  <div className="pill-wrap">
                    {row.pills.map((pill) => (
                      <span key={pill} className="pill">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">What makes us different</span>
              <h2>Senior-led, architecture-first, zero chaos</h2>
              <p>Every project is guided by experienced engineers and a calm, seamless workflow.</p>
            </div>
            <div className="diff-grid">
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title} className="diff">
                  <span className="check">✓</span>
                  <div>
                    <b>{d.title}</b>
                    <span>{d.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">Pain points we solve</span>
              <h2>From uncertainty to controlled delivery</h2>
              <p>The common problems clients bring us — and how our process resolves them.</p>
            </div>
            <div className="why-grid">
              {PAIN_POINTS.map((p) => (
                <div key={p.title} className="why-card">
                  <div className="num">{p.num}</div>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">What you receive</span>
              <h2>Delivered at the end of every engagement</h2>
              <p>Concrete, production-ready outcomes — not just code.</p>
            </div>
            <div className="diff-grid">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="diff">
                  <span className="check">✓</span>
                  <div>
                    <b>{d.title}</b>
                    <span>{d.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">Engagement models</span>
              <h2>Ways to work with us</h2>
              <p>Flexible models to match your scope, capacity, and stage of growth.</p>
            </div>
            <div className="service-grid">
              {ENGAGEMENTS.map((e) => (
                <div key={e.title} className="service-card">
                  <div className="ic">{e.icon}</div>
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              ))}
              <div className="service-card">
                <div className="ic">🤝</div>
                <h3>Not sure yet?</h3>
                <p>
                  Tell us your goal and we&apos;ll recommend the right model.{' '}
                  <Link href="/#contact" style={{ color: 'var(--brand)', fontWeight: 700 }}>
                    Talk to us →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="cta">
            <h2>Move from idea to reality — without the chaos.</h2>
            <p>
              Senior engineering judgment, practical AI expertise, disciplined execution, and a seamless
              delivery system that protects your project from confusion and risk.
            </p>
            <Link className="btn btn-ghost" href="/#contact">
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
