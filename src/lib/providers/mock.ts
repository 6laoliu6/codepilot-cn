import { mockGenerateProjectPlan } from "@/lib/generator/mockGenerateProjectPlan";
import type { ProjectPlanProvider } from "@/lib/providers/types";

export const mockProvider: ProjectPlanProvider = {
  id: "mock",
  label: "Mock Provider",
  description: "本地模拟响应，适合 MVP 演示和截图。",
  async generate(input) {
    await new Promise((resolve) => setTimeout(resolve, 450));

    return mockGenerateProjectPlan(input);
  }
};
