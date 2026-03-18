import { NextResponse } from 'next/server';
import { CareerReport } from '@/src/types/career-report';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
  }

  const mockCareerReport: CareerReport = {
    careerId: id,
    careerName: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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
      {
        title: 'Develop AI Collaboration Skills',
        description: 'Focus on developing skills in AI tool usage, prompt engineering, and human-AI collaboration to work alongside AI systems effectively.'
      },
      {
        title: 'Specialize in Complex Problem-Solving',
        description: 'Focus on complex, non-routine tasks that require human judgment, creativity, and emotional intelligence.'
      },
      {
        title: 'Continuous Learning',
        description: 'Continuously update skills in emerging AI tools and technologies relevant to your field.'
      }
    ],
    skills: {
      mustHave: ['AI Tool Proficiency', 'Data Analysis', 'Critical Thinking', 'Human-AI Collaboration', 'Adaptability'],
      niceToHave: ['AI Prompt Engineering', 'Data Visualization', 'Cross-functional Collaboration'],
      learningPaths: [
        {
          title: 'AI-Augmented Professional Path',
          description: 'Focus on developing skills in AI tool usage and human-AI collaboration to enhance productivity.'
        },
        {
          title: 'AI Ethics and Governance',
          description: 'Learn about AI ethics, bias detection, and responsible AI implementation in your field.'
        }
      ]
    },
    generatedAt: new Date().toISOString()
  };

  return NextResponse.json(mockCareerReport);
}
