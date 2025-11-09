export interface Transaction {
  id: string;
  amount: number;
  from: string;
  to: string;
  status: "approved" | "sent" | "rejected" | string;
  date: string;
}
