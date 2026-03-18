import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { generateReportId, createReport } from '@/lib/reportStore';

type OccupationBase = {
  jobId: string;
  title: string;
  aiExposureScore: number;
};

type RequestBody = {
  jobId: string;
};

type ResponseBody = {
  reportId: string;
  pdfUrl: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId' },
        { status: 400 }
      );
    }

    // Read occupations.json to validate jobId
    const dataPath = join(process.cwd(), 'data', 'occupations.json');
    const fileContent = readFileSync(dataPath, 'utf-8');
    const occupations: OccupationBase[] = JSON.parse(fileContent);

    // Find occupation by jobId
    const occupation = occupations.find((occ) => occ.jobId === jobId);

    if (!occupation) {
      return NextResponse.json(
        { error: 'Invalid jobId' },
        { status: 400 }
      );
    }

    // Generate report ID and create report meta
    const reportId = generateReportId();
    const pdfUrl = '/reports/demo.pdf';
    const createdAt = new Date().toISOString();

    console.log(`Creating report with ID: ${reportId} for jobId: ${jobId}`);

    createReport({
      reportId,
      jobId,
      title: `${occupation.title} – AI Impact Report`,
      createdAt,
      pdfUrl,
    });

    console.log(`Report successfully created: ${reportId}`);

    const response: ResponseBody = {
      reportId,
      pdfUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in full report API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
