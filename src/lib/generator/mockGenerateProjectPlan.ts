import type { GenerateProjectPlanInput, ProjectPlan } from "@/lib/types";

const keywordMap = [
  {
    words: ["学习", "课程", "教育", "刷题"],
    domain: "学习路径、内容推荐、进度跟踪"
  },
  {
    words: ["电商", "商品", "订单", "购物"],
    domain: "商品展示、购物流程、订单状态"
  },
  {
    words: ["团队", "协作", "任务", "项目管理"],
    domain: "任务流转、成员协作、状态看板"
  },
  {
    words: ["博客", "内容", "文章", "社区"],
    domain: "内容发布、标签筛选、阅读体验"
  },
  {
    words: ["AI", "智能", "生成", "助手"],
    domain: "提示词输入、模型响应、结果编辑"
  }
];

export function mockGenerateProjectPlan(input: GenerateProjectPlanInput): ProjectPlan {
  const normalizedPrompt = input.prompt.trim().replace(/\s+/g, " ");
  const projectName = inferProjectName(normalizedPrompt);
  const domain = inferDomain(normalizedPrompt);
  const slug = toSlug(projectName);
  const generatedAt = new Date().toISOString();

  return {
    projectName,
    oneLine: `围绕「${shorten(normalizedPrompt, 42)}」设计一个可快速演示、可继续扩展的 MVP。`,
    requirements: [
      `明确目标用户、主要场景和最小成功标准，先覆盖「${domain}」。`,
      "提供一个核心输入入口，让用户能快速创建或查询主要内容。",
      "展示结构化结果，包含摘要、关键状态和下一步动作。",
      "使用 localStorage 保存最近生成或创建的记录，刷新页面后仍可查看。",
      "先使用 mock 数据完成闭环，避免早期被外部接口阻塞。"
    ],
    techStack: [
      {
        name: "Next.js",
        reason: "适合快速搭建单页 MVP，后续也能平滑加入 API Route 和部署能力。"
      },
      {
        name: "TypeScript",
        reason: "让项目数据结构、生成结果和 provider 接口更可靠，减少初学者调试成本。"
      },
      {
        name: "Tailwind CSS",
        reason: "快速完成现代化界面，便于控制间距、响应式布局和截图观感。"
      },
      {
        name: "localStorage",
        reason: "当前不接数据库，先把历史记录留在浏览器本地，降低 MVP 复杂度。"
      }
    ],
    directoryTree: `${slug}/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ src/
│  ├─ components/
│  │  ├─ ProjectGenerator.tsx
│  │  ├─ ProjectPlanView.tsx
│  │  └─ HistoryPanel.tsx
│  └─ lib/
│     ├─ generator/
│     ├─ providers/
│     ├─ storage.ts
│     └─ types.ts
├─ public/
├─ README.md
└─ package.json`,
    developmentSteps: [
      "先实现首页布局、输入表单和结果展示区域。",
      "定义 ProjectPlan 类型，保证所有生成内容都有统一结构。",
      "实现 mockGenerateProjectPlan，让页面在没有真实模型时也能演示完整流程。",
      "抽象 ProjectPlanProvider，当前启用 mock provider，保留 MiMo provider 占位。",
      "把每次生成的结果写入 localStorage，并提供历史记录查看和清空。",
      "补充 README，写清楚本地运行、目录结构和后续接入真实模型的路径。"
    ],
    readmeDraft: buildReadmeDraft(projectName, normalizedPrompt),
    deploymentAdvice: [
      "优先使用 Vercel 部署 Next.js 项目，连接 GitHub 仓库后即可自动构建。",
      "MVP 阶段不需要数据库环境变量，只需要前端构建配置。",
      "接入 MiMo 后，把 API Key 放在服务端环境变量中，不要暴露到浏览器。",
      "上线前检查移动端布局、空输入状态和 localStorage 兼容性。"
    ],
    nextIterations: [
      "接入真实 Xiaomi MiMo API，并增加失败重试与响应时间提示。",
      "增加导出 Markdown / 复制 README 功能，方便用户直接创建仓库。",
      "加入更多项目模板，例如工具类、内容类、SaaS 类和学习类。",
      "增加历史记录搜索、收藏和一键恢复编辑。",
      "后续需要跨设备同步时，再引入登录和数据库。"
    ],
    generatedAt,
    provider: input.provider
  };
}

function inferProjectName(prompt: string) {
  const explicitName = prompt.match(/项目(?:名|名称)?(?:叫|为|是)?\s*([A-Za-z0-9\u4e00-\u9fa5 -]{2,28})/);

  if (explicitName?.[1]) {
    return cleanupName(explicitName[1]);
  }

  const productLike = prompt.match(/(?:做|开发|创建|搭建)一个\s*([A-Za-z0-9\u4e00-\u9fa5 -]{2,24}?)(?:，|。|,|\.|$)/);

  if (productLike?.[1]) {
    return cleanupName(productLike[1]);
  }

  return "MVP 项目";
}

function cleanupName(value: string) {
  return value
    .replace(/(的)?(网站|平台|系统|工具|应用|App|小程序).*$/i, "$2")
    .replace(/[，。,.;；：:]+$/g, "")
    .trim()
    .slice(0, 28);
}

function inferDomain(prompt: string) {
  const matched = keywordMap.find((item) => item.words.some((word) => prompt.includes(word)));

  return matched?.domain ?? "核心对象管理、状态展示、轻量交互";
}

function shorten(value: string, max: number) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max)}...`;
}

function toSlug(value: string) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return ascii || "mvp-project";
}

function buildReadmeDraft(projectName: string, prompt: string) {
  return `# ${projectName}

${shorten(prompt, 120)}

## 核心功能

- 项目核心信息输入
- 结构化结果展示
- 本地历史记录
- Mock 数据演示

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- localStorage

## 本地运行

\`\`\`bash
npm install
npm run dev
\`\`\`

打开 http://localhost:3000 查看项目。`;
}
