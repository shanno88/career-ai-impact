import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

type OccupationBase = {
  jobId: string;
  title: string;
  aiExposureScore: number;
  medianWage?: number;
  employment?: number;
  growthRate?: number;
};

type SummaryResponse = {
  jobId: string;
  title: string;
  aiExposureLevel: string;
  aiExposureScore: number;
  keyRisks: string[];
  keyOpportunities: string[];
};

// Helper function to map exposure score to level
function getExposureLevel(score: number): string {
  if (score >= 0 && score <= 3) return 'low';
  if (score > 3 && score <= 6) return 'medium';
  if (score > 6 && score <= 10) return 'high';
  return 'medium';
}

// Helper function to generate risks based on occupation
function generateRisks(title: string, score: number): string[] {
  const baseRisks: Record<string, string[]> = {
    'Software Developers': [
      'Routine coding tasks are highly automatable by AI code generation tools.',
      'Documentation and test generation can be offloaded to AI assistants.',
      'Junior developer roles may face increased competition from AI-assisted workflows.',
    ],
    'Registered Nurses': [
      'Administrative documentation tasks may be automated by AI systems.',
      'Routine patient monitoring could be enhanced or replaced by AI diagnostics.',
      'Need to adapt to AI-integrated healthcare technologies.',
    ],
    'Elementary and Middle School Teachers': [
      'AI tutoring systems may reduce demand for traditional classroom instruction.',
      'Grading and assessment tasks can be automated by AI tools.',
      'Pressure to integrate new AI technologies into curriculum.',
    ],
    'Teachers': [
      'AI tutoring systems may reduce demand for traditional classroom instruction.',
      'Grading and assessment tasks can be automated by AI tools.',
      'Pressure to integrate new AI technologies into curriculum.',
    ],
    'Accountants and Auditors': [
      'Data analysis and routine auditing tasks are highly susceptible to AI automation.',
      'Tax computation and anomaly detection increasingly handled by AI.',
      'Entry-level positions may face restructuring due to AI productivity gains.',
    ],
    'Lawyers': [
      'Document review and legal research can be significantly accelerated by AI.',
      'Contract analysis and due diligence tasks are automatable.',
      'Routine legal work may be consolidated into fewer roles.',
    ],
  };

  // Return specific risks if available, otherwise generate generic ones
  if (baseRisks[title]) {
    return baseRisks[title];
  }

  // Generic risks based on exposure score
  if (score >= 8) {
    return [
      'Core tasks are highly susceptible to AI automation.',
      'Significant productivity gains may reduce workforce demand.',
      'Need to continuously upskill to stay competitive.',
    ];
  } else if (score >= 5) {
    return [
      'Some routine tasks may be automated by AI tools.',
      'Workflow changes expected as AI integration increases.',
      'Moderate pressure to adapt to new technologies.',
    ];
  } else {
    return [
      'Physical or interpersonal nature provides some protection.',
      'Limited direct AI automation risk in core tasks.',
      'Peripheral administrative tasks may be affected.',
    ];
  }
}

// Helper function to generate opportunities based on occupation
function generateOpportunities(title: string, score: number): string[] {
  const baseOpportunities: Record<string, string[]> = {
    'Software Developers': [
      'AI tools can boost productivity and allow focus on complex system design.',
      'High demand for AI/ML specialists and prompt engineers.',
      'Opportunity to lead AI integration in organizations.',
    ],
    'Registered Nurses': [
      'More time for patient care with AI handling documentation.',
      'Enhanced diagnostic support through AI-assisted tools.',
      'Growing demand for nurses in specialized AI-integrated care.',
    ],
    'Elementary and Middle School Teachers': [
      'AI can personalize learning for each student.',
      'Teachers can focus on mentorship and critical thinking development.',
      'New roles in AI literacy and digital education.',
    ],
    'Teachers': [
      'AI can personalize learning for each student.',
      'Teachers can focus on mentorship and critical thinking development.',
      'New roles in AI literacy and digital education.',
    ],
    'Accountants and Auditors': [
      'AI can handle routine analysis, allowing focus on strategic advisory.',
      'High demand for AI-augmented accounting specialists.',
      'Opportunity to work on more complex, high-value engagements.',
    ],
    'Lawyers': [
      'AI can accelerate research and document preparation.',
      'More time for client strategy and relationship building.',
      'Opportunity to specialize in AI-related legal issues.',
    ],
  };

  // Return specific opportunities if available, otherwise generate generic ones
  if (baseOpportunities[title]) {
    return baseOpportunities[title];
  }

  // Generic opportunities based on exposure score
  if (score >= 8) {
    return [
      'AI tools can significantly enhance productivity and efficiency.',
      'Opportunity to specialize in AI-augmented roles.',
      'Potential for higher-value work as routine tasks are automated.',
    ];
  } else if (score >= 5) {
    return [
      'AI can assist with routine tasks, freeing time for complex work.',
      'Opportunity to develop hybrid AI-human workflows.',
      'Growing demand for roles that combine domain expertise with AI skills.',
    ];
  } else {
    return [
      'Physical and interpersonal skills remain highly valued.',
      'Opportunity to use AI tools for administrative efficiency.',
      'Strong job security due to automation resistance.',
    ];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get job_id from query parameters
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('job_id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing job_id parameter' },
        { status: 400 }
      );
    }

    // Read occupations.json
    const dataPath = join(process.cwd(), 'data', 'occupations.json');
    const fileContent = readFileSync(dataPath, 'utf-8');
    const occupations: OccupationBase[] = JSON.parse(fileContent);

    // Find occupation by jobId
    const occupation = occupations.find((occ) => occ.jobId === jobId);

    if (!occupation) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    // Generate response
    const response: SummaryResponse = {
      jobId: occupation.jobId,
      title: occupation.title,
      aiExposureLevel: getExposureLevel(occupation.aiExposureScore),
      aiExposureScore: occupation.aiExposureScore,
      keyRisks: generateRisks(occupation.title, occupation.aiExposureScore),
      keyOpportunities: generateOpportunities(
        occupation.title,
        occupation.aiExposureScore
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in summary API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
