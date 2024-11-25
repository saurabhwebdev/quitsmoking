export type UserData = {
  startDate: string;
  cigarettesPerDay: number;
  costPerPack: number;
  cigarettesPerPack: number;
  currency: 'USD' | 'INR';
  cravingCount: number;
  cravingManaged: number;
  lastCraving: string | null;
  goals: string[];
  triggers: string[];
  name: string;
  motivations: string[];
  lastLogin: string;
  streakCount: number;
  longestStreak: number;
}

export type CravingLog = {
  timestamp: string;
  trigger: string;
  managed: boolean;
  copingStrategy: string;
  intensity: 1 | 2 | 3;
  duration: number;
  gaveIn: boolean;
  cigarettesSmoked: number;
}

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  type: 'milestone' | 'streak' | 'health' | 'savings';
} 