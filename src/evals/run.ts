// Load env vars before any project imports that reference process.env
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

import { runExtractEventDataEvals } from './extractEventData.eval';
import { runProposalPipelineEvals } from './proposalPipeline.eval';

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set. Set it in your .env.development.local file.');
    process.exit(1);
  }

  const suite = process.argv[2]; // optional: "extract" | "pipeline"

  console.log('\n' + '█'.repeat(60));
  console.log('  LLM-as-a-Judge Evaluation Suite');
  console.log('  Judge model: claude-sonnet-4-6');
  console.log('  Pass threshold: 7/10 per criterion weighted average');
  console.log('█'.repeat(60));

  if (!suite || suite === 'extract') {
    await runExtractEventDataEvals(apiKey);
  }

  if (!suite || suite === 'pipeline') {
    await runProposalPipelineEvals(apiKey);
  }

  console.log('\n' + '█'.repeat(60));
  console.log('  Evals complete.');
  console.log('█'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
