'use client';

import Link from 'next/link';

export default function DemoReportPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demo Career Report PDF</h1>
            <p className="mt-2 text-gray-600">
              这是一份示例职业 AI 影响报告
            </p>
          </div>
          <Link
            href="/career-check"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            返回检查
          </Link>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <embed
            src="https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf"
            type="application/pdf"
            width="100%"
            height="800px"
            className="w-full"
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            💡 <strong>提示:</strong> 这是一个演示 PDF。在实际应用中，这里会显示根据选定职业生成的完整 AI 影响报告。
          </p>
        </div>
      </div>
    </main>
  );
}
