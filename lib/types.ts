export type PlatformStats = {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalMaterials: number;
  totalAttempts: number;
  totalQuestions: number;
  signupsLast7Days: number;
};

export type AdminUserSummary = {
  id: string;
  email: string | null;
  name: string;
  phoneNumber: string | null;
  fieldOfStudy: string | null;
  occupation: string | null;
  createdAt: string | null;
  deactivatedAt: string | null;
  isActive: boolean;
  tier: "FREE" | "PRO";
  isPro: boolean;
  billingStatus: string | null;
  usage: { materials: number; attempts: number };
};

export type AdminUserDetail = AdminUserSummary & {
  lastSignInAt: string | null;
  subscription: {
    tier: "FREE" | "PRO";
    isPro: boolean;
    billingStatus: string | null;
    currentPeriodEnd: string | null;
    usage: { materials: number; attempts: number };
    limits: { materialsReached: boolean; attemptsReached: boolean };
  };
  devices: Array<{
    id: string;
    device_id: string;
    device_name: string | null;
    last_active_at: string;
    created_at: string;
  }>;
};

export type UserSearchResult = {
  users: AdminUserSummary[];
  total: number;
  page: number;
  limit: number;
};

export type AdminMaterialSummary = {
  id: string;
  title: string;
  sourceFile: string | null;
  questionCount: number;
  createdAt: string | null;
  uploader: {
    id: string;
    name: string;
    email: string | null;
  };
  attempts: {
    totalAttempts: number;
    completedAttempts: number;
    averageAccuracy: number | null;
    bestScore: number | null;
  };
};

export type MaterialSearchResult = {
  materials: AdminMaterialSummary[];
  total: number;
  page: number;
  limit: number;
};

export type AdminMaterialDetail = {
  id: string;
  title: string;
  sourceFile: string | null;
  questionCount: number;
  createdAt: string | null;
  uploader: {
    id: string;
    name: string;
    email: string | null;
  };
  stats: {
    totalAttempts: number;
    completedAttempts: number;
    averageAccuracy: number | null;
    bestScore: number | null;
  };
  questions: Array<{
    id: string;
    type: string;
    question: string;
    topic: string | null;
    domain: string;
    language: string;
    isPublished: boolean;
    createdAt: string;
  }>;
  attempts: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string | null;
    score: number | null;
    maxScore: number | null;
    accuracy: number | null;
    questionType: string | null;
    isTimed: boolean | null;
    timeUsedSeconds: number | null;
    createdAt: string;
    completedAt: string | null;
  }>;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  email: string | null;
  bestScore: number;
  totalScore: number;
  attempts: number;
  averageAccuracy: number;
};
