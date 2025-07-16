// trading-platform/frontend/src/services/lessonService.ts
import api from './api';

export interface DynamicLesson {
  id: string;
  title: string;
  subtitle: string;
  module: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  objectives: string[];
  slides: DynamicSlide[];
  metadata?: any;
}

export interface DynamicSlide {
  id: string;
  title: string;
  subtitle?: string;
  type: 'welcome' | 'definition' | 'concept' | 'example' | 'quiz' | 'summary';
  duration: number;
  content: any;
  speechScript?: string;
  interactiveComponents: {
    hasTTS: boolean;
    hasCharts: boolean;
    hasQuiz: boolean;
    hasDrawingTools: boolean;
    hasInteractiveSetup: boolean;
    extractedData?: any;
  };
  originalType?: string;
}

export interface LessonProgress {
  slideId: string;
  title: string;
  type: string;
  slideOrder: number;
  completedAt?: string;
  timeSpent: number;
  quizScore?: number;
  quizPassed: boolean;
}

export const lessonService = {
  // Alle Lektionen laden
  async getAllLessons(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    module?: string;
  }): Promise<{ lessons: DynamicLesson[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.module) searchParams.set('module', params.module);

    const response = await api.get(`/lessons?${searchParams.toString()}`);
    return response.data;
  },

  // Spezifische Lektion laden
  async getLessonById(id: string): Promise<DynamicLesson> {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  // Lektion importieren (Admin)
  async importLesson(lesson: DynamicLesson): Promise<{ message: string; lessonId: string }> {
    const response = await api.post('/lessons/import', { lesson });
    return response.data;
  },

  // Multiple Lektionen importieren (Admin)
  async importMultipleLessons(lessons: DynamicLesson[]): Promise<{ 
    successful: string[]; 
    failed: { id: string; error: string }[] 
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { id: string; error: string }[]
    };

    for (const lesson of lessons) {
      try {
        await this.importLesson(lesson);
        results.successful.push(lesson.id);
      } catch (error: any) {
        results.failed.push({
          id: lesson.id,
          error: error.response?.data?.error || error.message
        });
      }
    }

    return results;
  },

  // User Progress updaten
  async updateProgress(lessonId: string, progress: {
    slideId: string;
    timeSpent: number;
    completed: boolean;
    quizScore?: number;
    quizPassed?: boolean;
  }): Promise<{ message: string }> {
    const response = await api.post(`/lessons/${lessonId}/progress`, progress);
    return response.data;
  },

  // User Progress laden
  async getLessonProgress(lessonId: string, userId?: string): Promise<LessonProgress[]> {
    const url = userId 
      ? `/lessons/${lessonId}/progress/${userId}`
      : `/lessons/${lessonId}/progress/me`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Lektion löschen (Admin)
  async deleteLesson(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },

  // Migration Status prüfen
  async getMigrationStatus(): Promise<{
    total: number;
    migrated: number;
    pending: number;
    verified: number;
    published: number;
  }> {
    const response = await api.get('/admin/migration-status');
    return response.data;
  }
};

// Trading-platform/frontend/src/services/api.ts (falls noch nicht vorhanden)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor für auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor für error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;