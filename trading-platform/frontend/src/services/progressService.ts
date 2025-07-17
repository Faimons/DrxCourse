// trading-platform/frontend/src/services/progressService.ts
import apiClient from './apiClient';

export interface UserProgress {
  user_id: number;
  total_lessons: number;
  completed_lessons: number;
  total_time_spent: number;
  current_streak: number;
  longest_streak: number;
  average_quiz_score: number;
  total_quiz_attempts: number;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  threshold: number;
  category: string;
  points: number;
  earned_at?: string;
  progress?: number;
}

export interface LearningSession {
  id: number;
  session_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  lessons_completed: number;
  time_spent_minutes: number;
  events_count: number;
  platform: string;
}

export interface ProgressStats {
  overall: UserProgress;
  byCategory: {
    [category: string]: {
      total_lessons: number;
      completed_lessons: number;
      total_time: number;
      avg_quiz_score: number;
    };
  };
  recentActivity: {
    date: string;
    lessons_completed: number;
    time_spent: number;
  }[];
  achievements: {
    total: number;
    earned: number;
    recent: Achievement[];
    byCategory: { [category: string]: Achievement[] };
  };
}

class ProgressService {
  // Overall Progress
  async getUserProgress(): Promise<ProgressStats> {
    return apiClient.get('/api/progress');
  }

  async getUserDashboard(): Promise<any> {
    return apiClient.get('/api/progress/dashboard');
  }

  // Achievements
  async getAchievements(): Promise<{
    totalPoints: number;
    totalAchievements: number;
    earnedAchievements: number;
    achievements: { [category: string]: Achievement[] };
    recentlyEarned: Achievement[];
  }> {
    return apiClient.get('/api/progress/achievements');
  }

  async checkAchievements(): Promise<Achievement[]> {
    return apiClient.post('/api/progress/achievements/check');
  }

  // Learning Sessions
  async startLearningSession(): Promise<LearningSession> {
    return apiClient.post('/api/progress/sessions/start');
  }

  async endLearningSession(sessionId: string): Promise<LearningSession> {
    return apiClient.post(`/api/progress/sessions/${sessionId}/end`);
  }

  async getLearningHistory(limit: number = 10): Promise<LearningSession[]> {
    return apiClient.get(`/api/progress/sessions?limit=${limit}`);
  }

  // Analytics & Statistics
  async getProgressAnalytics(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<{
    progressOverTime: any[];
    categoryBreakdown: any[];
    streakData: any[];
    timeSpentData: any[];
  }> {
    return apiClient.get(`/api/progress/analytics?range=${timeRange}`);
  }

  async getActivityHeatmap(): Promise<{
    [date: string]: number;
  }> {
    return apiClient.get('/api/progress/heatmap');
  }

  // Lesson Notes
  async updateLessonNotes(lessonId: number, notes: string): Promise<void> {
    return apiClient.post(`/api/progress/notes/${lessonId}`, { notes });
  }

  async getLessonNotes(lessonId: number): Promise<{ notes: string }> {
    return apiClient.get(`/api/progress/notes/${lessonId}`);
  }

  // Recommendations
  async getRecommendations(): Promise<{
    nextLessons: any[];
    suggestedTopics: string[];
    personalizedPath: any[];
  }> {
    return apiClient.get('/api/progress/recommendations');
  }

  // Streak Management
  async updateStreak(): Promise<{ current_streak: number; longest_streak: number }> {
    return apiClient.post('/api/progress/streak/update');
  }

  async getStreakDetails(): Promise<{
    current_streak: number;
    longest_streak: number;
    streak_dates: string[];
    last_activity: string;
  }> {
    return apiClient.get('/api/progress/streak');
  }

  // Progress Export
  async exportProgress(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await apiClient.get(`/api/progress/export?format=${format}`, {
      responseType: 'blob'
    });
    return response;
  }

  // Goals & Targets
  async setWeeklyGoal(lessonsPerWeek: number): Promise<void> {
    return apiClient.post('/api/progress/goals/weekly', { lessonsPerWeek });
  }

  async getGoalProgress(): Promise<{
    weeklyGoal: number;
    currentWeekProgress: number;
    weeklyPercentage: number;
    monthlyGoal: number;
    currentMonthProgress: number;
    monthlyPercentage: number;
  }> {
    return apiClient.get('/api/progress/goals');
  }

  // Certificates & Completions
  async getCertificates(): Promise<{
    id: number;
    name: string;
    description: string;
    issued_at: string;
    certificate_url: string;
  }[]> {
    return apiClient.get('/api/progress/certificates');
  }

  async generateCertificate(courseId: number): Promise<{
    certificate_url: string;
    certificate_id: string;
  }> {
    return apiClient.post(`/api/progress/certificates/generate/${courseId}`);
  }

  // Study Time Tracking
  async recordStudyTime(
    lessonId: number, 
    minutes: number, 
    sessionId?: string
  ): Promise<void> {
    return apiClient.post('/api/progress/study-time', {
      lessonId,
      minutes,
      sessionId
    });
  }

  async getStudyTimeStats(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<{
    totalMinutes: number;
    dailyAverage: number;
    dailyBreakdown: { date: string; minutes: number }[];
    weeklyBreakdown: { week: string; minutes: number }[];
  }> {
    return apiClient.get(`/api/progress/study-time/stats?range=${timeRange}`);
  }
}

export const progressService = new ProgressService();
export default progressService;