export interface Transaction {
  id: string;
  amount: number;
  from: string;
  to: string;
  status: "in" | "out" | string;
  date: string;
  row: number;
}
