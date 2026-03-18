Career AI Impact – 架构说明（MVP v0.1）
目标：在 3–7 天内做出一个可 demo / 可截图 / 可收费的职业 AI 冲击诊断 MVP，支持「免费简报 + 付费 PDF 详报」，后续可扩展为「和报告聊天」「自动抓 JD」。
​

1. 路由与页面结构
1.1 主页面：/career-check
功能：

职业搜索/选择。

展示「免费职业 AI 冲击简报」。

引导用户购买「付费 PDF 详报」。

UI 结构（最少要求）：

顶部：

标题：Career AI Impact Checker

副标题：简要说明用途。

主体：

职业选择区：

搜索框 + 下拉列表（数据来自后端职业列表或本地 JSON）。

简报区（选定职业后显示）：

职业名称、AI 冲击等级（低/中/高 + 分数）。

2–3 条关键风险点。

2–3 条关键机会/转型方向。

CTA：

按钮「生成完整职业 AI 报告（PDF）」。

行为：

选择职业 → 调用 GET /api/career-impact/summary?job_id=... → 渲染简报卡片。

点击按钮 → 调用 POST /api/career-impact/full → 拿到 reportId → router.push(/reports/[reportId])。

1.2 报告查看页：/reports/[id]
功能：

在线查看 PDF 职业报告。

用户可以下载 PDF。

UI 结构：

标题区：

报告标题（职业名 + 时间）。

主体：

PDF viewer（优先使用 EmbedPDF 或 <embed>）。

可选：

报告元数据（生成时间、职业代码等）。

行为：

从 URL 解析 id。

调用 GET /api/reports/[id] 获取：

pdfUrl（必需）

title, createdAt, jobId 等元数据。

用 pdfUrl 在页面中嵌入 PDF。

2. API 设计
所有 API 使用 Next.js App Router 路由：app/api/**/route.ts。
​

2.1 免费简报接口：GET /api/career-impact/summary
用途：根据 job_id 返回一份简短的 AI 冲击摘要，用于 /career-check 页面的免费卡片。

请求：

Query 参数：job_id（对齐 jobs 数据中的职业 ID 或 BLS code）。

响应示例：

json
{
  "jobId": "15-1252",
  "title": "Software Developers",
  "aiExposureLevel": "high",
  "aiExposureScore": 8.2,
  "keyRisks": [
    "重复性编码和样板代码高度可自动化",
    "文档与测试生成大量由 AI 处理"
  ],
  "keyOpportunities": [
    "设计与协调 AI 驱动的系统架构",
    "与产品和业务紧密协作定义问题"
  ]
}
要求：

数据必须基于 ../jobs-master 中的数据处理结果（见第 3 部分），不允许在 handler 里写死「魔法数」。
​

2.2 付费详报接口：POST /api/career-impact/full
用途：在用户点击「生成完整报告」后生成职业详报（结构化 JSON + PDF），并返回报告 ID。

请求：

Body（初期可以只用 jobId）：

json
{
  "jobId": "15-1252",
  "userAnswers": {
    "experienceYears": 3,
    "canCode": true
  }
}
响应示例（MVP 可以先用 mock）：

json
{
  "reportId": "rpt_20260318_001",
  "pdfUrl": "https://example.com/reports/rpt_20260318_001.pdf"
}
要求：

内部生成一个 CareerReport JSON 对象（见 2.3），并保存到持久层。

同时生成或关联一份 PDF（初期可以是预制 demo PDF）。

返回 reportId 和 pdfUrl，供 /reports/[id] 使用。
​

2.3 报告查询接口：GET /api/reports/[id]
用途：根据报告 ID 获取 PDF URL 和报告元数据。

响应示例：

json
{
  "reportId": "rpt_20260318_001",
  "jobId": "15-1252",
  "title": "Software Developers – AI Impact Report",
  "pdfUrl": "https://example.com/reports/rpt_20260318_001.pdf",
  "createdAt": "2026-03-18T12:00:00Z"
}
3. 数据层设计
3.1 职业基础数据（Occupation Base）
来源：../jobs-master（mariodian/jobs 仓库的数据）。

MVP 建议处理出一份 data/occupations.json，每条记录至少包含：

