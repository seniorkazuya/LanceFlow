'use client';

import { useState } from 'react';

type TabId = 'clients' | 'employees';

export function WhyTabs() {
  const [tab, setTab] = useState<TabId>('clients');

  return (
    <>
      <div className="why-tabs">
        <button
          type="button"
          className={`tab${tab === 'clients' ? ' active' : ''}`}
          onClick={() => setTab('clients')}
        >
          For clients
        </button>
        <button
          type="button"
          className={`tab${tab === 'employees' ? ' active' : ''}`}
          onClick={() => setTab('employees')}
        >
          For talent / employees
        </button>
      </div>

      <div className={`why-panel${tab === 'clients' ? ' active' : ''}`} id="panel-clients">
        <p
          className="why-note"
          style={{ margin: '0 auto 26px', maxWidth: '680px' }}
        >
          Clients feel safe because our process removes uncertainty. We communicate clearly, expose
          risks early, document decisions, and keep delivery aligned with business priorities — work
          that&apos;s visible, structured, and measurable.
        </p>
        <div className="why-grid">
          {[
            ['Reliability', 'Commitments are tracked through clear milestones and deliverables.'],
            [
              'Professional execution',
              'Senior engineers manage architecture, implementation, testing, and deployment with care.',
            ],
            [
              'Controlled process',
              'Decisions, risks, and changes are handled through a clear, documented workflow.',
            ],
            [
              'Predictable results',
              'Clients know what is being built, why it matters, and when it is expected.',
            ],
            [
              'Disciplined workforce',
              'The team operates with ownership, responsiveness, and technical accountability.',
            ],
            ['Zero chaos', 'A calm, organized delivery experience from discovery to launch.'],
          ].map(([title, body]) => (
            <div key={title} className="why-card">
              <div className="num">✓</div>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`why-panel${tab === 'employees' ? ' active' : ''}`} id="panel-employees">
        <div className="why-grid">
          {[
            [
              '★',
              'Come as you are — strengths first',
              'This is a system of talents where people come with their strength, whatever it is. There is a place here for every kind of strength.',
            ],
            [
              '↗',
              'Invest your strength, earn the most',
              'Talents invest their strengths into meaningful work — and earn the most from doing what they do best.',
            ],
            [
              '✓',
              'Confidence, ensured',
              "The system is designed to ensure each person's confidence, so talent can show up and perform at their peak.",
            ],
            [
              '∿',
              'A seamless flow to grow',
              'From first match to delivery, everything moves with a seamless flow — so talent can invest, grow, and keep moving forward.',
            ],
          ].map(([num, title, body]) => (
            <div key={title} className="why-card">
              <div className="num">{num}</div>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
