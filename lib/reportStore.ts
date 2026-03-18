import fs from 'fs';
import path from 'path';
import { CareerReportMeta } from './types';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

type ReportsData = Record<string, CareerReportMeta>;

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
