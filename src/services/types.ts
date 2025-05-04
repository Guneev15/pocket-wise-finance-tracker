export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserData extends User {
  password: string;
  createdAt: string;
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  settings: UserSettings;
  stats: UserStats;
}

export interface UserSettings {
  currency: string;
  theme: "light" | "dark";
  notifications: boolean;
}

export interface UserStats {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  userId?: string;
  date: string;
  type: "income" | "expense";
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: "monthly" | "yearly";
  userId?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  expiresAt: string;
}
