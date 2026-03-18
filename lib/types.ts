export type CareerReportMeta = {
  reportId: string;
  jobId: string;
  title: string;
  createdAt: string;
  pdfUrl: string;
};

// Re-export the CareerReport type from the new location
export type { CareerReport, AiRiskLevel } from '@/src/types/career-report';
