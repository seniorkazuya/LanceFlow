import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listSopCategories } from '@lanceflow/operations';
import { GlassCard, PageHeader } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function SopsPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.sopsRead)) {
    redirect('/dashboard');
  }

  const categories = listSopCategories();

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Standard operating procedures"
        description="Process docs by category. Links open external references (placeholder URLs until docs are published)."
      />

      <div className="space-y-6">
        {categories.map((category) => (
          <GlassCard key={category.id} className="p-5">
            <h2 className="text-sm font-semibold text-foreground">{category.label}</h2>
            <ul className="mt-3 divide-y divide-border">
              {category.items.map((item) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {item.title}
                  </a>
                  {item.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </ShellPage>
  );
}