ts
type OccupationBase = {
  jobId: string;          // 例如 BLS code / jobs 仓库 id
  title: string;          // 职业名称
  aiExposureScore: number; // 来自 jobs 仓库的 AI exposure 分
  medianWage?: number;
  employment?: number;
  growthRate?: number;
  // 可扩展字段
};
约定：

/api/career-impact/summary 和 /api/career-impact/full 必须以此为基础，不自行从网络抓职业数据。

所有「职业 ID」统一用 jobId 字段，来源于 jobs 数据。

3.2 职业报告结构（CareerReport Schema）
CareerReport JSON 用于：

生成 PDF。

将来做「和报告聊天」时作为 RAG 数据源。
​

示例结构：

ts
type CareerReport = {
  reportId: string;
  jobId: string;
  title: string;

  profile: {
    overview: string;
    mainTasks: string[];
    keySkills: string[];
    typicalEmployers?: string[];
  };

  aiImpact: {
    exposureScore: number;
    exposureLevel: "low" | "medium" | "high";
    risks: string[];
    opportunities: string[];
  };

  roadmap: {
    threeYearPlan: string[];
    fiveYearPlan: string[];
  };

  learningPlan: {
    focusAreas: string[];
    suggestedProjectTypes: string[];
  };

  meta: {
    createdAt: string;
    dataSources: string[];
  };
};
MVP：

POST /api/career-impact/full 至少要生成出这一结构（可以先写死/半自动），并存储在数据库或文件中。

4. PDF 展示与生成
4.1 展示（Viewer）
/reports/[id] 页面必须：

从 GET /api/reports/[id] 获取 pdfUrl。

用 PDF viewer 组件展示。

优先方案：

使用 EmbedPDF snippet 或类似方案：引用官方脚本，在一个容器 <div id="pdf-viewer" /> 中渲染 PDF。
​

备用方案：

使用 react-pdf + Next.js 的示例（参考 react-pdf-example-with-nextjs）。

4.2 生成（后续阶段）
MVP v0.1：

可以先用预制 demo PDF（手工生成），所有报告指向同一个 PDF，只要链路跑通即可。

后续：

基于 CareerReport JSON，使用 PDF 生成 SDK 或 react-pdf 在后端渲染出真实报告 PDF，然后保存并返回 pdfUrl。
​

5. 外部工具与未来扩展（仅预留，不必在 MVP 实现）
5.1 内容摄取层 – Reader
所有「从网页/文档拿文本给 LLM」的场景，统一调用一个函数：

ts
async function fetchAndCleanUrl(url: string): Promise<string> {
  // 内部接入 jina-ai/reader
}
用途：

读取 BLS / O*NET 职业页面、行业分析文章，为 CareerReport.profile 和 aiImpact 提供原始材料。
​

5.2 Web 执行层 – Page Agent / Unbrowse / browser-use
当前 career-ai-impact MVP 不直接使用，只在架构上预留说明（未来用于 JD 抓取和运营自动化）：
​

默认顺序：
1）Page Agent（DOM Copilot）；
2）Unbrowse（反推网站内部 API，转换成 Agent 技能）；
3）browser-use（GUI 自动化兜底）。

5.3 记忆 / RAG 层 – OpenViking / LanceDB / memory-lancedb-pro
未来需要长记忆时（用户历史报告、多次测评等），统一通过抽象接口使用：

ts
type MemoryItem = {
  id: string;
  userId: string;
  sourceType: string; // e.g. "career_report"
  content: string;
  createdAt: string;
  tags: string[];
};

async function memorySave(item: MemoryItem): Promise<void> {}
async function memoryQuery(query: string, filters?: any): Promise<MemoryItem[]> {}
初期实现可以是 SQLite + 简单向量库，之后替换为 OpenViking / LanceDB / memory-lancedb-pro，而不改业务层代码。
​

6. 实施优先级（给开发看的简单 Roadmap）
前端：实现 /career-check 和 /reports/demo，用硬编码 mock 数据（不依赖 API）。

API：

实现 GET /api/career-impact/summary，读取 data/occupations.json 返回简报。

实现 POST /api/career-impact/full + GET /api/reports/[id]，先返回 demo PDF。

将 demo 流程打通：选职业 → 看简报 → 点按钮 → 打开 PDF 报告页。

再逐步：

接入真实 jobs 数据。

让 CareerReport 变成真实 LLM 生成、可用于后续 RAG 的结构。