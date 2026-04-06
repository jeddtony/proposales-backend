"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExperienceSummary = void 0;
const llm_1 = require("@utils/llm");
const SYSTEM_PROMPT = `You are an expert event and proposal consultant.
When given details about a client's request for proposal (RFP), you generate a compelling, structured experience overview that:
- Describes the kind of experience the client is expecting
- Suggests key elements and items that would interest them
- Is written in a professional, engaging tone
- Follows this structure:
  1. A short introductory paragraph describing the overall event vision
  2. A "Key Elements to Elevate the Experience" section with specific, relevant suggestions
  3. A closing "Why This Proposal Stands Out" paragraph

Keep the response focused, inspiring, and tailored specifically to the client's details. Do not use generic filler. Every suggestion should feel relevant to the specific request.`;
async function generateExperienceSummary(proposalRequest) {
    const userMessage = `
Client Name: ${proposalRequest.name}
Company: ${proposalRequest.company_name}
Details / RFP: ${proposalRequest.details}

Based on the above, generate a compelling event experience overview and proposal summary.
  `.trim();
    const response = await llm_1.llm.chat([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
    ]);
    return response.text;
}
exports.generateExperienceSummary = generateExperienceSummary;
//# sourceMappingURL=proposalAI.js.map