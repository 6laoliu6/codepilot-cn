export type ProviderId = "mock" | "mimo";

export type GenerateProjectPlanInput = {
  prompt: string;
  provider: ProviderId;
};

export type GenerateProjectPlanRequest = {
  prompt: string;
};

export type TechStackItem = {
  name: string;
  reason: string;
};

export type ProjectPlan = {
  projectName: string;
  oneLine: string;
  requirements: string[];
  techStack: TechStackItem[];
  directoryTree: string;
  developmentSteps: string[];
  readmeDraft: string;
  deploymentAdvice: string[];
  nextIterations: string[];
  generatedAt: string;
  provider: ProviderId;
};

export type ProjectPlanHistoryItem = {
  id: string;
  prompt: string;
  createdAt: string;
  provider: ProviderId;
  plan: ProjectPlan;
};

export type GenerateProjectPlanResponse = {
  plan: ProjectPlan;
  provider: ProviderId;
  mode: "mock" | "mimo-ready";
  fallbackReason?: string;
};
