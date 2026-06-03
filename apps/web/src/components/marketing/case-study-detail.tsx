import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MarketingShell } from '@/components/marketing/marketing-shell';
import { getAllMarketingCases, getMarketingCase } from '@/data/marketing-cases-index';
import type { WorkflowStep } from '@/data/marketing-case-types';

function domain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

function FlowStep({ step, index }: { step: WorkflowStep; index: number }) {
  return (
    <div className="flow-step">
      <span className="fnum">{index + 1}</span>
      <b>
        {step.name}
        {step.isBottleneck ? <span className="tag-bottleneck">Bottleneck</span> : null}
      </b>
      <div className="fmeta">
        {step.owner} · {step.duration}
      </div>
      <p>{step.notes}</p>
    </div>
  );
}

type CaseStudyDetailProps = {
  id: string;
};

export function CaseStudyDetail({ id }: CaseStudyDetailProps) {
  const cases = getAllMarketingCases();
  const index = cases.findIndex((c) => c.id === id);
  const c = getMarketingCase(id);

  if (!c || index < 0) {
    notFound();
  }

  const num = String(index + 1).padStart(2, '0');
  const author = `${c.testimonial.person}${c.testimonial.role ? `, ${c.testimonial.role}` : ''}${c.testimonial.company ? ` at ${c.testimonial.company}` : ''}`;

  return (
    <MarketingShell activePage="case-study">
      <main>
        <section className="page-hero">
          <div className="wrap">
            <Link className="back-link" href="/case-study">
              ← All case studies
            </Link>
            <span className="eyebrow">
              Case {num} · {c.category}
            </span>
            <h1>{c.title}</h1>
            <p>{c.description}</p>
            <div className="d-meta">
              <span className="d-chip">🛠 {c.ourRole}</span>
              <a className="d-chip" href={c.liveUrl} target="_blank" rel="noopener noreferrer">
                ↗ {domain(c.liveUrl)}
              </a>
              {c.serviceAreas.map((area) => (
                <span key={area} className="d-chip soft">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section case-detail">
          <div className="wrap">
            <div className="case-list">
              <article className="case">
                <div className="case-grid">
                  <div>
                    <div className="col-label">The challenge</div>
                    <p>{c.problem}</p>
                    <ul className="x-list">
                      {c.challenges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="col-label">Our solution</div>
                    <p>{c.solution}</p>
                    <ul className="check-list">
                      {c.keyImplementations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="section-label">Technology stack</div>
                <div className="pill-wrap">
                  {c.techStack.map((t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="section-label">Verified results &amp; achievements</div>
                <div className="metrics">
                  {c.resultMetrics.map((m) => (
                    <div key={m} className="metric">
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                <div className="section-label">Operational business value</div>
                <div className="outcomes">
                  <div className="outcome">
                    <b>Direct value added</b>
                    <span>{c.businessValue}</span>
                  </div>
                  <div className="outcome">
                    <b>Why it matters</b>
                    <span>{c.whyThisMatters}</span>
                  </div>
                </div>

                <div className="section-label">Workflow impact mapping</div>
                <div className="flow-wrap">
                  <div className="flow before">
                    <h4>⚠ Before — manual bottleneck flow</h4>
                    {c.beforeWorkflow.map((step, i) => (
                      <FlowStep key={step.name} step={step} index={i} />
                    ))}
                  </div>
                  <div className="flow after">
                    <h4>✓ After — automated optimized flow</h4>
                    {c.afterWorkflow.map((step, i) => (
                      <FlowStep key={step.name} step={step} index={i} />
                    ))}
                  </div>
                </div>

                <blockquote className="case-quote">
                  &ldquo;{c.testimonial.text}&rdquo;
                  <footer>— {author}</footer>
                </blockquote>
              </article>
            </div>
          </div>
        </section>

        <section>
          <div className="cta">
            <h2>Have a problem like this?</h2>
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
