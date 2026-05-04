import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/providers/mock";
import { selectServerProjectPlanProvider } from "@/lib/providers";
import type { GenerateProjectPlanRequest, GenerateProjectPlanResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateProjectPlanRequest>;
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "请先输入项目描述。" }, { status: 400 });
    }

    const selection = selectServerProjectPlanProvider();

    try {
      const plan = await selection.provider.generate({
        prompt,
        provider: selection.providerId
      });
      const response: GenerateProjectPlanResponse = {
        plan,
        provider: selection.providerId,
        mode: selection.mode,
        fallbackReason: selection.fallbackReason
      };

      return NextResponse.json(response);
    } catch (providerError) {
      const fallbackPlan = await mockProvider.generate({
        prompt,
        provider: "mock"
      });
      const response: GenerateProjectPlanResponse = {
        plan: fallbackPlan,
        provider: "mock",
        mode: "mock",
        fallbackReason:
          providerError instanceof Error
            ? `MiMo provider is not ready: ${providerError.message}`
            : "MiMo provider is not ready. Falling back to mock provider."
      };

      return NextResponse.json(response);
    }
  } catch {
    return NextResponse.json({ error: "请求格式不正确，请稍后再试。" }, { status: 400 });
  }
}
