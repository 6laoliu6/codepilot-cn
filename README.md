# CodePilot CN

CodePilot CN 是一个面向中文开发者和初学者的 AI 项目生成助手。用户用中文描述想做的项目，系统生成需求拆解、技术栈建议、目录结构、开发步骤、README 草稿、部署建议和后续迭代建议。

当前版本是 MVP：不接数据库，不做登录，历史记录使用 localStorage，模型响应使用 mock provider。项目已经预留 Xiaomi MiMo provider，拿到 API Key 后可以继续接入真实模型。

## 功能

- 中文项目描述输入
- 一键生成结构化项目方案
- 输出需求拆解、推荐技术栈、目录结构、核心开发步骤
- 自动生成 README 草稿、部署建议、后续迭代建议
- 本地保存历史记录，支持查看和清空
- Provider 抽象层，包含 mock provider 和 MiMo provider 占位

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- localStorage

## 目录结构

```text
codepilot-cn/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ public/
│  └─ .gitkeep
├─ src/
│  ├─ components/
│  │  ├─ HistoryPanel.tsx
│  │  ├─ ProjectGenerator.tsx
│  │  └─ ProjectPlanView.tsx
│  └─ lib/
│     ├─ generator/
│     │  └─ mockGenerateProjectPlan.ts
│     ├─ providers/
│     │  ├─ index.ts
│     │  ├─ mimo.ts
│     │  ├─ mock.ts
│     │  └─ types.ts
│     ├─ storage.ts
│     └─ types.ts
├─ package.json
├─ .env.example
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000 查看项目。

## 可用脚本

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Provider 设计

Provider 接口位于 `src/lib/providers/types.ts`。

```ts
export type ProjectPlanProvider = {
  id: ProviderId;
  label: string;
  description: string;
  generate: (input: GenerateProjectPlanInput) => Promise<ProjectPlan>;
};
```

当前启用：

- `mockProvider`：调用 `mockGenerateProjectPlan`，用于本地演示。
- `mimoProvider`：占位实现，等待 Xiaomi MiMo API Key 和接口文档。

后续接入 MiMo 时，建议新增服务端 API Route，例如 `app/api/generate/route.ts`，在服务端读取 API Key 并调用 MiMo，前端不要直接暴露密钥。

## 历史记录

历史记录保存在浏览器 localStorage：

```text
codepilot-cn:history:v1
```

每条记录包含：

- 原始中文输入
- provider
- 生成时间
- 完整项目方案

当前最多保留 20 条。

## 部署建议

推荐使用 Vercel：

1. 将项目推送到 GitHub。
2. 在 Vercel 导入该仓库。
3. Framework Preset 选择 Next.js。
4. 部署完成后检查首页、生成表单和历史记录。

当前 mock 版本不需要环境变量。接入 MiMo 后，请参考 `.env.example`，在部署平台配置服务端环境变量。

## 后续迭代

- 接入 Xiaomi MiMo API。
- 增加导出 Markdown 功能。
- 增加项目类型模板。
- 增加历史记录搜索、收藏和恢复编辑。
- 增加 API 请求状态、错误重试和响应耗时展示。
- 需要跨设备同步时，再加入登录和数据库。
