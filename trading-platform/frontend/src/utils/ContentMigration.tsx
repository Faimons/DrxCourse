// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\utils\ContentMigration.tsx
import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Database,
  Zap,
  ArrowRight
} from 'lucide-react';

// ==========================================
// CONTENT MIGRATION ENGINE
// ==========================================

interface OldLessonFormat {
  id: string;
  title: string;
  subtitle: string;
  totalSlides: number;
  slides: OldSlideFormat[];
}

interface OldSlideFormat {
  id: number;
  title: string;
  subtitle?: string;
  type: string;
  speechScript?: string;
  content: any;
}

interface NewLessonFormat {
  id: string;
  title: string;
  subtitle: string;
  module: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  objectives: string[];
  slides: NewSlideFormat[];
}

interface NewSlideFormat {
  id: string;
  title: string;
  subtitle?: string;
  type: 'welcome' | 'definition' | 'concept' | 'example' | 'quiz' | 'exercise' | 'summary';
  duration: number;
  speechScript?: string;
  content: {
    [key: string]: any;
  };
}

// ==========================================
// MIGRATION RULES & TEMPLATES
// ==========================================

const MIGRATION_RULES = {
  // Slide Type Mapping
  slideTypeMapping: {
    'welcome': 'welcome',
    'definition': 'definition',
    'zero-sum-detailed': 'concept',
    'order-chart-flow': 'concept',
    'spreads-slippage': 'concept',
    'fee-structure': 'concept',
    'market-participants': 'concept',
    'institutional-strategies': 'concept',
    'cost-calculation': 'example',
    'broker-comparison': 'example',
    'final-quiz': 'quiz',
    'summary': 'summary',
    'preview': 'summary'
  },

  // Content Structure Templates
  contentTemplates: {
    welcome: (oldContent: any) => ({
      lessonGoals: oldContent.lessonGoals || extractGoals(oldContent),
      keyTopics: oldContent.keyTopics || extractTopics(oldContent),
      estimatedTime: oldContent.estimatedTime || '25 minutes'
    }),

    concept: (oldContent: any) => ({
      description: oldContent.description || extractDescription(oldContent),
      keyPoints: oldContent.keyPoints || extractKeyPoints(oldContent),
      examples: oldContent.examples || extractExamples(oldContent),
      warnings: oldContent.warnings || []
    }),

    example: (oldContent: any) => ({
      scenario: oldContent.scenario || extractScenario(oldContent),
      calculation: oldContent.calculation || extractCalculation(oldContent),
      result: oldContent.result || extractResult(oldContent),
      steps: oldContent.steps || []
    }),

    quiz: (oldContent: any) => ({
      questions: oldContent.questions || extractQuestions(oldContent)
    })
  }
};

// ==========================================
// CONTENT EXTRACTION HELPERS
// ==========================================

function extractGoals(content: any): string[] {
  // Intelligente Extraktion von Lernzielen aus verschiedenen Content-Strukturen
  const goals: string[] = [];
  
  if (content.lessonGoals) return content.lessonGoals;
  if (content.objectives) return content.objectives;
  if (content.goals) return content.goals;
  
  // Fallback: Suche nach typischen Lernziel-Patterns
  const text = JSON.stringify(content);
  const goalPatterns = [
    /Sie lernen[^.]*\./g,
    /Verstehen Sie[^.]*\./g,
    /Nach dieser Lektion[^.]*\./g,
    /Ziel ist es[^.]*\./g
  ];
  
  goalPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) goals.push(...matches);
  });
  
  return goals.length > 0 ? goals : ['Verstehen Sie die Grundlagen', 'Anwenden praktischer Beispiele'];
}

function extractKeyPoints(content: any): string[] {
  if (content.keyPoints) return content.keyPoints;
  if (content.mainPoints) return content.mainPoints;
  if (content.bulletPoints) return content.bulletPoints;
  
  // Extrahiere aus verschiedenen Strukturen
  const points: string[] = [];
  
  Object.values(content).forEach((value: any) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (typeof item === 'string' && item.length > 10 && item.length < 200) {
          points.push(item);
        }
      });
    }
  });
  
  return points.slice(0, 6); // Max 6 Punkte
}

function extractDescription(content: any): string {
  if (content.description) return content.description;
  if (content.intro) return content.intro;
  if (content.overview) return content.overview;
  
  // Fallback: Erster längerer Text-String
  const findLongText = (obj: any): string => {
    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.length > 50) {
        return value;
      }
      if (typeof value === 'object' && value !== null) {
        const nested = findLongText(value);
        if (nested) return nested;
      }
    }
    return '';
  };
  
  return findLongText(content) || 'Wichtige Trading-Konzepte verstehen';
}

