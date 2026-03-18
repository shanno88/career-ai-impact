import { CareerReport } from '@/src/types/career-report';

async function getReport(id: string): Promise<CareerReport> {
  const res = await fetch(`http://localhost:3000/api/reports/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Report not found');
  return res.json();
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <p className="text-sm text-gray-400 mb-6">
        Early test version – content may change as we improve the report engine.
      </p>

      <h1 className="text-3xl font-bold mb-2">{report.careerName}</h1>

      {/* Part 1 */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Part 1 · AI Risk</h2>
        <p className="text-sm text-gray-500">
          Risk Level: <span className="font-bold uppercase">{report.aiRisk.level}</span>
          {' '}· Score: {report.aiRisk.score}/100
        </p>
        <p className="mt-2">{report.aiRisk.summary}</p>
      </section>

      {/* Part 2 */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Part 2 · 10-Year Outlook</h2>
        <p>{report.outlook.tenYearSummary}</p>
        <p className="mt-2 text-gray-600">{report.outlook.salaryTrendSummary}</p>
      </section>

      {/* Part 3 */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Part 3 · Career Strategies</h2>
        {report.strategies.map((s, i) => (
          <div key={i} className="mt-4">
            <h3 className="font-semibold">{i + 1}. {s.title}</h3>
            <p className="text-gray-700 mt-1">{s.description}</p>
          </div>
        ))}
      </section>

      {/* Part 4 */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Part 4 · Skills & Learning Paths</h2>
        <div className="mt-2">
          <p className="font-semibold">Must-have skills:</p>
          <ul className="list-disc list-inside text-gray-700">
            {report.skills.mustHave.map(function(s, i) { return <li key={i}>{s}</li>; })}
        </ul>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Learning paths:</p>
        {report.skills.learningPaths.map((lp, i) => (
          <div key={i} className="mt-2">
            <p className="font-medium">{lp.title}</p>
            <p className="text-gray-600 text-sm">{lp.description}</p>
          </div>
        ))}
      </div>
    </section>
    </main >
  );
}
