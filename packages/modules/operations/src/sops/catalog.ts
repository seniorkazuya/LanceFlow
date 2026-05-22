export type SopLink = {
  id: string;
  title: string;
  href: string;
  description?: string;
};

export type SopCategory = {
  id: string;
  label: string;
  items: SopLink[];
};

/** Static SOP catalog (OPS-007) — replace hrefs with real docs when available. */
export const SOP_CATALOG: readonly SopCategory[] = [
  {
    id: 'onboarding',
    label: 'Onboarding',
    items: [
      {
        id: 'onboarding-welcome',
        title: 'New hire checklist',
        href: 'https://docs.lanceflow.app/sops/onboarding/checklist',
        description: 'First-week tasks for engineers and ops.',
      },
      {
        id: 'onboarding-access',
        title: 'Tool access & accounts',
        href: 'https://docs.lanceflow.app/sops/onboarding/access',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Project delivery',
    items: [
      {
        id: 'delivery-daily-report',
        title: 'Daily self-report',
        href: 'https://docs.lanceflow.app/sops/delivery/daily-report',
        description: 'How to submit hours and progress in LanceFlow.',
      },
      {
        id: 'delivery-project-states',
        title: 'Project lifecycle',
        href: 'https://docs.lanceflow.app/sops/delivery/project-lifecycle',
      },
      {
        id: 'delivery-assignment',
        title: 'Assignment & workload',
        href: 'https://docs.lanceflow.app/sops/delivery/assignment',
      },
    ],
  },
  {
    id: 'clients',
    label: 'Clients & risk',
    items: [
      {
        id: 'clients-crud',
        title: 'Client records',
        href: 'https://docs.lanceflow.app/sops/clients/records',
      },
      {
        id: 'clients-risk',
        title: 'Client risk score v0',
        href: 'https://docs.lanceflow.app/sops/clients/risk-v0',
      },
    ],
  },
  {
    id: 'hiring',
    label: 'Hiring',
    items: [
      {
        id: 'hiring-ceo-queue',
        title: 'CEO hiring queue',
        href: 'https://docs.lanceflow.app/sops/hiring/ceo-queue',
      },
    ],
  },
] as const;
