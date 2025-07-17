// trading-platform/frontend/src/services/lessonService.ts
import apiClient from './api';

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  order_index: number;
  thumbnail_url?: string;
  video_url?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface DynamicLesson {
  id: string;
  title: string;
  subtitle?: string;
  module: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_time: number;
  objectives: string[];
  metadata: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  progress_percentage: number;
  time_spent: number;
  completed_at?: string;
  last_accessed_at: string;
  notes?: string;
  current_slide: number;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  lesson_id: number;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  answers: any[];
  results: any;
  attempt_number: number;
  created_at: string;
}

class LessonService {
  // Legacy Lessons API
  async getLessons(filters?: {
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ lessons: Lesson[]; total: number; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiClient.get(`/api/lessons?${params.toString()}`);
  }

  async getLessonById(id: number): Promise<Lesson> {
    return apiClient.get(`/api/lessons/${id}`);
  }

  // Dynamic Lessons API
  async getDynamicLessons(filters?: {
    difficulty?: string;
    module?: string;
    page?: number;
    limit?: number;
  }): Promise<{ lessons: DynamicLesson[]; total: number; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.module) params.append('module', filters.module);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiClient.get(`/api/dynamic-lessons?${params.toString()}`);
  }

  async getDynamicLessonById(id: string): Promise<DynamicLesson> {
    return apiClient.get(`/api/dynamic-lessons/${id}`);
  }

  // Progress API
  async getLessonProgress(lessonId: number): Promise<LessonProgress | null> {
    try {
      return await apiClient.get(`/api/lessons/${lessonId}/progress`);
    } catch (error: any) {
      if (error.status === 404) {
        return null; // No progress yet
      }
      throw error;
    }
  }

  async updateLessonProgress(
    lessonId: number, 
    progressData: {
      progress_percentage?: number;
      time_spent?: number;
      completed_at?: string;
      notes?: string;
      current_slide?: number;
    }
  ): Promise<LessonProgress> {
    return apiClient.post(`/api/lessons/${lessonId}/progress`, progressData);
  }

  async markLessonCompleted(
    lessonId: number, 
    timeSpent: number = 0
  ): Promise<LessonProgress> {
    return apiClient.post(`/api/lessons/${lessonId}/progress`, {
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
      time_spent: timeSpent
    });
  }

  // Quiz API
  async getQuizQuestions(lessonId: number): Promise<any[]> {
    return apiClient.get(`/api/lessons/${lessonId}/quiz`);
  }

  async submitQuizAttempt(
    lessonId: number,
    answers: any[],
    timeSpent: number = 0
  ): Promise<QuizAttempt> {
    return apiClient.post(`/api/lessons/${lessonId}/quiz`, {
      answers,
      time_spent: timeSpent
    });
  }

  async getQuizAttempts(lessonId: number): Promise<QuizAttempt[]> {
    return apiClient.get(`/api/lessons/${lessonId}/quiz/attempts`);
  }

  // Categories & Statistics
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get('/api/lessons/categories');
    return response.categories || [];
  }

  async getLessonStats(lessonId: number): Promise<any> {
    return apiClient.get(`/api/lessons/${lessonId}/stats`);
  }

  // Search
  async searchLessons(query: string, filters?: {
    category?: string;
    difficulty?: string;
  }): Promise<{ lessons: Lesson[]; total: number }> {
    const params = new URLSearchParams({ q: query });
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);

    return apiClient.get(`/api/lessons/search?${params.toString()}`);
  }

  // Admin APIs
  async createLesson(lessonData: Partial<Lesson>): Promise<Lesson> {
    return apiClient.post('/api/admin/lessons', lessonData);
  }

  async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson> {
    return apiClient.put(`/api/admin/lessons/${id}`, lessonData);
  }

  async deleteLesson(id: number): Promise<void> {
    return apiClient.delete(`/api/admin/lessons/${id}`);
  }

  // Migration APIs
  async importLessons(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`lessons[${index}]`, file);
    });

    return apiClient.post('/api/admin/lessons/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getMigrationStatus(): Promise<any> {
    return apiClient.get('/api/admin/migration-status');
  }
}

export const lessonService = new LessonService();
export default lessonService;