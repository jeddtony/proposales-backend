import Anthropic from '@anthropic-ai/sdk';

export interface JudgeCriterion {
  name: string;
  description: string;
  weight?: number; // default 1
}

export interface CriterionResult {
  score: number; // 1–10
  reasoning: string;
}

export interface JudgeResult {
  criteria: Record<string, CriterionResult>;
  overall_score: number; // weighted average, 1–10
  passed: boolean;
  summary: string;
}

const PASS_THRESHOLD = 7;

const JUDGE_SYSTEM = `You are an impartial LLM output quality evaluator.
You will be given an input, an output produced by an AI system, and a set of evaluation criteria.
Score each criterion on a scale of 1–10, then give an overall summary.
Respond ONLY with a valid JSON object matching this schema:
{
  "criteria": {
    "<criterion_name>": { "score": <number 1-10>, "reasoning": "<string>" }
  },
  "summary": "<one sentence overall assessment>"
}`;

function buildJudgePrompt(input: string, output: string, criteria: JudgeCriterion[]): string {
  const criteriaList = criteria.map(c => `- ${c.name}: ${c.description}`).join('\n');
  return `## Input provided to the AI system
${input}

## AI system output
${output}

## Evaluation criteria
${criteriaList}

Evaluate the output against each criterion and return the JSON.`;
}

export async function judge(params: {
  input: string;
  output: string;
  criteria: JudgeCriterion[];
  apiKey: string;
}): Promise<JudgeResult> {
  const client = new Anthropic({ apiKey: params.apiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: JUDGE_SYSTEM,
    messages: [
      {
        role: 'user',
        content: buildJudgePrompt(params.input, params.output, params.criteria),
      },
    ],
  });

  const block = response.content[0];
  const text = block.type === 'text' ? block.text : '';

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Judge returned non-JSON response: ${text}`);

  const parsed = JSON.parse(match[0]) as { criteria: Record<string, CriterionResult>; summary: string };

  const totalWeight = params.criteria.reduce((sum, c) => sum + (c.weight ?? 1), 0);
  const weightedSum = params.criteria.reduce((sum, c) => {
    const result = parsed.criteria[c.name];
    return sum + (result?.score ?? 0) * (c.weight ?? 1);
  }, 0);

  const overall_score = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return {
    criteria: parsed.criteria,
    overall_score: Math.round(overall_score * 10) / 10,
    passed: overall_score >= PASS_THRESHOLD,
    summary: parsed.summary,
  };
}
