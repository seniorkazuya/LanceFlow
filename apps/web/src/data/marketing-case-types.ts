export type WorkflowStep = {
  name: string;
  owner: string;
  duration: string;
  notes: string;
  isBottleneck: boolean;
};

export type MarketingCase = {
  id: string;
  title: string;
  liveUrl: string;
  category: string;
  serviceAreas: string[];
  description: string;
  problem: string;
  challenges: string[];
  solution: string;
  keyImplementations: string[];
  techStack: string[];
  ourRole: string;
  resultMetrics: string[];
  businessValue: string;
  whyThisMatters: string;
  testimonial: {
    person: string;
    role: string;
    company: string;
    text: string;
  };
  beforeWorkflow: WorkflowStep[];
  afterWorkflow: WorkflowStep[];
};
