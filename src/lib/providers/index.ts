import type { GenerateProjectPlanResponse, ProviderId } from "@/lib/types";
import { mimoProvider } from "@/lib/providers/mimo";
import { mockProvider } from "@/lib/providers/mock";
import type { ProjectPlanProvider } from "@/lib/providers/types";

const providers = {
  mock: mockProvider,
  mimo: mimoProvider
};

export function getProjectPlanProvider(providerId: ProviderId) {
  return providers[providerId];
}

export const availableProviders = Object.values(providers);

type ServerProviderSelection = {
  provider: ProjectPlanProvider;
  providerId: ProviderId;
  mode: GenerateProjectPlanResponse["mode"];
  fallbackReason?: string;
};

export function selectServerProjectPlanProvider(): ServerProviderSelection {
  const hasMimoApiKey = Boolean(process.env.MIMO_API_KEY?.trim());

  if (hasMimoApiKey) {
    return {
      provider: mimoProvider,
      providerId: "mimo",
      mode: "mimo-ready"
    };
  }

  return {
    provider: mockProvider,
    providerId: "mock",
    mode: "mock",
    fallbackReason: "MIMO_API_KEY is not configured. Falling back to mock provider."
  };
}
