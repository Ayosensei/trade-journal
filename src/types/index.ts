export type Direction = "Long" | "Short";

export type Outcome = "Win" | "Loss" | "Breakeven";

export type Mood = "confident" | "cautious" | "frustrated" | "excited" | "neutral";

export interface PartialExit {
  price: number;
  percentage: number;
}

export interface Trade {
  id: string;
  date: string;
  asset: string;
  direction: Direction;
  entryPrice: number;
  exitPrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  positionSize: number;
  pnl: number;
  outcome: Outcome;
  strategy?: string;
  emotionalState?: string;
  notes?: string;
  tags?: string[];
  screenshots?: string[];
  exits?: PartialExit[];
  status?: "executed" | "pending" | "cancelled";
  riskReward?: number;
}

export interface Account {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  trades: string[]; // Array of Trade IDs
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  marketConditions: string;
  observations: string;
  lessonsLearned: string;
  tradesCount: number;
  pnl: number;
}

export interface TradingGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: "profit" | "trades" | "winrate" | "custom";
  deadline?: string;
  completed: boolean;
}

export interface BackupData {
  version: string;
  timestamp: number;
  accounts: string | null;
  trades: string | null;
  customPairs: string | null;
  selectedAccount: string | null;
  journalEntries: string | null;
  goals: string | null;
}
