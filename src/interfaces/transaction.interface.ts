export enum TransactionStatus {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PENDING = 'pending',
}

export interface Transaction {
  id: number;
  user_id: number;
  order_id: number;
  reference_id: string;
  amount: number;
  status: TransactionStatus;
  created_at?: Date;
  updated_at?: Date;
}
