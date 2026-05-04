import { mockGenerateProjectPlan } from "@/lib/generator/mockGenerateProjectPlan";
import type { ProjectPlanProvider } from "@/lib/providers/types";

type MimoProviderConfig = {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  isConfigured: boolean;
};

export function readMimoProviderConfig(): MimoProviderConfig {
  const apiKey = process.env.MIMO_API_KEY?.trim();
  const baseUrl = process.env.MIMO_BASE_URL?.trim();
  const model = process.env.MIMO_MODEL?.trim() || "mimo-orbit-placeholder";

  return {
    apiKey,
    baseUrl,
    model,
    isConfigured: Boolean(apiKey)
  };
}

export const mimoProvider: ProjectPlanProvider = {
  id: "mimo",
  label: "Xiaomi MiMo",
  description: "预留真实模型 provider，拿到 Xiaomi MiMo Token 后在服务端正式接入。",
  async generate(input) {
    const config = readMimoProviderConfig();

    if (!config.isConfigured) {
      throw new Error("MIMO_API_KEY is not configured.");
    }

    // TODO: 拿到 MiMo Token 后正式接入 Xiaomi MiMo API。
    // 这里会使用 MIMO_API_KEY、MIMO_BASE_URL、MIMO_MODEL 发起服务端请求，
    // 并把 MiMo 的自然语言响应解析成 ProjectPlan 结构。
    const placeholderPlan = mockGenerateProjectPlan({
      prompt: input.prompt,
      provider: "mimo"
    });

    return {
      ...placeholderPlan,
      oneLine: `${placeholderPlan.oneLine} 当前已走服务端 MiMo provider 占位链路。`,
      deploymentAdvice: [
        ...placeholderPlan.deploymentAdvice,
        "MiMo 正式接入时，只在服务端读取 MIMO_API_KEY，不把密钥暴露到前端。"
      ],
      nextIterations: [
        `TODO: 使用模型 ${config.model} 和服务端 MiMo 配置完成真实 API 调用。`,
        ...placeholderPlan.nextIterations
      ]
    };
  }
};
