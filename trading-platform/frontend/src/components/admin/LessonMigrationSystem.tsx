import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Database,
  Zap,
  ArrowRight,
  Play,
  PauseCircle,
  Eye,
  Code,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';

// ==========================================
// LEGACY CONTENT DETECTOR & EXTRACTOR
// ==========================================

const LessonMigrationSystem = () => {
  const [migrationStatus, setMigrationStatus] = useState('idle');
  const [migrationLog, setMigrationLog] = useState([]);
  const [extractedLessons, setExtractedLessons] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const fileInputRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setMigrationLog(prev => [...prev, { 
      time: timestamp, 
      message, 
      type 
    }]);
  };

  // ==========================================
  // INTELLIGENT CONTENT EXTRACTION
  // ==========================================

  const extractLessonData = (fileContent, fileName) => {
    try {
      addLog(`🔍 Analysiere ${fileName}...`, 'info');

      // Suche nach lesson1Data, lesson2Data, etc.
      const lessonDataRegex = /(lesson\d+Data)\s*=\s*({[\s\S]*?});/g;
      const matches = [];
      let match;

      while ((match = lessonDataRegex.exec(fileContent)) !== null) {
        const variableName = match[1];
        const dataString = match[2];
        
        try {
          // Versuche JSON.parse (falls valid JSON)
          const lessonData = eval(`(${dataString})`);
          matches.push({
            variableName,
            lessonData,
            sourceFile: fileName
          });
          addLog(`✅ Gefunden: ${variableName} mit ${lessonData.slides?.length || 0} Slides`, 'success');
        } catch (e) {
          addLog(`⚠️ Fehler beim Parsen von ${variableName}: ${e.message}`, 'warning');
        }
      }

      // Suche nach slides Array direkt
      const slidesRegex = /slides\s*:\s*\[([\s\S]*?)\]/g;
      const slidesMatch = slidesRegex.exec(fileContent);
      
      if (slidesMatch && matches.length === 0) {
        addLog(`🔍 Versuche direkte Slides-Extraktion...`, 'info');
        // Fallback für direkte slides Arrays
      }

      return matches;
    } catch (error) {
      addLog(`❌ Fehler beim Extrahieren aus ${fileName}: ${error.message}`, 'error');
      return [];
    }
  };

  // ==========================================
  // SLIDE TYPE MAPPING & CONVERSION
  // ==========================================

  const mapSlideType = (originalType) => {
    const typeMapping = {
      'intro': 'welcome',
      'welcome': 'welcome', 
      'definition': 'definition',
      'concept': 'concept',
      'chart-basics': 'concept',
      'market-structure': 'concept',
      'breakout-setup': 'example',
      'reversal-setup': 'example',
      'order-flow': 'concept',
      'zero-sum-detailed': 'concept',
      'spread-analysis': 'concept',
      'fee-structure': 'concept',
      'broker-comparison': 'example',
      'cost-calculation': 'example',
      'quiz': 'quiz',
      'final-quiz': 'quiz',
      'summary': 'summary',
      'preview': 'summary'
    };

    return typeMapping[originalType] || 'concept';
  };

  // ==========================================
  // INTERACTIVE COMPONENT EXTRACTION
  // ==========================================

  const extractInteractiveComponents = (slide) => {
    const components = {
      hasCharts: false,
      hasDrawingTools: false,
      hasQuiz: false,
      hasTTS: false,
      hasInteractiveSetup: false,
      extractedData: {}
    };

    // TTS Detection
    if (slide.speechScript && slide.speechScript.length > 0) {
      components.hasTTS = true;
      components.extractedData.tts = {
        script: slide.speechScript,
        language: 'de-DE',
        voice: 'neural'
      };
    }

    // Chart Detection
    if (slide.content?.charts || slide.content?.chartTypes || slide.content?.interactiveChart) {
      components.hasCharts = true;
      components.extractedData.charts = slide.content.charts || slide.content.chartTypes;
    }

    // Drawing Tools Detection
    if (slide.type?.includes('setup') || slide.content?.drawingEnabled) {
      components.hasDrawingTools = true;
      components.extractedData.drawing = {
        enabled: true,
        tools: ['trendline', 'support', 'resistance']
      };
    }

    // Quiz Detection
    if (slide.type?.includes('quiz') || slide.content?.questions) {
      components.hasQuiz = true;
      components.extractedData.quiz = slide.content.questions || slide.content.quiz;
    }

    // Interactive Setup Detection
    if (slide.type?.includes('setup') || slide.content?.setupType) {
      components.hasInteractiveSetup = true;
      components.extractedData.setup = {
        type: slide.content.setupType || slide.type,
        interactive: true
      };
    }

    return components;
  };

  // ==========================================
  // MODERN LESSON STRUCTURE GENERATOR
  // ==========================================

  const generateModernLesson = (legacyLesson) => {
    addLog(`🔄 Konvertiere ${legacyLesson.variableName}...`, 'info');

    const modernLesson = {
      id: legacyLesson.lessonData.id || legacyLesson.variableName,
      title: legacyLesson.lessonData.title || 'Trading Lektion',
      subtitle: legacyLesson.lessonData.subtitle || '',
      module: 'Trading Masterclass',
      difficulty: determineDifficulty(legacyLesson.lessonData),
      estimatedTime: Math.max(20, (legacyLesson.lessonData.slides?.length || 10) * 3),
      objectives: extractObjectives(legacyLesson.lessonData),
      slides: [],
      metadata: {
        sourceFile: legacyLesson.sourceFile,
        migrationDate: new Date().toISOString(),
        originalSlideCount: legacyLesson.lessonData.slides?.length || 0,
        interactiveComponents: 0,
        ttsEnabled: false
      }
    };

    // Slides konvertieren
    if (legacyLesson.lessonData.slides) {
      legacyLesson.lessonData.slides.forEach((slide, index) => {
        const components = extractInteractiveComponents(slide);
        
        const modernSlide = {
          id: `slide-${index + 1}`,
          title: slide.title || `Slide ${index + 1}`,
          subtitle: slide.subtitle || '',
          type: mapSlideType(slide.type),
          duration: estimateDuration(slide, components),
          content: transformSlideContent(slide.content, components),
          speechScript: slide.speechScript || '',
          interactiveComponents: components,
          originalType: slide.type
        };

        modernLesson.slides.push(modernSlide);

        // Metadata updates
        if (components.hasTTS) modernLesson.metadata.ttsEnabled = true;
        if (Object.values(components).some(c => c === true)) {
          modernLesson.metadata.interactiveComponents++;
        }
      });
    }

    addLog(`✅ Konvertiert: ${modernLesson.slides.length} Slides mit ${modernLesson.metadata.interactiveComponents} interaktiven Komponenten`, 'success');
    return modernLesson;
  };

  const transformSlideContent = (originalContent, components) => {
    const transformed = {
      ...originalContent,
      // Standardisierte Struktur
      description: originalContent.description || '',
      keyPoints: originalContent.keyPoints || [],
      examples: originalContent.examples || [],
    };

    // Interaktive Komponenten hinzufügen
    if (components.hasCharts) {
      transformed.charts = components.extractedData.charts;
    }

    if (components.hasQuiz) {
      transformed.quiz = components.extractedData.quiz;
    }

    if (components.hasTTS) {
      transformed.audio = components.extractedData.tts;
    }

    if (components.hasDrawingTools) {
      transformed.drawing = components.extractedData.drawing;
    }

    return transformed;
  };

  const determineDifficulty = (lesson) => {
    const title = (lesson.title || '').toLowerCase();
    if (title.includes('grundlagen') || title.includes('einführung') || title.includes('basics')) {
      return 'Beginner';
    }
    if (title.includes('advanced') || title.includes('expert') || title.includes('professional')) {
      return 'Advanced';
    }
    return 'Intermediate';
  };

  const extractObjectives = (lesson) => {
    // Versuche aus verschiedenen Quellen zu extrahieren
    if (lesson.objectives) return lesson.objectives;
    if (lesson.slides?.[0]?.content?.lessonGoals) return lesson.slides[0].content.lessonGoals;
    if (lesson.goals) return lesson.goals;

    // Fallback
    return [
      `Verstehen Sie ${lesson.title || 'die Trading-Konzepte'}`,
      'Praktische Anwendung der Methoden',
      'Interaktive Übungen durchführen',
      'Wissen in Tests überprüfen'
    ];
  };

  const estimateDuration = (slide, components) => {
    let baseDuration = 3; // 3 Minuten Basis

    // TTS Script Länge
    if (components.hasTTS && slide.speechScript) {
      baseDuration += Math.ceil(slide.speechScript.length / 200); // ~200 Zeichen pro Minute
    }

    // Interaktive Komponenten
    if (components.hasCharts) baseDuration += 2;
    if (components.hasDrawingTools) baseDuration += 3;
    if (components.hasQuiz) baseDuration += 4;
    if (components.hasInteractiveSetup) baseDuration += 3;

    return Math.min(baseDuration, 15); // Max 15 Minuten
  };

  // ==========================================
  // FILE UPLOAD & PROCESSING
  // ==========================================

  const handleFileUpload = async (files) => {
    setSelectedFiles(Array.from(files));
    setMigrationStatus('analyzing');
    setMigrationLog([]);
    
    addLog('🚀 Starte intelligente Content-Analyse...', 'info');

    try {
      const allExtractedLessons = [];

      for (const file of files) {
        addLog(`📁 Lese ${file.name}...`, 'info');
        
        const content = await file.text();
        const extractedData = extractLessonData(content, file.name);
        
        for (const lessonData of extractedData) {
          const modernLesson = generateModernLesson(lessonData);
          allExtractedLessons.push(modernLesson);
        }
      }

      setExtractedLessons(allExtractedLessons);
      setMigrationStatus('completed');
      
      addLog(`🎉 Migration abgeschlossen! ${allExtractedLessons.length} Lektionen erfolgreich konvertiert.`, 'success');
      
    } catch (error) {
      addLog(`❌ Migration fehlgeschlagen: ${error.message}`, 'error');
      setMigrationStatus('error');
    }
  };

  // ==========================================
  // EXPORT FUNCTIONS
  // ==========================================

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalLessons: extractedLessons.length,
        totalSlides: extractedLessons.reduce((sum, l) => sum + l.slides.length, 0),
        version: '2.0'
      },
      lessons: extractedLessons
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migrated-lessons-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToSQL = () => {
    let sql = `-- Migrated Lessons SQL\n-- Generated: ${new Date().toISOString()}\n\n`;
    
    extractedLessons.forEach((lesson, index) => {
      sql += `-- Lesson ${index + 1}: ${lesson.title}\n`;
      sql += `INSERT INTO lessons (id, title, subtitle, module, difficulty, estimated_time, objectives, created_at) VALUES (\n`;
      sql += `  '${lesson.id}',\n`;
      sql += `  '${lesson.title.replace(/'/g, "''")}',\n`;
      sql += `  '${lesson.subtitle.replace(/'/g, "''")}',\n`;
      sql += `  '${lesson.module}',\n`;
      sql += `  '${lesson.difficulty}',\n`;
      sql += `  ${lesson.estimatedTime},\n`;
      sql += `  '${JSON.stringify(lesson.objectives).replace(/'/g, "''")}',\n`;
      sql += `  NOW()\n);\n\n`;

      lesson.slides.forEach((slide, slideIndex) => {
        sql += `INSERT INTO slides (lesson_id, slide_order, title, type, duration, content, speech_script) VALUES (\n`;
        sql += `  '${lesson.id}',\n`;
        sql += `  ${slideIndex + 1},\n`;
        sql += `  '${slide.title.replace(/'/g, "''")}',\n`;
        sql += `  '${slide.type}',\n`;
        sql += `  ${slide.duration},\n`;
        sql += `  '${JSON.stringify(slide.content).replace(/'/g, "''")}',\n`;
        sql += `  '${(slide.speechScript || '').replace(/'/g, "''")}'\n);\n`;
      });
      
      sql += '\n';
    });

    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migrated-lessons-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // UI COMPONENTS
  // ==========================================

  const StatusBadge = ({ status }) => {
    const styles = {
      idle: 'bg-gray-600 text-gray-300',
      analyzing: 'bg-yellow-600 text-yellow-200 animate-pulse',
      completed: 'bg-green-600 text-green-200',
      error: 'bg-red-600 text-red-200'
    };

    const icons = {
      idle: Database,
      analyzing: RefreshCw,
      completed: CheckCircle,
      error: AlertTriangle
    };

    const Icon = icons[status];

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full ${styles[status]}`}>
        <Icon className={`w-4 h-4 mr-2 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
        {status === 'idle' && 'Bereit für Migration'}
        {status === 'analyzing' && 'Analysiere Content...'}
        {status === 'completed' && 'Migration Erfolgreich'}
        {status === 'error' && 'Migration Fehlgeschlagen'}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Intelligente Lektions-Migration
          </h1>
          <p className="text-gray-400 text-lg">
            Automatische Konvertierung deiner 4000+ Zeilen Trading-Lektionen in das moderne Format
          </p>
          <div className="mt-4">
            <StatusBadge status={migrationStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Upload & Controls */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">📁 Datei-Upload</h2>
              
              {/* Drag & Drop Zone */}
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 font-medium mb-2">
                  Lektionen-Dateien hier ziehen
                </p>
                <p className="text-gray-500 text-sm">
                  Unterstützt: .jsx, .js, .ts, .tsx
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jsx,.js,.ts,.tsx"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white font-medium mb-2">Ausgewählte Dateien:</h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{file.name}</span>
                          <span className="text-gray-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Migration Options */}
              <div className="mt-6 space-y-4">
                <h3 className="text-white font-medium">Migrations-Optionen:</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded mr-3" />
                    <span className="text-gray-300 text-sm">TTS Scripts beibehalten</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded mr-3" />
                    <span className="text-gray-300 text-sm">Interaktive Komponenten</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded mr-3" />
                    <span className="text-gray-300 text-sm">Quiz-Systeme</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded mr-3" />
                    <span className="text-gray-300 text-sm">Chart-Tools</span>
                  </label>
                </div>
              </div>

              {/* Export Buttons */}
              {extractedLessons.length > 0 && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={exportToJSON}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export als JSON
                  </button>
                  <button
                    onClick={exportToSQL}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export als SQL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Migration Log */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">📋 Migration Log</h2>
              
              <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
                {migrationLog.length === 0 ? (
                  <p className="text-gray-400 text-sm">Migration-Log erscheint hier...</p>
                ) : (
                  <div className="space-y-2">
                    {migrationLog.map((log, index) => (
                      <div key={index} className="text-xs">
                        <span className="text-gray-500 mr-2">{log.time}</span>
                        <span className={`${
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          log.type === 'success' ? 'text-green-400' :
                          'text-gray-300'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statistics */}
              {extractedLessons.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-600/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {extractedLessons.length}
                    </div>
                    <div className="text-blue-300 text-xs">Lektionen</div>
                  </div>
                  <div className="bg-green-600/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {extractedLessons.reduce((sum, l) => sum + l.slides.length, 0)}
                    </div>
                    <div className="text-green-300 text-xs">Slides</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">👁️ Preview</h2>
                {extractedLessons.length > 0 && (
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
              </div>

              {extractedLessons.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Keine migrierten Lektionen verfügbar</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {extractedLessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedPreview(selectedPreview === index ? null : index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white text-sm">{lesson.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          lesson.difficulty === 'Beginner' ? 'bg-green-600 text-green-100' :
                          lesson.difficulty === 'Intermediate' ? 'bg-yellow-600 text-yellow-100' :
                          'bg-red-600 text-red-100'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-xs mb-3">{lesson.subtitle}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>📚 {lesson.slides.length} Slides</div>
                        <div>⏱️ {lesson.estimatedTime} Min</div>
                        <div>🎯 {lesson.objectives.length} Ziele</div>
                        <div>⚡ {lesson.metadata.interactiveComponents} Interactive</div>
                      </div>

                      {selectedPreview === index && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <h4 className="text-white text-xs font-medium mb-2">Slides:</h4>
                          <div className="space-y-1">
                            {lesson.slides.slice(0, 5).map((slide, sIndex) => (
                              <div key={sIndex} className="bg-gray-800 rounded p-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300 text-xs">{slide.title}</span>
                                  <div className="flex items-center gap-1">
                                    {slide.interactiveComponents.hasTTS && <span className="text-blue-400">🎵</span>}
                                    {slide.interactiveComponents.hasCharts && <span className="text-green-400">📊</span>}
                                    {slide.interactiveComponents.hasQuiz && <span className="text-purple-400">❓</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {lesson.slides.length > 5 && (
                              <div className="text-gray-400 text-xs text-center">
                                ... und {lesson.slides.length - 5} weitere Slides
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {extractedLessons.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">🚀 Nächste Schritte</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</div>
                <div>
                  <div className="font-medium text-white text-sm">Migration ✅</div>
                  <div className="text-xs text-gray-300">Content erfolgreich konvertiert</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</div>
                <div>
                  <div className="font-medium text-white text-sm">Database Import</div>
                  <div className="text-xs text-gray-300">SQL ausführen oder JSON importieren</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</div>
                <div>
                  <div className="font-medium text-white text-sm">Integration testen</div>
                  <div className="text-xs text-gray-300">Lektionen in der App prüfen</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</div>
                <div>
                  <div className="font-medium text-white text-sm">Go Live!</div>
                  <div className="text-xs text-gray-300">Neue Lektionen deployen</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonMigrationSystem;