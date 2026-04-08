import Anthropic from '@anthropic-ai/sdk';
import { judge, JudgeCriterion } from './llmJudge';
import * as ExperienceSummaryPrompt from '@prompts/experienceSummary.prompt';
import * as ContentMatcherPrompt from '@prompts/contentMatcher.prompt';

// ─── Experience Summary Evals ─────────────────────────────────────────────────

interface ExperienceSummaryCase {
  name: string;
  proposalRequest: { name: string; company_name: string; details: string };
}

const EXPERIENCE_SUMMARY_CASES: ExperienceSummaryCase[] = [
  {
    name: 'Corporate Award Dinner',
    proposalRequest: {
      name: 'Anna Lindqvist',
      company_name: 'Nordic Ventures AB',
      details:
        'We want a black-tie awards dinner for 60 senior employees celebrating our 10-year anniversary. Champagne reception, 3-course dinner, live jazz quartet, and an awards ceremony with 8 categories. Budget around 90,000 SEK. Date: November 28, 2025.',
    },
  },
  {
    name: 'Outdoor Team Building',
    proposalRequest: {
      name: 'Marcus Eriksson',
      company_name: 'TechStart Sweden',
      details:
        'We need a half-day outdoor team building activity for 25 software engineers. Something active and collaborative — kayaking, orienteering, or similar. Should end with a group BBQ lunch. Budget is 20,000 SEK. Anytime in June.',
    },
  },
  {
    name: 'Product Launch Conference',
    proposalRequest: {
      name: 'Sofia Bergström',
      company_name: 'FutureHealth AB',
      details:
        'Product launch conference for our new medical device. 120 attendees: doctors, investors, and press. Full-day event with keynote, breakout sessions, and evening cocktail reception. AV setup needs to be top-tier. Budget: EUR 45,000.',
    },
  },
];

const EXPERIENCE_SUMMARY_CRITERIA: JudgeCriterion[] = [
  {
    name: 'tailored_to_client',
    description:
      'The summary is specifically tailored to the client\'s details — it mentions their company, event type, and specific requirements rather than being generic.',
    weight: 3,
  },
  {
    name: 'structure_compliance',
    description:
      'The response follows the required structure: (1) introductory paragraph, (2) "Key Elements to Elevate the Experience" section with bullet points, (3) "Why This Proposal Stands Out" closing paragraph.',
    weight: 2,
  },
  {
    name: 'professional_tone',
    description: 'The writing is professional, engaging, and inspiring without being generic or using filler phrases.',
    weight: 2,
  },
  {
    name: 'actionable_suggestions',
    description:
      'The "Key Elements" section provides concrete, specific suggestions directly relevant to the event type and client needs — not vague platitudes.',
    weight: 3,
  },
];

// ─── Content Matcher Evals ────────────────────────────────────────────────────

interface ContentMatcherCase {
  name: string;
  experienceSummary: string;
  contentItems: Array<{ product_id: string; variation_id: string; title: string; description: string }>;
  expectedIndexes: number[]; // which indexes we expect to be selected
}

