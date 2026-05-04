"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { ProjectPlan } from "@/lib/types";

type ProjectPlanViewProps = {
  plan: ProjectPlan | null;
};

export function ProjectPlanView({ plan }: ProjectPlanViewProps) {
  const [copied, setCopied] = useState(false);

  if (!plan) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel xl:min-h-[720px]">
        <div className="flex min-h-[560px] items-center justify-center rounded border border-dashed border-zinc-300 bg-zinc-50">
          <div className="max-w-sm px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Preview</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">等待生成项目方案</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              输入一个中文项目想法后，这里会显示需求、技术栈、目录、步骤、README 和部署建议。
            </p>
          </div>
        </div>
      </section>
    );
  }

  async function handleCopyReadme() {
    if (!plan) {
      return;
    }

    await navigator.clipboard.writeText(plan.readmeDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Project Plan</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{plan.projectName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{plan.oneLine}</p>
        </div>
        <span className="w-fit rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          {plan.provider.toUpperCase()}
        </span>
      </div>

      <div className="divide-y divide-zinc-200">
        <PlanSection title="需求拆解">
          <NumberedList items={plan.requirements} />
        </PlanSection>

        <PlanSection title="推荐技术栈">
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.techStack.map((item) => (
              <div key={item.name} className="rounded border border-zinc-200 bg-zinc-50 p-4">
                <h4 className="text-sm font-semibold text-ink">{item.name}</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </PlanSection>

        <PlanSection title="项目目录结构">
          <pre className="quiet-scrollbar overflow-auto rounded border border-zinc-200 bg-[#101318] p-4 text-sm leading-6 text-zinc-100">
            {plan.directoryTree}
          </pre>
        </PlanSection>

        <PlanSection title="核心开发步骤">
          <NumberedList items={plan.developmentSteps} />
        </PlanSection>

        <PlanSection
          title="README 草稿"
          action={
            <button
              type="button"
              onClick={handleCopyReadme}
              className="rounded border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-mint hover:text-mint"
            >
              {copied ? "已复制" : "复制"}
            </button>
          }
        >
          <pre className="quiet-scrollbar max-h-80 overflow-auto rounded border border-zinc-200 bg-zinc-50 p-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
            {plan.readmeDraft}
          </pre>
        </PlanSection>

        <PlanSection title="部署建议">
          <BulletList items={plan.deploymentAdvice} />
        </PlanSection>

        <PlanSection title="后续迭代建议">
          <BulletList items={plan.nextIterations} />
        </PlanSection>
      </div>
    </section>
  );
}

function PlanSection({
  title,
  action,
  children
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-700">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-amber-100 text-xs font-bold text-amber-800">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-700">
          <span className="mt-2 h-2 w-2 shrink-0 rounded bg-mint" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
