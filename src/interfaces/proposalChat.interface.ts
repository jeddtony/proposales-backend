export type ChatRole = 'assistant' | 'user';

export interface ProposalChat {
  id: number;
  proposal_request_id: number;
  role: ChatRole;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}
