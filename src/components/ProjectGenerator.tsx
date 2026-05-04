"use client";

import { FormEvent, useEffect, useState } from "react";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ProjectPlanView } from "@/components/ProjectPlanView";
import { clearProjectHistory, createHistoryItem, readProjectHistory, saveProjectHistoryItem } from "@/lib/storage";
import type { GenerateProjectPlanResponse, ProjectPlan, ProjectPlanHistoryItem } from "@/lib/types";

const samplePrompts = [
  "做一个中文编程学习路线生成器，面向刚入门的前端学习者。",
  "开发一个轻量级团队任务看板，支持创建任务、状态流转和本地历史。",
  "做一个 AI 简历优化助手，用户粘贴简历后生成修改建议和岗位匹配分析。"
];

export function ProjectGenerator() {
  const [prompt, setPrompt] = useState("");
  const [activePrompt, setActivePrompt] = useState("");
  const [modelMode, setModelMode] = useState("Mock / MiMo Ready");
  const [apiStatus, setApiStatus] = useState("服务端占位已完成");
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [history, setHistory] = useState<ProjectPlanHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setHistory(readProjectHistory());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("先写一句项目想法。");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: trimmedPrompt })
      });
      const data = (await response.json()) as Partial<GenerateProjectPlanResponse> & { error?: string };

      if (!response.ok || !data.plan) {
        throw new Error(data.error || "生成失败，请稍后再试。");
      }

      const nextPlan = data.plan;
      const historyItem = createHistoryItem({
        prompt: trimmedPrompt,
        provider: nextPlan.provider,
        plan: nextPlan
      });

      setPlan(nextPlan);
      setActivePrompt(trimmedPrompt);
      setModelMode(data.mode === "mimo-ready" ? "MiMo Ready" : "Mock / MiMo Ready");
      setApiStatus(data.fallbackReason ? "Mock fallback 已启用" : "服务端占位已完成");
      setHistory(saveProjectHistoryItem(historyItem));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "生成失败，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectHistory(item: ProjectPlanHistoryItem) {
    setPrompt(item.prompt);
    setActivePrompt(item.prompt);
    setPlan(item.plan);
    setModelMode(item.provider === "mimo" ? "MiMo Ready" : "Mock / MiMo Ready");
    setApiStatus(item.provider === "mimo" ? "MiMo provider 占位链路" : "Mock fallback 已启用");
    setError("");
  }

  function handleClearHistory() {
    clearProjectHistory();
    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-mint">
              MVP Builder
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">CodePilot CN</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              面向中文开发者和初学者的 AI 项目生成助手。用中文描述想法，快速得到一份能落地的 MVP 项目计划。
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              当前版本为 MVP 原型，已预留 Xiaomi MiMo API 接入能力。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 lg:min-w-[560px]">
            <Stat label="当前模型模式" value={modelMode} tone="mint" />
            <Stat label="存储方式" value="localStorage" tone="sun" />
            <Stat label="API 接入状态" value={apiStatus} tone="coral" />
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.45fr)_320px]">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="border-b border-zinc-200 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Input</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">项目生成表单</h2>
            </div>

            <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-semibold text-zinc-800">中文项目描述</span>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={9}
                  className="mt-3 w-full resize-none rounded border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-zinc-400 focus:border-mint focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="例如：我想做一个面向中文初学者的 AI 编程学习路线生成器..."
                />
              </label>

              <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-800">服务端生成链路</p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  前端提交到 /api/generate，由服务端根据 MIMO_API_KEY 自动选择 MiMo 或 fallback 到 Mock。
                </p>
              </div>

              {error ? <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:bg-zinc-400"
              >
                {isGenerating ? "生成中..." : "生成项目方案"}
              </button>
            </form>

            <div className="mt-6 border-t border-zinc-200 pt-5">
              <p className="text-sm font-semibold text-zinc-800">示例输入</p>
              <div className="mt-3 space-y-2">
                {samplePrompts.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-left text-sm leading-6 text-zinc-600 transition hover:border-mint hover:bg-emerald-50 hover:text-ink"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <ProjectPlanView plan={plan} prompt={activePrompt || prompt} />

          <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "mint" | "sun" | "coral" }) {
  const toneClass = {
    mint: "border-emerald-200 bg-emerald-50 text-emerald-700",
    sun: "border-amber-200 bg-amber-50 text-amber-700",
    coral: "border-red-200 bg-red-50 text-red-700"
  }[tone];

  return (
    <div className={`min-w-0 rounded border px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 break-words text-base font-semibold">{value}</p>
    </div>
  );
}
