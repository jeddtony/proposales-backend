import Anthropic from '@anthropic-ai/sdk';
import { judge, JudgeCriterion } from './llmJudge';
import * as ExtractEventDataPrompt from '@prompts/extractEventData.prompt';

interface EvalCase {
  name: string;
  details: string;
  expectedFields: string[]; // fields we expect to be present in output
}

const EVAL_CASES: EvalCase[] = [
  {
    name: 'Corporate Dinner — detailed RFP',
    details: `We are planning a formal corporate dinner for approximately 80 executives at our Stockholm headquarters.
The event is scheduled for June 15, 2025 and should run from 6pm to 11pm.
Our budget is 120,000 SEK including beverages.
We require a sit-down 3-course dinner indoors, with a business awards ceremony integrated.
Several guests are vegetarian and two have gluten intolerance.
The theme is "Celebrating 25 Years of Innovation".`,
    expectedFields: ['event_type', 'guest_count', 'budget', 'event_date', 'dietary_requirements', 'theme', 'duration'],
  },
  {
    name: 'Vague Team Building — minimal info',
    details: `Looking for a fun outdoor team building day for our sales team. About 30 people. Budget is flexible. Sometime in August.`,
    expectedFields: ['event_type', 'guest_count', 'indoor_outdoor'],
  },
  {
    name: 'Multi-day Conference — complex RFP',
    details: `We need full conference management for our annual summit, 3 days in September 2025.
Expected attendance: 200 delegates from 12 countries.
Budget: EUR 85,000.
We need a hotel venue with breakout rooms, AV equipment, and full catering.
Catering must accommodate halal, kosher, vegan, and nut-free options.
Outdoor evening reception on day 1. Formal gala dinner on day 3.
Special requirement: live translation services for Swedish and German speakers.`,
    expectedFields: ['event_type', 'guest_count', 'budget', 'budget_currency', 'event_date', 'dietary_requirements', 'special_requirements', 'duration'],
  },
];

const CRITERIA: JudgeCriterion[] = [
  {
    name: 'completeness',
    description: 'All key information present in the input is captured in the output JSON. No important details are missing.',
    weight: 2,
  },
  {
    name: 'accuracy',
    description: 'Extracted values exactly match what was stated in the input. No hallucinations or incorrect values.',
    weight: 3,
  },
  {
    name: 'format_compliance',
    description: 'Output is valid JSON that follows the specified schema. Types are correct (numbers for guest_count/budget, arrays for lists).',
    weight: 2,
  },
  {
    name: 'no_hallucination',
    description: 'The output does not include fields or values that were not mentioned or clearly implied in the input.',
    weight: 3,
  },
];

async function runExtraction(details: string, apiKey: string): Promise<string> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: ExtractEventDataPrompt.system(),
    messages: [{ role: 'user', content: ExtractEventDataPrompt.user(details) }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

function checkExpectedFields(output: string, expectedFields: string[]): { present: string[]; missing: string[] } {
  const present: string[] = [];
  const missing: string[] = [];
  for (const field of expectedFields) {
    if (output.includes(`"${field}"`)) {
      present.push(field);
    } else {
      missing.push(field);
    }
  }
  return { present, missing };
}

export async function runExtractEventDataEvals(apiKey: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('  extractEventData Evals');
  console.log('  Prompt version:', ExtractEventDataPrompt.VERSION);
  console.log('='.repeat(60));

  let totalScore = 0;
  let passed = 0;

  for (let i = 0; i < EVAL_CASES.length; i++) {
    const evalCase = EVAL_CASES[i];
    console.log(`\n[${i + 1}/${EVAL_CASES.length}] ${evalCase.name}`);
    console.log(`  Input: "${evalCase.details.slice(0, 80)}..."`);

    try {
      const output = await runExtraction(evalCase.details, apiKey);

      const fieldCheck = checkExpectedFields(output, evalCase.expectedFields);
      if (fieldCheck.missing.length > 0) {
        console.log(`  Missing expected fields: ${fieldCheck.missing.join(', ')}`);
      }

      const result = await judge({ input: evalCase.details, output, criteria: CRITERIA, apiKey });

      totalScore += result.overall_score;
      if (result.passed) passed++;

      console.log(`  Score: ${result.overall_score}/10 — ${result.passed ? 'PASS' : 'FAIL'}`);
      console.log(`  Summary: ${result.summary}`);
      console.log('  Criteria breakdown:');
      for (const [name, { score, reasoning }] of Object.entries(result.criteria)) {
        const icon = score >= PASS_THRESHOLD ? '✓' : '✗';
        console.log(`    ${icon} ${name}: ${score}/10 — ${reasoning}`);
      }
      console.log(`  Output: ${output.slice(0, 150)}${output.length > 150 ? '...' : ''}`);
    } catch (err) {
      console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const avgScore = totalScore / EVAL_CASES.length;
  console.log('\n' + '-'.repeat(60));
  console.log(`extractEventData: ${passed}/${EVAL_CASES.length} passed — avg score ${avgScore.toFixed(1)}/10`);
}

const PASS_THRESHOLD = 7;