const CONTENT_MATCHER_CASES: ContentMatcherCase[] = [
  {
    name: 'Corporate dinner — should select catering and venue items',
    experienceSummary:
      'A sophisticated black-tie awards dinner experience for 60 executives. Key elements: champagne reception, 3-course gourmet dinner, live entertainment, awards ceremony setup.',
    contentItems: [
      { product_id: 'p1', variation_id: 'v1', title: 'Gourmet 3-Course Dinner Package', description: 'Premium sit-down dinner with customizable menu for corporate events' },
      { product_id: 'p2', variation_id: 'v2', title: 'Kayaking Adventure', description: 'Half-day guided sea kayaking experience for groups' },
      { product_id: 'p3', variation_id: 'v3', title: 'Live Jazz Quartet', description: 'Professional jazz musicians for corporate events and dinners' },
      { product_id: 'p4', variation_id: 'v4', title: 'Champagne Reception Package', description: 'Curated champagne and canapés welcome reception' },
      { product_id: 'p5', variation_id: 'v5', title: 'Axe Throwing Session', description: 'Fun axe throwing team activity for groups of 10-30' },
      { product_id: 'p6', variation_id: 'v6', title: 'Awards Ceremony AV Setup', description: 'Full audiovisual setup for awards ceremonies including stage, lighting, and sound' },
    ],
    expectedIndexes: [0, 2, 3, 5], // dinner, jazz, champagne, AV — not kayaking/axe throwing
  },
  {
    name: 'Outdoor team building — should select activity items',
    experienceSummary:
      'An energetic outdoor team building day for software engineers. Focus on collaborative physical challenges, culminating in a shared BBQ lunch experience.',
    contentItems: [
      { product_id: 'p1', variation_id: 'v1', title: 'Formal Gala Dinner Setup', description: 'Full formal dinner with white tablecloths and silver service' },
      { product_id: 'p2', variation_id: 'v2', title: 'Orienteering Challenge', description: 'Competitive orienteering in forest terrain, teams of 4-6' },
      { product_id: 'p3', variation_id: 'v3', title: 'BBQ Catering Package', description: 'Outdoor BBQ with grill master, salads, and non-alcoholic beverages' },
      { product_id: 'p4', variation_id: 'v4', title: 'Kayak & SUP Adventure', description: 'Guided kayak and stand-up paddleboard experience on the archipelago' },
      { product_id: 'p5', variation_id: 'v5', title: 'Conference Room Rental', description: 'Full-day conference room with projector and whiteboard' },
    ],
    expectedIndexes: [1, 2, 3], // orienteering, BBQ, kayak — not gala dinner or conference room
  },
];

