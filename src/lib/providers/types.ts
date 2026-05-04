import type { GenerateProjectPlanInput, ProjectPlan, ProviderId } from "@/lib/types";

export type ProjectPlanProvider = {
  id: ProviderId;
  label: string;
  description: string;
  generate: (input: GenerateProjectPlanInput) => Promise<ProjectPlan>;
};
