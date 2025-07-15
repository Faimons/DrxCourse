// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  timezone?: string;
  preferences?: UserPreferences;
  createdAt: string;
  lastLogin?: string;
  progress?: UserProgress;
}

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  language: 'de' | 'en' | 'es' | 'fr';
  autoplay: boolean;
  subtitles: boolean;
  playbackSpeed: number;
  emailDigest: boolean;
  marketingEmails: boolean;
  reminderEmails: boolean;
  weeklyGoal: number;
  preferredLearningTime: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  completionRate: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity?: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  newsletter?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Lesson Types
export interface Lesson {
  id: number;
  title: string;
  description: string;
  content?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  order: number;
  thumbnail?: string;
  videoUrl?: string;
  transcript?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  createdAt: string;
  updatedAt: string;
  progress?: LessonProgress;
  quiz?: QuizQuestion[];
  slides?: LessonSlide[];
  navigation?: {
    previous: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  };
}

export interface LessonProgress {
  id?: number;
  percentage: number;
  timeSpent: number;
  completedAt?: string;
  lastAccessed?: string;
  notes?: string;
  currentSlide?: number;
}

export interface LessonSlide {
  id: number;
  title: string;
  content: string;
  slideType: 'intro' | 'content' | 'quiz' | 'summary' | 'video';
  order: number;
  mediaUrl?: string;
  duration?: number;
}

// Quiz Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  explanation: string;
  points: number;
}

export interface QuizAttempt {
  id: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  results: QuizResult[];
  attemptNumber: number;
  createdAt: string;
}

export interface QuizResult {
  questionId: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  points: number;
  explanation: string;
}

// Achievement Types
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  threshold: number;
  category: string;
  points: number;
  isEarned: boolean;
  earnedAt?: string;
  currentProgress: number;
  progressPercentage: number;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  lessonId?: number;
  sessionId?: string;
}

export interface LearningSession {
  sessionId: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  lessonsCompleted: number;
  timeSpent: number;
  platform: string;
  deviceInfo?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string>;
  timestamp: string;
  path?: string;
  method?: string;
}

// Dashboard Types
export interface DashboardData {
  overview: {
    totalLessons: number;
    completedLessons: number;
    completionRate: number;
    totalTimeSpent: number;
    currentStreak: number;
    longestStreak: number;
    lastActivity?: string;
  };
  recentActivity: {
    lessonTitle: string;
    completedAt: string;
    timeSpent: number;
    quizScore?: number;
    quizPassed?: boolean;
  }[];
  achievements: Achievement[];
  studyCalendar: {
    date: string;
    lessonsCompleted: number;
    minutesStudied: number;
  }[];
  recommendations: {
    nextLessons: Lesson[];
    reviewLessons: Lesson[];
  };
}

// Settings Types
export interface UserSettings {
  email: string;
  name: string;
  timezone: string;
  preferences: UserPreferences;
}

// Feedback Types
export interface UserFeedback {
  type: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise' | 'question';
  rating?: number;
  message: string;
  lessonId?: number;
  category?: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  completed?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  categories: string[];
  difficulties: string[];
  completed?: boolean;
  search?: string;
}