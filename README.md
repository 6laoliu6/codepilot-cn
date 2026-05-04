# CodePilot CN

CodePilot CN 是一个面向中文开发者和初学者的 AI 项目生成助手。用户用中文描述想做的项目，系统会生成需求拆解、技术栈建议、项目目录结构、核心开发步骤、README 草稿、部署建议和后续迭代建议。

当前版本定位为 MVP 原型，重点用于验证产品形态和展示 Xiaomi MiMo API 接入准备情况。项目已完成服务端生成入口、provider 抽象层、Mock fallback、MiMo provider 占位和 Markdown 导出能力。

## 项目当前状态

- 已完成 Next.js + TypeScript + Tailwind CSS 基础结构。
- 已完成首页、项目生成表单、生成结果展示和历史记录。
- 已新增 `/api/generate` 服务端 API Route。
- 前端不直接调用 provider，也不会接触模型 API Key。
- 未接数据库，历史记录暂存 localStorage。
- 未做登录，保持 MVP 复杂度可控。
- 当前默认使用 mock provider；配置 `MIMO_API_KEY` 后会走 MiMo provider 占位链路。
- 已支持导出 Markdown，方便保存项目方案和提交申请材料。

## 功能

- 中文项目描述输入
- 一键生成结构化项目方案
- 需求拆解、推荐技术栈、目录结构、核心开发步骤
- README 草稿、部署建议、后续迭代建议
- localStorage 历史记录查看和清空
- 服务端 provider 选择和 Mock fallback
- Xiaomi MiMo provider 占位
- 导出 Markdown 项目方案

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- localStorage

## 目录结构

```text
codepilot-cn/
├─ app/
│  ├─ api/
│  │  └─ generate/
│  │     └─ route.ts
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
│     ├─ exportMarkdown.ts
│     ├─ storage.ts
│     └─ types.ts
├─ .env.example
├─ package.json
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

## MiMo API 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

环境变量说明：

```text
MIMO_API_KEY=   # Xiaomi MiMo Token，必须只放在服务端环境变量中
MIMO_BASE_URL=  # MiMo API Base URL，拿到官方接入信息后填写
MIMO_MODEL=     # MiMo 模型名称，拿到官方接入信息后填写
```

如果没有配置 `MIMO_API_KEY`，服务端会自动 fallback 到 mock provider，保证 MVP 在无真实模型 Token 的情况下也能稳定演示。

## /api/generate 的作用

`/api/generate` 是项目生成的服务端入口。前端只提交中文项目描述，不直接调用 provider。

服务端流程：

1. 校验用户输入。
2. 检查 `MIMO_API_KEY`。
3. 如果已配置 Token，选择 MiMo provider 占位链路。
4. 如果未配置 Token，自动 fallback 到 mock provider。
5. 返回统一的 `ProjectPlan` 结构给前端展示、保存和导出。

这样做的好处是：API Key 不会暴露到浏览器，后续接入真实 MiMo API 时不需要重写前端。

## 为什么适合申请 MiMo Token

CodePilot CN 的场景直接面向中文开发者和初学者，适合验证大模型在中文项目规划、需求拆解、技术栈建议、工程步骤生成和文档生成中的能力。

这个 MVP 已经具备：

- 明确的中文开发者使用场景。
- 清晰的模型输入和结构化输出。
- 服务端 provider 抽象，方便接入 MiMo。
- Mock fallback，保证没有 Token 时仍可演示完整流程。
- Markdown 导出，方便把生成结果作为申请材料、项目证明或后续开发文档。
- 简洁现代的首页，适合截图提交申请。

## 后续接入 MiMo 路线图

1. 获取 Xiaomi MiMo Token、Base URL 和模型名称。
2. 在部署平台配置 `MIMO_API_KEY`、`MIMO_BASE_URL`、`MIMO_MODEL`。
3. 在 `src/lib/providers/mimo.ts` 中替换当前占位逻辑，发起真实服务端请求。
4. 设计稳定的 prompt 模板，要求 MiMo 输出可解析的 JSON。
5. 增加响应解析、错误重试和超时处理。
6. 增加生成质量评价，例如完整性、可执行性和 README 可用性。
7. 后续如需跨设备同步，再引入登录和数据库。

## 部署建议

推荐使用 Vercel：

1. 将项目推送到 GitHub。
2. 在 Vercel 导入该仓库。
3. Framework Preset 选择 Next.js。
4. 当前 mock 版本不需要环境变量。
5. 接入 MiMo 后，在 Vercel Environment Variables 中配置服务端环境变量。

## 历史记录

历史记录保存在浏览器 localStorage：

```text
codepilot-cn:history:v1
```

每条记录包含原始输入、provider、生成时间和完整项目方案。当前最多保留 20 条。
