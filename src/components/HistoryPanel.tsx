"use client";

import type { ProjectPlanHistoryItem } from "@/lib/types";

type HistoryPanelProps = {
  history: ProjectPlanHistoryItem[];
  onSelect: (item: ProjectPlanHistoryItem) => void;
  onClear: () => void;
};

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint">History</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">历史记录</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className="rounded border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:border-coral hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
        >
          清空
        </button>
      </div>

      <div className="quiet-scrollbar mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="rounded border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm leading-6 text-zinc-500">
            暂无历史。生成后的项目方案会自动保存在本地浏览器。
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="w-full rounded border border-zinc-200 bg-white p-4 text-left transition hover:border-mint hover:bg-emerald-50"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{item.plan.projectName}</p>
                <span className="rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium uppercase text-zinc-500">
                  {item.provider}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{item.prompt}</p>
              <p className="mt-3 text-xs text-zinc-400">{formatDate(item.createdAt)}</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