const CONTENT_MATCHER_CRITERIA: JudgeCriterion[] = [
  {
    name: 'relevance_precision',
    description: 'Selected indexes correspond to content items genuinely relevant to the experience summary. Irrelevant items are not included.',
    weight: 3,
  },
  {
    name: 'relevance_recall',
    description: 'All content items that are clearly relevant to the experience are included in the selection. No obviously relevant items are missed.',
    weight: 3,
  },
  {
    name: 'format_compliance',
    description: 'Response is a valid JSON array of integers with no extra text or explanation.',
    weight: 4,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callLLM(params: { system: string; prompt: string; apiKey: string }): Promise<string> {
  const client = new Anthropic({ apiKey: params.apiKey });
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: params.system,
    messages: [{ role: 'user', content: params.prompt }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

const PASS_THRESHOLD = 7;

// ─── Runners ──────────────────────────────────────────────────────────────────

async function runExperienceSummaryEvals(apiKey: string): Promise<{ passed: number; total: number; avgScore: number }> {
  console.log('\n' + '─'.repeat(60));
  console.log('  generateExperienceSummary');
  console.log('  Prompt version:', ExperienceSummaryPrompt.VERSION);
  console.log('─'.repeat(60));

  let totalScore = 0;
  let passed = 0;

  for (let i = 0; i < EXPERIENCE_SUMMARY_CASES.length; i++) {
    const evalCase = EXPERIENCE_SUMMARY_CASES[i];
    console.log(`\n  [${i + 1}/${EXPERIENCE_SUMMARY_CASES.length}] ${evalCase.name}`);

    try {
      const output = await callLLM({
        system: ExperienceSummaryPrompt.system(),
        prompt: ExperienceSummaryPrompt.user(evalCase.proposalRequest),
        apiKey,
      });

      const input = `Client: ${evalCase.proposalRequest.name} (${evalCase.proposalRequest.company_name})\nDetails: ${evalCase.proposalRequest.details}`;
      const result = await judge({ input, output, criteria: EXPERIENCE_SUMMARY_CRITERIA, apiKey });

      totalScore += result.overall_score;
      if (result.passed) passed++;

      console.log(`  Score: ${result.overall_score}/10 — ${result.passed ? 'PASS' : 'FAIL'}`);
      console.log(`  Summary: ${result.summary}`);
      for (const [name, { score, reasoning }] of Object.entries(result.criteria)) {
        const icon = score >= PASS_THRESHOLD ? '✓' : '✗';
        console.log(`    ${icon} ${name}: ${score}/10 — ${reasoning.slice(0, 100)}`);
      }
    } catch (err) {
      console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const avgScore = totalScore / EXPERIENCE_SUMMARY_CASES.length;
  console.log(`\n  Result: ${passed}/${EXPERIENCE_SUMMARY_CASES.length} passed — avg ${avgScore.toFixed(1)}/10`);
  return { passed, total: EXPERIENCE_SUMMARY_CASES.length, avgScore };
}

async function runContentMatcherEvals(apiKey: string): Promise<{ passed: number; total: number; avgScore: number }> {
  console.log('\n' + '─'.repeat(60));
  console.log('  getRelevantContent (Content Matcher)');
  console.log('  Prompt version:', ContentMatcherPrompt.VERSION);
  console.log('─'.repeat(60));

  let totalScore = 0;
  let passed = 0;

  for (let i = 0; i < CONTENT_MATCHER_CASES.length; i++) {
    const evalCase = CONTENT_MATCHER_CASES[i];
    console.log(`\n  [${i + 1}/${CONTENT_MATCHER_CASES.length}] ${evalCase.name}`);

    try {
      const contentSummaries = evalCase.contentItems.map(
        (item, idx) => `[${idx}] product_id:${item.product_id}, variation_id:${item.variation_id} | Title: "${item.title}" | Description: "${item.description}"`,
      );

      const prompt = ContentMatcherPrompt.user({
        experienceSummary: evalCase.experienceSummary,
        contentSummaries,
      });

      const output = await callLLM({ system: '', prompt, apiKey });

      const inputDescription =
        `Experience summary: ${evalCase.experienceSummary}\n\nContent items:\n${contentSummaries.join('\n')}\n\nExpected indexes: ${JSON.stringify(evalCase.expectedIndexes)}`;

      const result = await judge({ input: inputDescription, output, criteria: CONTENT_MATCHER_CRITERIA, apiKey });

      // Parse the actual selection and compare with expected
      let selectedIndexes: number[] = [];
      try {
        const match = output.match(/\[[\d,\s]*\]/);
        if (match) selectedIndexes = JSON.parse(match[0]);
      } catch {
        // ignore parse error, judge will flag format_compliance
      }

      totalScore += result.overall_score;
      if (result.passed) passed++;

      console.log(`  Selected: ${JSON.stringify(selectedIndexes)}  Expected: ${JSON.stringify(evalCase.expectedIndexes)}`);
      console.log(`  Score: ${result.overall_score}/10 — ${result.passed ? 'PASS' : 'FAIL'}`);
      console.log(`  Summary: ${result.summary}`);
      for (const [name, { score, reasoning }] of Object.entries(result.criteria)) {
        const icon = score >= PASS_THRESHOLD ? '✓' : '✗';
        console.log(`    ${icon} ${name}: ${score}/10 — ${reasoning.slice(0, 100)}`);
      }
    } catch (err) {
      console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const avgScore = totalScore / CONTENT_MATCHER_CASES.length;
  console.log(`\n  Result: ${passed}/${CONTENT_MATCHER_CASES.length} passed — avg ${avgScore.toFixed(1)}/10`);
  return { passed, total: CONTENT_MATCHER_CASES.length, avgScore };
}

export async function runProposalPipelineEvals(apiKey: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('  Proposal Pipeline Evals');
  console.log('='.repeat(60));

  const summaryResults = await runExperienceSummaryEvals(apiKey);
  const matcherResults = await runContentMatcherEvals(apiKey);

  const totalPassed = summaryResults.passed + matcherResults.passed;
  const total = summaryResults.total + matcherResults.total;
  const overallAvg = (summaryResults.avgScore * summaryResults.total + matcherResults.avgScore * matcherResults.total) / total;

  console.log('\n' + '-'.repeat(60));
  console.log(`Proposal Pipeline: ${totalPassed}/${total} passed — avg score ${overallAvg.toFixed(1)}/10`);
}
