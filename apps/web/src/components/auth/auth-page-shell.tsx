import type { ReactNode } from 'react';

export function AuthPageShell({
  label,
  title,
  description,
  children,
  narrow,
}: {
  label: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className="auth">
      <div className="wrap auth-wrap">
        <div className={`auth-card${narrow ? ' auth-card--signin' : ''}`}>
          <div className="auth-head">
            <span className="eyebrow">{label}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
