import React from 'react';
import Link from 'next/link';

type CareerReportMeta = {
  reportId: string;
  jobId: string;
  title: string;
  createdAt: string;
  pdfUrl: string;
};

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  let report: CareerReportMeta | null = null;
  let error: string | null = null;

  try {
    // Use absolute URL for server-side fetch
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const url = `${protocol}://${host}/api/reports/${id}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        error = 'Report not found';
      } else {
        error = 'Failed to load report';
      }
    } else {
      report = await res.json();
    }
  } catch (err) {
    console.error('Error fetching report:', err);
    error = 'An error occurred while loading the report';
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error || 'Report not found'}</p>
            <Link
              href="/career-check"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Career Check
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/career-check"
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 inline-block"
          >
            ← Back to Career Check
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{report.title}</h1>
          <p className="mt-2 text-gray-600">Generated on {createdDate}</p>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <embed
            src={report.pdfUrl}
            type="application/pdf"
            className="w-full"
            style={{ height: '800px' }}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/career-check"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Back to Career Check
          </Link>
        </div>
      </div>
    </main>
  );
}
