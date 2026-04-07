export interface ProposalRequest {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  details: string;
  event_date?: Date | null;
  guests?: number | null;
  budget?: number | null;
  proposal_uuid?: string | null;
  proposal_url?: string | null;
  proposal_generated_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}
