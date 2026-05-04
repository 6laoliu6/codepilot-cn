import type { ProjectPlan } from "@/lib/types";

export function buildProjectPlanMarkdown(plan: ProjectPlan, originalPrompt: string) {
  return `# ${plan.projectName}

生成时间：${formatDate(plan.generatedAt)}
模型模式：${plan.provider === "mimo" ? "MiMo Ready" : "Mock"}

## 原始需求

${originalPrompt || "未提供"}

## 需求拆解

${toNumberedList(plan.requirements)}

## 推荐技术栈

${plan.techStack.map((item) => `- **${item.name}**：${item.reason}`).join("\n")}

## 项目目录结构

\`\`\`text
${plan.directoryTree}
\`\`\`

## 核心开发步骤

${toNumberedList(plan.developmentSteps)}

## README 草稿

\`\`\`markdown
${plan.readmeDraft}
\`\`\`

## 部署建议

${toBulletList(plan.deploymentAdvice)}

## 后续迭代建议

${toBulletList(plan.nextIterations)}
`;
}

export function createMarkdownFileName(projectName: string) {
  const safeName = projectName
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 48);
  const date = new Date().toISOString().slice(0, 10);

  return `${safeName || "codepilot-cn-plan"}-${date}.md`;
}

function toNumberedList(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function toBulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
