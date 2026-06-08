export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO format
  type: TransactionType;
  currency?: string;
  exchangeRate?: number;
}

export interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline?: string; // ISO format
  userId: string;
}

