import Link from 'next/link';

import { MarketingShell } from '@/components/marketing/marketing-shell';
import { getAllMarketingCases } from '@/data/marketing-cases-index';

function domain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

export function CaseStudyPage() {
  const cases = getAllMarketingCases();

  return (
    <MarketingShell activePage="case-study">
      <main>
        <section className="page-hero">
          <div className="wrap">
            <span className="eyebrow">Selected project examples</span>
            <h1>Real problems, stable solutions.</h1>
            <p>
              We help clients turn unclear technical goals into stable, scalable software systems.
              These selected examples show how our team applies senior engineering judgment, AI
              capability, cloud architecture, automation, and disciplined execution to real business
              problems.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <p className="why-note" style={{ margin: '0 auto 40px', maxWidth: '760px' }}>
              Verified, enterprise-style project examples across product engineering, AI, cloud, data,
              and automation. Each one covers the business problem, our technical role, the solution
              delivered, the verified results, and the workflow impact. Click any card to read the full
              story.
            </p>

            <div className="case-card-grid">
              {cases.map((c, i) => {
                const num = String(i + 1).padStart(2, '0');
                const tag = c.category.split(' / ')[0];
                return (
                  <Link key={c.id} className="case-card" href={`/case-study/${c.id}`}>
                    <div className="case-card-top">
                      <span className="case-num">{num}</span>
                      <span className="case-tag">{tag}</span>
                    </div>
                    <h3>{c.title}</h3>
                    <p className="summary">{c.description}</p>
                    <div className="pill-wrap">
                      <span className="pill">{domain(c.liveUrl)}</span>
                    </div>
                    <span className="case-link">View case study →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="cta">
            <h2>Have a problem like these?</h2>
            <p>
              Tell us your goal and we&apos;ll turn it into a structured plan — from idea to stable,
              scalable reality.
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
