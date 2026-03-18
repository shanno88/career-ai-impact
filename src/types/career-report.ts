// High-level AI risk level for this career
export type AiRiskLevel = 'low' | 'medium' | 'high';

export interface CareerReport {
  // Internal ID and display name of the career
  careerId: string;
  careerName: string;

  // Part 1: AI risk score & explanation
  aiRisk: {
    level: AiRiskLevel;   // Categorical risk level, e.g. 'low' / 'medium' / 'high'
    score: number;        // Numeric score from 0–100 (higher = more exposed to AI)
    summary: string;      // 2–3 sentence explanation of why this career has this risk
  };

  // Part 2: 10-year outlook & salary trend (high-level)
  outlook: {
    tenYearSummary: string;       // High-level 10-year outlook for this career
    salaryTrendSummary: string;   // High-level description of salary trend
  };

  // Part 3: 3 concrete career strategies
  strategies: {
    title: string;        // Short title for the strategy
    description: string;  // 3–6 sentence explanation with concrete actions
  }[]; // Expected length: 3

  // Part 4: Recommended skills & learning paths
  skills: {
    mustHave: string[];   // 3–5 must-have skills to stay competitive
    niceToHave: string[]; // Optional skills that can boost career prospects
    learningPaths: {
      title: string;        // Name of the learning path (e.g. "AI tooling for marketers")
      description: string;  // 2–4 sentences describing what to learn and how
    }[]; // 2–3 suggested learning paths
  };

  // Metadata
  generatedAt: string; // ISO timestamp when this report was generated
}