# External Repos Reference

根目录：C:\Users\Administrator\Desktop\workspace

- jobs-master/  
  - 来源：mariodian/jobs  
  - 用途：职业列表 + BLS + AI exposure 数据源。不要写新爬虫，优先基于这里的 CSV/JSON 做 occupation_base。

- pdftochat-main/  
  - 来源：Nutlope/pdftochat  
  - 用途：参考「PDF → 向量 → RAG 聊天」的数据流和接口设计。不要直接搬 UI。

- embed-pdf-viewer-main/  
  - 用途：参考 PDF viewer 嵌入方式，用在 career-ai-impact 的 `/reports/[id]` 页面。

- react-pdf-example-with-nextjs-master/ & react-pdf-main/  
  - 用途：如果不用 EmbedPDF、想用 React-PDF 自己做 viewer，可以参考这两个项目的 Next.js 集成方式。

- chat-main/  
  - 来源：Nutlope/chat  
  - 用途：参考 chat UI 结构 & App Router 下的 chat API 写法，用在之后的「和报告/职业聊天」功能。

- browser-use-main/ & browser-use-examples-main/  
  - 用途：第二阶段做 JD 抓取 / 自动浏览器操作时参考。当前 MVP 阶段不要集成到 career-ai-impact。

- unbrowse-stable/  
  - 用途：第二阶段需要从特定网站稳定读数据时，用 Unbrowse 反推 API。当前 MVP 只在架构层预留，不实现。
