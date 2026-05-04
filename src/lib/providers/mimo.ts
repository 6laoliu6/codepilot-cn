import type { ProjectPlanProvider } from "@/lib/providers/types";

export const mimoProvider: ProjectPlanProvider = {
  id: "mimo",
  label: "Xiaomi MiMo",
  description: "预留真实模型 provider，拿到 API Key 后接入。",
  async generate() {
    throw new Error("MiMo provider 仍是占位实现。拿到 API Key 后，请在服务端 API Route 中接入真实请求。");
  }
};