function extractExamples(content: any): string[] {
  const examples: string[] = [];
  
  if (content.examples) return content.examples;
  if (content.cases) return content.cases;
  if (content.scenarios) return content.scenarios;
  
  // Suche nach typischen Beispiel-Patterns
  const searchExample = (obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (key.toLowerCase().includes('example') || key.toLowerCase().includes('beispiel')) {
        if (typeof value === 'string') examples.push(value);
        if (Array.isArray(value)) examples.push(...value);
      }
      if (typeof value === 'object' && value !== null) {
        searchExample(value);
      }
    });
  };
  
  searchExample(content);
  return examples.slice(0, 3);
}

function extractScenario(content: any): string {
  return content.scenario || content.situation || content.case || 'Trading-Szenario';
}

function extractCalculation(content: any): string {
  return content.calculation || content.formula || content.math || 'Berechnung: Siehe Beispiel';
}

function extractResult(content: any): string {
  return content.result || content.outcome || content.answer || 'Ergebnis: Siehe Berechnung';
}

function extractQuestions(content: any): any[] {
  if (content.questions) return content.questions;
  if (content.quiz) return content.quiz;
  
  // Fallback Demo-Quiz
  return [{
    id: 'q1',
    question: 'Was haben Sie in dieser Lektion gelernt?',
    options: [
      'Grundlagen des Tradings',
      'Fortgeschrittene Strategien',
      'Risikomanagement',
      'Alle oben genannten'
    ],
    correct: 3,
    explanation: 'Diese Lektion behandelt verschiedene wichtige Trading-Aspekte.'
  }];
}

function extractTopics(content: any): string[] {
  return content.keyTopics || content.topics || content.chapters || ['Trading Grundlagen', 'Praktische Anwendung'];
}

// ==========================================
// MAIN MIGRATION ENGINE
// ==========================================

function migrateLesson(oldLesson: OldLessonFormat): NewLessonFormat {
  console.log(`🔄 Migrating lesson: ${oldLesson.title}`);
  
  const newLesson: NewLessonFormat = {
    id: oldLesson.id,
    title: oldLesson.title,
    subtitle: oldLesson.subtitle,
    module: 'Trading Masterclass',
    difficulty: determineDifficulty(oldLesson),
    estimatedTime: Math.max(20, oldLesson.totalSlides * 2),
    objectives: extractObjectives(oldLesson),
    slides: []
  };

  // Migrate slides
  oldLesson.slides.forEach((oldSlide, index) => {
    const newSlideType = mapSlideType(oldSlide.type);
    const contentTemplate = MIGRATION_RULES.contentTemplates[newSlideType];
    
    const newSlide: NewSlideFormat = {
      id: `slide-${index + 1}`,
      title: oldSlide.title,
      subtitle: oldSlide.subtitle,
      type: newSlideType,
      duration: estimateSlideDuration(oldSlide),
      speechScript: oldSlide.speechScript,
      content: contentTemplate ? contentTemplate(oldSlide.content) : oldSlide.content
    };
    
    newLesson.slides.push(newSlide);
    console.log(`  ✅ Migrated slide: ${oldSlide.title} (${oldSlide.type} → ${newSlideType})`);
  });

  return newLesson;
}

function mapSlideType(oldType: string): NewSlideFormat['type'] {
  return (MIGRATION_RULES.slideTypeMapping as any)[oldType] || 'concept';
}

function determineDifficulty(lesson: OldLessonFormat): 'Beginner' | 'Intermediate' | 'Advanced' {
  const title = lesson.title.toLowerCase();
  if (title.includes('grundlagen') || title.includes('basis') || title.includes('einführung')) {
    return 'Beginner';
  }
  if (title.includes('advanced') || title.includes('expert') || title.includes('professional')) {
    return 'Advanced';
  }
  return 'Intermediate';
}

function estimateSlideDuration(slide: OldSlideFormat): number {
  const contentSize = JSON.stringify(slide.content).length;
  const speechLength = slide.speechScript?.length || 0;
  
  // Basis: 2 Minuten, +1 Minute pro 1000 Zeichen Content, +1 Minute pro 500 Zeichen Speech
  return Math.max(2, Math.min(10, 
    2 + Math.floor(contentSize / 1000) + Math.floor(speechLength / 500)
  ));
}

function extractObjectives(lesson: OldLessonFormat): string[] {
  // Versuche Lernziele aus der ersten Slide zu extrahieren
  const firstSlide = lesson.slides[0];
  if (firstSlide?.content) {
    const goals = extractGoals(firstSlide.content);
    if (goals.length > 0) return goals.slice(0, 4);
  }
  
  // Fallback basierend auf Lesson-Titel
  return [
    `Verstehen Sie ${lesson.title}`,
    'Praktische Anwendung der Konzepte',
    'Echte Trading-Beispiele analysieren',
    'Wissen in Tests überprüfen'
  ];
}

// ==========================================
// MIGRATION UI COMPONENT
// ==========================================

