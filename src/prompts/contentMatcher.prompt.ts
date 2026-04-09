export const VERSION = 'v2';

export const user = (params: { chatHistory: string; contentSummaries: string[] }) =>
  `You are a proposal content matcher.

Given the following conversation history between an assistant and a client about their event:
"""
${params.chatHistory}
"""

And the following list of available content items (indexed):
${params.contentSummaries.join('\n')}

Return ONLY a JSON array of the indexes of content items that are relevant to the event based on the full conversation above.
Example response: [0, 3, 7]
Return an empty array if nothing is relevant. Do not include any explanation, only the JSON array.`;
