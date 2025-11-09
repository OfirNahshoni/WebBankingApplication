export interface Transaction {
  id: string;
  amount: number;
  from: string;
  to: string;
  status: "in" | "out" | string;
  date: string;
  row: number;
}

export interface RawTransaction {
  id: string;
  amount: number;
  otherMail: string | null;
  date: string;
  row: number;
}

export interface RawTransactionListResponse {
  items?: RawTransaction[];
  total?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
