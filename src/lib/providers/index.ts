import type { ProviderId } from "@/lib/types";
import { mimoProvider } from "@/lib/providers/mimo";
import { mockProvider } from "@/lib/providers/mock";

const providers = {
  mock: mockProvider,
  mimo: mimoProvider
};

export function getProjectPlanProvider(providerId: ProviderId) {
  return providers[providerId];
}

export const availableProviders = Object.values(providers);
