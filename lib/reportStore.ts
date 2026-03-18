import fs from 'fs';
import path from 'path';
import { CareerReportMeta } from './types';
import { CareerReport } from '@/src/types/career-report';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

type ReportsData = Record<string, CareerReportMeta>;

export function buildMockReport(jobId: string): CareerReport {
  return {
    careerId: jobId,
    careerName: jobId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    aiRisk: {
      level: 'high',
      score: 75,
      summary: 'This career has high exposure to AI automation due to the routine nature of many tasks being automated by AI tools and machine learning systems.'
    },
    outlook: {
      tenYearSummary: 'High growth expected with AI integration, but with significant job transformation.',
      salaryTrendSummary: 'Salaries may stagnate for routine tasks but increase for AI-augmented roles.'
    },
    strategies: [
      { title: 'Develop AI Collaboration Skills', description: 'Focus on developing skills in AI tool usage, prompt engineering, and human-AI collaboration.' },
      { title: 'Specialize in Complex Problem-Solving', description: 'Focus on complex, non-routine tasks that require human judgment, creativity, and emotional intelligence.' },
      { title: 'Continuous Learning', description: 'Continuously update skills in emerging AI tools and technologies relevant to your field.' }
    ],
    skills: {
      mustHave: ['AI Tool Proficiency', 'Data Analysis', 'Critical Thinking', 'Human-AI Collaboration', 'Adaptability'],
      niceToHave: ['AI Prompt Engineering', 'Data Visualization', 'Cross-functional Collaboration'],
      learningPaths: [
        { title: 'AI-Augmented Professional Path', description: 'Focus on developing skills in AI tool usage and human-AI collaboration to enhance productivity.' },
        { title: 'AI Ethics and Governance', description: 'Learn about AI ethics, bias detection, and responsible AI implementation in your field.' }
      ]
    },
    generatedAt: new Date().toISOString()
  };
}

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadReports(): ReportsData {
  ensureDataDir();
  if (!fs.existsSync(REPORTS_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(REPORTS_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (error) {
    console.error('Error loading reports:', error);
    return {};
  }
}

function saveReports(data: ReportsData) {
  ensureDataDir();
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving reports:', error);
  }
}

export function generateReportId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `rpt_${timestamp}_${random}`;
}

export function createReport(meta: CareerReportMeta): void {
  const data = loadReports();
  data[meta.reportId] = meta;
  saveReports(data);
  console.log(`Report created: ${meta.reportId}`);
}

export function getReport(reportId: string): CareerReportMeta | null {
  const data = loadReports();
  return data[reportId] ?? null;
}

export function getAllReports(): CareerReportMeta[] {
  const data = loadReports();
  return Object.values(data);
}
