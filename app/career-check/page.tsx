'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Occupation = {
  jobId: string;
  title: string;
  aiExposureScore: number;
};

type SummaryData = {
  jobId: string;
  title: string;
  aiExposureLevel: string;
  aiExposureScore: number;
  keyRisks: string[];
  keyOpportunities: string[];
};

export default function CareerCheckPage() {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const router = useRouter();

  // Load occupations from JSON
  useEffect(() => {
    const loadOccupations = async () => {
      try {
        const response = await fetch('/data/occupations.json');
        const data: Occupation[] = await response.json();
        setOccupations(data);
      } catch (error) {
        console.error('Failed to load occupations:', error);
      }
    };
    loadOccupations();
  }, []);

  // Fetch summary when occupation is selected
  useEffect(() => {
    if (!selectedJobId) {
      setSummaryData(null);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/career-impact/summary?job_id=${selectedJobId}`
        );
        if (response.ok) {
          const data: SummaryData = await response.json();
          setSummaryData(data);
        } else {
          console.error('Failed to fetch summary');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedJobId]);

  const filteredOccupations = occupations.filter((occ) =>
    occ.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleGenerateFullReport = async () => {
    if (!selectedJobId) return;

    setIsGeneratingReport(true);
    setReportError(null);

    try {
      const res = await fetch('/api/career-impact/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJobId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setReportError(errorData.error || 'Failed to generate report');
        return;
      }

      const data = await res.json();
      router.push(`/reports/${selectedJobId}`);
    } catch (error) {
      console.error('Error generating report:', error);
      setReportError('An error occurred while generating the report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Career AI Impact Checker</h1>
          <p className="mt-3 text-lg text-gray-700">
            Explore how AI will impact your career. Select from 25+ real occupations with data from the US Bureau of Labor Statistics.
          </p>
          <p className="mt-2 text-base text-gray-600">
            Get an AI-generated 10-year outlook for your job, plus 3 concrete career strategies and a personalized skill roadmap.
          </p>
          <p className="mt-3 inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
            Full PDF report – planned price: $9.99 · Early MVP test, free for now
          </p>
        </div>

        {/* Career Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Search and select your occupation
          </label>
          <input
            type="text"
            placeholder="Search occupations..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {filteredOccupations.map((occ) => (
              <button
                key={occ.jobId}
                onClick={() => setSelectedJobId(occ.jobId)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedJobId === occ.jobId
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{occ.title}</div>
                <div className="text-xs mt-1 opacity-75">
                  Exposure: {occ.aiExposureScore}/10
                </div>
              </button>
            ))}
          </div>
          {filteredOccupations.length === 0 && (
            <p className="text-gray-500 text-center py-4">No occupations found</p>
          )}
        </div>

        {/* Career Info Card */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading career impact analysis...</p>
          </div>
        )}

        {summaryData && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-indigo-600">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{summaryData.title}</h2>
              <div className="mt-3 inline-block">
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  summaryData.aiExposureLevel === 'high'
                    ? 'bg-red-100 text-red-800'
                    : summaryData.aiExposureLevel === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  AI Exposure: {summaryData.aiExposureScore}/10 ({summaryData.aiExposureLevel})
                </span>
              </div>
            </div>

            {/* Risks */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-red-700 mb-3">⚠️ Key Risks</h3>
              <ul className="space-y-2">
                {summaryData.keyRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-3 font-bold">•</span>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-3">✨ Key Opportunities</h3>
              <ul className="space-y-2">
                {summaryData.keyOpportunities.map((opp, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-3 font-bold">•</span>
                    <span className="text-gray-700">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            {reportError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {reportError}
              </div>
            )}
            <button
              onClick={handleGenerateFullReport}
              disabled={isGeneratingReport}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-colors shadow-md ${
                isGeneratingReport
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isGeneratingReport ? 'Generating Report...' : 'Generate Full Career AI Report (PDF)'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!selectedJobId && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Select an occupation to view AI impact analysis</p>
          </div>
        )}
      </div>
    </main>
  );
}