const ContentMigrationTool = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [migrationLog, setMigrationLog] = useState<string[]>([]);
  const [migratedLessons, setMigratedLessons] = useState<NewLessonFormat[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const addLog = (message: string) => {
    setMigrationLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startMigration = async () => {
    setMigrationStatus('running');
    setMigrationLog([]);
    addLog('🚀 Starting content migration...');

    try {
      // Demo: Migrate some example lessons
      const demoLessons: OldLessonFormat[] = [
        {
          id: 'lesson-1',
          title: 'Trading Grundlagen',
          subtitle: 'Was ist Trading wirklich?',
          totalSlides: 15,
          slides: [
            {
              id: 1,
              title: 'Willkommen',
              type: 'welcome',
              content: {
                lessonGoals: [
                  'Trading verstehen',
                  'Marktmechanismen lernen',
                  'Praktische Beispiele',
                  'Wissen testen'
                ]
              }
            },
            {
              id: 2,
              title: 'Was ist Trading?',
              type: 'definition',
              content: {
                description: 'Trading ist der Kauf und Verkauf von Finanzinstrumenten.',
                keyPoints: [
                  'Gewinn durch Preisdifferenzen',
                  '24/5 Märkte',
                  'Risikomanagement essentiell'
                ]
              }
            }
          ]
        }
      ];

      for (const oldLesson of demoLessons) {
        addLog(`📚 Processing: ${oldLesson.title}`);
        const newLesson = migrateLesson(oldLesson);
        setMigratedLessons(prev => [...prev, newLesson]);
        addLog(`✅ Migrated: ${oldLesson.title} (${newLesson.slides.length} slides)`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      addLog('🎉 Migration completed successfully!');
      setMigrationStatus('completed');
    } catch (error) {
      addLog(`❌ Migration failed: ${error}`);
      setMigrationStatus('error');
    }
  };

  const downloadMigratedContent = () => {
    const content = JSON.stringify(migratedLessons, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'migrated-lessons.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Migration Tool</h1>
          <p className="text-gray-400">
            Automatisch migration von 4000+ Zeilen Trading-Lektionen in das neue Format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Migration Controls */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Migration Process</h2>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Upload Lesson Files (.jsx, .ts, .json)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Drag & drop your lesson files or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept=".jsx,.ts,.json,.js"
                  className="hidden"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                />
              </div>
            </div>

            {/* Migration Options */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Preserve TTS Scripts</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Generate Quiz Questions</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Optimize Content Structure</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>

            {/* Start Migration */}
            <button
              onClick={startMigration}
              disabled={migrationStatus === 'running'}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {migrationStatus === 'running' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Migration
                </>
              )}
            </button>

            {/* Download Results */}
            {migrationStatus === 'completed' && (
              <button
                onClick={downloadMigratedContent}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Migrated Content
              </button>
            )}
          </div>

          {/* Migration Log */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Migration Log</h2>
            
            <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
              {migrationLog.length === 0 ? (
                <p className="text-gray-400 text-sm">Migration log will appear here...</p>
              ) : (
                <div className="space-y-1">
                  {migrationLog.map((log, index) => (
                    <div key={index} className="text-xs text-gray-300 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center">
              {migrationStatus === 'idle' && (
                <div className="flex items-center text-gray-400">
                  <Database className="h-4 w-4 mr-2" />
                  Ready to migrate
                </div>
              )}
              {migrationStatus === 'running' && (
                <div className="flex items-center text-yellow-400">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Migration in progress...
                </div>
              )}
              {migrationStatus === 'completed' && (
                <div className="flex items-center text-emerald-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Migration completed successfully
                </div>
              )}
              {migrationStatus === 'error' && (
                <div className="flex items-center text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Migration failed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Migrated Content Preview */}
        {migratedLessons.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Migrated Lessons Preview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {migratedLessons.map((lesson, index) => (
                <div key={lesson.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{lesson.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      lesson.difficulty === 'Beginner' ? 'bg-green-600 text-green-100' :
                      lesson.difficulty === 'Intermediate' ? 'bg-yellow-600 text-yellow-100' :
                      'bg-red-600 text-red-100'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{lesson.subtitle}</p>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>📚 {lesson.slides.length} slides</div>
                    <div>⏱️ {lesson.estimatedTime} minutes</div>
                    <div>🎯 {lesson.objectives.length} objectives</div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-400">Slide Types:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...new Set(lesson.slides.map(s => s.type))].map(type => (
                        <span key={type} className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl p-6 border border-emerald-500/30">
          <h2 className="text-xl font-bold text-white mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</div>
              <div>
                <div className="font-medium text-white">Migrate Content</div>
                <div className="text-sm text-gray-300">Use this tool to convert your lessons</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</div>
              <div>
                <div className="font-medium text-white">Import to Database</div>
                <div className="text-sm text-gray-300">Load content into the lesson system</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</div>
              <div>
                <div className="font-medium text-white">Test & Deploy</div>
                <div className="text-sm text-gray-300">Verify lessons and go live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentMigrationTool;