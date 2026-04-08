export const VERSION = 'v1';

export const user = (params: { experienceSummary: string; contentSummaries: string[] }) =>
  `You are a proposal content matcher.

Given the following event/proposal experience summary:
"""
${params.experienceSummary}
"""

And the following list of available content items (indexed):
${params.contentSummaries.join('\n')}

Return ONLY a JSON array of the indexes of content items that are relevant to the event experience described above.
Example response: [0, 3, 7]
Return an empty array if nothing is relevant. Do not include any explanation, only the JSON array.`;
