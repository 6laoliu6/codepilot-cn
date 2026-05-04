import type { ProjectPlan, ProjectPlanHistoryItem, ProviderId } from "@/lib/types";

const STORAGE_KEY = "codepilot-cn:history:v1";
const MAX_HISTORY = 20;

type CreateHistoryItemInput = {
  prompt: string;
  provider: ProviderId;
  plan: ProjectPlan;
};

export function createHistoryItem(input: CreateHistoryItemInput): ProjectPlanHistoryItem {
  const createdAt = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    prompt: input.prompt,
    provider: input.provider,
    plan: input.plan,
    createdAt
  };
}

export function readProjectHistory(): ProjectPlanHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveProjectHistoryItem(item: ProjectPlanHistoryItem) {
  const nextHistory = [item, ...readProjectHistory()].slice(0, MAX_HISTORY);
  writeProjectHistory(nextHistory);

  return nextHistory;
}

export function clearProjectHistory() {
  writeProjectHistory([]);
}

function writeProjectHistory(history: ProjectPlanHistoryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
