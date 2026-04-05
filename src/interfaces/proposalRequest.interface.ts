export interface ProposalRequest {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  details: string;
  proposal_uuid?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
