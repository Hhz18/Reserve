
export interface User {
  id: string;
  email: string;
  name: string;
  // Profile Fields
  password?: string; // For display purposes in this demo
  avatar?: string;
  address?: string;
  birthDate?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | 'secret';
}

export type SystemType = 'vocab' | 'algo' | 'custom';
export type ThemeColor = 'amber' | 'lime' | 'pink' | 'sky' | 'violet' | 'orange' | 'teal' | 'rose';
export type Language = 'en' | 'zh';

export interface System {
  id: string;
  userId: string;
  type: SystemType;
  name: string;
  theme: ThemeColor;
  icon?: string;
}

export type ReviewStatus = 'new' | 'learning' | 'mastered';

export interface ReviewItem {
  id: string;
  systemId: string;
  title: string;
  content: string; // Translation or MD notes
  groupName?: string; // Chapter or Category
  status: ReviewStatus;
  reviewCount: number;
  nextReviewAt: number; // Timestamp
  lastReviewedAt?: number; // Timestamp
  createdAt: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
