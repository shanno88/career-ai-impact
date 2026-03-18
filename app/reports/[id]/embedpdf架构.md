Perfect! Now I have a comprehensive understanding. Let me create a detailed summary document:

EmbedPDF 项目扫描报告
1. 框架类型
主项目: Monorepo (使用 Turbo + pnpm workspace)
核心库: Framework-agnostic (框架无关)
支持框架:
React (主要)
Vue 3
Svelte 5
Preact
纯 JavaScript/Vanilla JS
网站: Next.js 15 (文档和演示)
2. 入口文件
主库入口: 
index.ts
React 组件: viewers/react/src/ → 导出 @embedpdf/react-pdf-viewer
网站入口: 
page.tsx
 (Next.js App Router)
React 示例: 
main.tsx
 (Vite 入口)
Vue 示例: 
main.ts
Svelte 示例: 
main.ts
3. 核心组件
包结构 (packages/ 目录):

@embedpdf/core - 核心 PDF 查看器引擎
@embedpdf/pdfium - PDFium WebAssembly 包装器
@embedpdf/engines - 渲染引擎
@embedpdf/models - 数据模型
@embedpdf/plugin-* (30+ 插件):
plugin-annotation - 注释/标记
plugin-search - 搜索功能
plugin-zoom - 缩放
plugin-rotate - 旋转
plugin-print - 打印
plugin-redaction - 编辑/删除
plugin-thumbnail - 缩略图
plugin-ui - UI 组件
等等...
框架特定组件 (viewers/ 目录):

@embedpdf/react-pdf-viewer - React 组件
@embedpdf/vue-pdf-viewer - Vue 组件
@embedpdf/svelte-pdf-viewer - Svelte 组件
@embedpdf/snippet - 可嵌入的 JavaScript 片段
示例应用:

React + Tailwind 示例 (完整功能)
React + Material-UI 示例
Vue + Tailwind 示例
Vue + Vuetify 示例
Svelte + Tailwind 示例
4. 后端/API 部分
纯前端 - 没有后端 API
所有 PDF 处理都在浏览器中进行 (WebAssembly)
支持从 URL 加载 PDF 或本地文件上传
网站本身是 Next.js (但只用于文档/演示，不是 API 服务)
5. PDF 渲染库
主要: PDFium WebAssembly (@embedpdf/pdfium)
使用 Emscripten 编译的 PDFium (Google 的 PDF 引擎)
提供 pdfium.wasm 文件
支持高质量 PDF 渲染、注释、编辑等
不使用: pdf.js, react-pdf, iframe embed
优势: 完整的 PDF 功能支持 (注释、编辑、搜索等)
6. 关键依赖
根 package.json (开发工具):

{
  "packageManager": "pnpm@10.4.0",
  "devDependencies": {
    "turbo": "latest",
    "typescript": "latest",
    "vite": "^6.3.5",
    "eslint": "^9.39.2",
    "prettier": "^3.7.4"
  }
}
核心库 (@embedpdf/core):

{
  "dependencies": {
    "@embedpdf/engines": "workspace:*",
    "@embedpdf/models": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0",
    "vue": ">=3.2.0",
    "svelte": ">=5 <6",
    "preact": "^10.26.4"
  }
}
React 查看器 (@embedpdf/react-pdf-viewer):

{
  "dependencies": {
    "@embedpdf/snippet": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  }
}
React 示例 (examples/react-tailwind):

{
  "dependencies": {
    "@embedpdf/core": "workspace:*",
    "@embedpdf/pdfium": "workspace:*",
    "@embedpdf/plugin-*": "workspace:*",  // 20+ 插件
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
    "vite": "^6.3.5",
    "@vitejs/plugin-react": "^4.3.4"
  }
}
网站 (website):

{
  "dependencies": {
    "next": "^15.4.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@embedpdf/core": "workspace:*",
    "@embedpdf/pdfium": "workspace:*",
    "nextra": "^4.6.1",  // 文档框架
    "tailwindcss": "^4.0.6"
  }
}
📊 项目统计
总包数: 40+ (核心 + 30+ 插件 + 4 框架查看器)
支持框架: 5 (React, Vue, Svelte, Preact, Vanilla)
示例应用: 5 个
构建工具: Turbo + Vite + Rollup
包管理: pnpm workspace
许可证: MIT
🎯 核心特性
✅ 框架无关的核心库 ✅ 插件化架构 (30+ 可选插件) ✅ WebAssembly 高性能渲染 ✅ 完整的 PDF 功能 (注释、搜索、编辑、打印等) ✅ 多框架支持 (React, Vue, Svelte) ✅ 纯前端 (无后端依赖) ✅ 开源 MIT 许可