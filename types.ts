
export type UserType = 'CITIZEN' | 'BUSINESS' | 'ADMIN' | 'PUBLIC_RESULT' | 'CITIZEN_REQUESTER';

export interface RewardConfig {
  type: 'GIFT_CARD' | 'LOCAL_CURRENCY' | 'PRODUCT' | 'CRYPTO' | 'NONE';
  method: 'ALL' | 'DRAW' | 'FIRST_COME';
  quantity: number;
  amount: string;
  drawDate?: string;
  delivery: 'SMS' | 'WALLET' | 'EMAIL';
  cryptoInfo?: {
    currency: string;
    network: 'TRC20' | 'ERC20';
  };
}

export interface Winner {
  userId: string;
  surveyId: string;
  status: 'PENDING' | 'SENT' | 'CONFIRMED' | 'FAILED';
  notified: boolean;
  timestamp: number;
  txHash?: string;
  network?: 'TRC20' | 'ERC20';
}

export interface CryptoLog {
  surveyId: string;
  address: string;
  amount: string;
  network: 'TRC20' | 'ERC20';
  txHash: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'NOT_FOUND';
  timestamp: number;
  verifiedAt?: number;
}

export interface AdminProfile {
  phoneHash: string;
  role: 'BUSINESS' | 'GOV' | 'CITIZEN';
  createdAt: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT';
  options?: string[];
  branchingRule?: {
    dependsOn: string;
    equals: string;
  };
}

export interface Survey {
  id: string;
  title: string;
  region: string;
  category: string;
  goal: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPublic: boolean;
  questions: Question[];
  reward?: RewardConfig;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  totalParticipants: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  timestamp: number;
  answers: Record<string, any>;
  rewardAddress?: string;
  metadata: {
    ageGroup: string;
    gender: string;
    timeBucket: string;
    location?: { lat: number; lng: number };
    fingerprint?: string;
  };
}

export interface AnalysisResult {
  stats: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    timeBuckets: Record<string, number>;
    prefKeywords: { token: string; count: number }[];
    categoryDistribution?: Record<string, number>;
    fairness: {
      totalResponses: number;
      uniqueUsers: number;
      blockedAttempts: number;
      integrityScore: number;
    };
  };
  insights: string[];
  recommendations: string[];
}
