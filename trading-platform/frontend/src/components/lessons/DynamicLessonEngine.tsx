import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Target,
  BarChart3,
  Activity,
  CheckCircle,
  BookOpen,
  Eye,
  PenTool,
  Lightbulb
} from 'lucide-react';

// ==========================================
// DYNAMIC LESSON RENDERER
// ==========================================

const DynamicLessonRenderer = () => {
  // Demo: Migrierte Lektion (würde aus deiner Database/JSON kommen)
  const [currentLesson] = useState({
    id: 'lesson-1',
    title: 'Trading Grundlagen',
    subtitle: 'Was ist Trading wirklich?',
    module: 'Trading Masterclass',
    difficulty: 'Beginner',
    estimatedTime: 25,
    objectives: [
      'Verstehen Sie was Trading bedeutet',
      'Lernen Sie Marktmechanismen kennen',
      'Praktische Beispiele analysieren',
      'Wissen in Tests überprüfen'
    ],
    slides: [
      {
        id: 'slide-1',
        title: 'Willkommen zur Trading Masterclass',
        subtitle: 'Ihr Weg zum erfolgreichen Trading',
        type: 'welcome',
        duration: 3,
        speechScript: 'Willkommen zu Trading Grundlagen! Heute lernen Sie die wichtigsten Konzepte des Tradings kennen. Wir starten mit den Basics und arbeiten uns zu praktischen Beispielen vor.',
        content: {
          lessonGoals: [
            'Trading verstehen',
            'Marktmechanismen lernen', 
            'Praktische Beispiele',
            'Wissen testen'
          ],
          keyTopics: ['Charts', 'Orders', 'Risiko', 'Psychologie'],
          estimatedTime: '25 minutes'
        },
        interactiveComponents: {
          hasTTS: true,
          hasCharts: false,
          hasQuiz: false,
          hasDrawingTools: false
        }
      },
      {
        id: 'slide-2',
        title: 'Was ist Trading?',
        subtitle: 'Definition und Grundlagen',
        type: 'definition',
        duration: 4,
        speechScript: 'Trading ist der Kauf und Verkauf von Finanzinstrumenten mit dem Ziel, von Preisunterschieden zu profitieren. Es ist wichtig zu verstehen, dass Trading sowohl Chancen als auch Risiken birgt.',
        content: {
          description: 'Trading ist der Kauf und Verkauf von Finanzinstrumenten (Aktien, Forex, Krypto) mit dem Ziel, von Preisunterschieden zu profitieren.',
          keyPoints: [
            'Gewinn durch Preisdifferenzen',
            'Kann long oder short sein',
            'Verschiedene Zeitrahmen möglich',
            'Risikomanagement essentiell'
          ],
          examples: [
            'Aktien: Apple bei $150 kaufen, bei $160 verkaufen',
            'Forex: EUR/USD bei 1.20 kaufen, bei 1.21 verkaufen',
            'Krypto: Bitcoin bei $40k kaufen, bei $45k verkaufen'
          ]
        },
        interactiveComponents: {
          hasTTS: true,
          hasCharts: false,
          hasQuiz: false,
          hasDrawingTools: false
        }
      },
      {
        id: 'slide-3',
        title: 'Interaktive Chart-Analyse',
        subtitle: 'Lesen Sie echte Trading-Charts',
        type: 'concept',
        duration: 5,
        speechScript: 'Jetzt schauen wir uns echte Trading-Charts an. Sie können hier Trendlinien zeichnen und Support/Resistance Levels markieren. Das ist essentiell für erfolgreiches Trading.',
        content: {
          description: 'Charts sind die wichtigste Informationsquelle für Trader. Hier lernen Sie, wie Sie Charts richtig lesen und analysieren.',
          chartData: {
            prices: [
              { time: '09:00', price: 1.2050 },
              { time: '09:30', price: 1.2075 },
              { time: '10:00', price: 1.2120 },
              { time: '10:30', price: 1.2095 },
              { time: '11:00', price: 1.2140 },
              { time: '11:30', price: 1.2165 },
              { time: '12:00', price: 1.2180 }
            ],
            instrument: 'EUR/USD',
            timeframe: '30M'
          },
          keyPoints: [
            'Trends identifizieren',
            'Support/Resistance finden',
            'Entry-Punkte erkennen',
            'Risk/Reward bewerten'
          ]
        },
        interactiveComponents: {
          hasTTS: true,
          hasCharts: true,
          hasQuiz: false,
          hasDrawingTools: true
        }
      },
      {
        id: 'slide-4',
        title: 'Quiz: Trading Wissen',
        subtitle: 'Testen Sie Ihr Verständnis',
        type: 'quiz',
        duration: 6,
        speechScript: 'Zeit für einen kleinen Test! Beantworten Sie die Fragen zu dem was Sie gelernt haben. Keine Sorge - Sie können es mehrmals versuchen.',
        content: {
          questions: [
            {
              id: 'q1',
              question: 'Was ist das Hauptziel beim Trading?',
              options: [
                'Spaß zu haben',
                'Von Preisunterschieden zu profitieren',
                'Charts zu sammeln',
                'Broker zu unterstützen'
              ],
              correct: 1,
              explanation: 'Trading zielt darauf ab, durch den Kauf niedrig und Verkauf hoch (oder umgekehrt) Profit zu erzielen.'
            },
            {
              id: 'q2', 
              question: 'Was bedeutet "Long" gehen?',
              options: [
                'Lange Trading-Sessions',
                'Instrument kaufen/bullish',
                'Instrument verkaufen/bearish',
                'Viel Zeit investieren'
              ],
              correct: 1,
              explanation: 'Long bedeutet, dass Sie ein Instrument kaufen, weil Sie steigende Preise erwarten.'
            }
          ]
        },
        interactiveComponents: {
          hasTTS: true,
          hasCharts: false,
          hasQuiz: true,
          hasDrawingTools: false
        }
      },
      {
        id: 'slide-5',
        title: 'Zusammenfassung',
        subtitle: 'Was Sie gelernt haben',
        type: 'summary',
        duration: 3,
        speechScript: 'Herzlichen Glückwunsch! Sie haben die Grundlagen des Tradings erfolgreich gemeistert. Sie wissen jetzt was Trading ist, können Charts lesen und haben Ihr Wissen getestet.',
        content: {
          keyTakeaways: [
            'Trading = Profit durch Preisunterschiede',
            'Charts sind wichtigste Informationsquelle',
            'Long = Kaufen, Short = Verkaufen',
            'Risikomanagement ist essentiell'
          ],
          nextSteps: [
            'Lektion 2: Order-Types verstehen',
            'Lektion 3: Risikomanagement',
            'Lektion 4: Trading-Psychologie'
          ]
        },
        interactiveComponents: {
          hasTTS: true,
          hasCharts: false,
          hasQuiz: false,
          hasDrawingTools: false
        }
      }
    ]
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawnLines, setDrawnLines] = useState([]);
  
  const audioRef = useRef(null);
  const currentSlide = currentLesson.slides[currentSlideIndex];

  // TTS Functionality
  const speakText = (text) => {
    if (!text || isMuted) return;
    
    // Web Speech API für TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Navigation
  const nextSlide = () => {
    if (currentSlideIndex < currentLesson.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      stopSpeech();
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      stopSpeech();
    }
  };

  // Auto-play TTS when slide changes
  useEffect(() => {
    if (currentSlide.speechScript && !isMuted) {
      setTimeout(() => speakText(currentSlide.speechScript), 1000);
    }
  }, [currentSlideIndex, currentSlide.speechScript, isMuted]);

  // ==========================================
  // SLIDE RENDERERS (Based on type)
  // ==========================================

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case 'welcome':
        return <WelcomeSlide slide={currentSlide} />;
      case 'definition':
        return <DefinitionSlide slide={currentSlide} />;
      case 'concept':
        return <ConceptSlide slide={currentSlide} drawingMode={drawingMode} setDrawingMode={setDrawingMode} drawnLines={drawnLines} setDrawnLines={setDrawnLines} />;
      case 'quiz':
        return <QuizSlide slide={currentSlide} answers={quizAnswers} setAnswers={setQuizAnswers} />;
      case 'summary':
        return <SummarySlide slide={currentSlide} />;
      default:
        return <DefaultSlide slide={currentSlide} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            <p className="text-gray-400">{currentLesson.subtitle}</p>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Slide {currentSlideIndex + 1} von {currentLesson.slides.length}
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / currentLesson.slides.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Audio Controls */}
          {currentSlide.interactiveComponents.hasTTS && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => isPlaying ? stopSpeech() : speakText(currentSlide.speechScript)}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-xl p-8 min-h-[600px]">
          {renderSlideContent()}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </button>
          
          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {currentLesson.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlideIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === currentLesson.slides.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Weiter
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SLIDE COMPONENTS
// ==========================================

const WelcomeSlide = ({ slide }) => (
  <div className="space-y-8 text-center">
    <div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
        {slide.title}
      </h1>
      <h2 className="text-2xl text-gray-300">{slide.subtitle}</h2>
    </div>
    
    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center justify-center gap-2">
        <Target className="w-6 h-6" />
        Lektionsziele
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slide.content.lessonGoals?.map((goal, index) => (
          <div key={index} className="bg-blue-600/30 rounded-lg p-3">
            <span className="text-blue-200">{goal}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-6">
        <h4 className="text-lg font-bold text-purple-400 mb-4">📚 Kern-Themen</h4>
        <div className="space-y-2">
          {slide.content.keyTopics?.map((topic, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-purple-400">•</span>
              <span className="text-purple-200">{topic}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-green-500/20 border border-green-500 rounded-xl p-6">
        <h4 className="text-lg font-bold text-green-400 mb-4">⏱️ Zeitplanung</h4>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{slide.content.estimatedTime}</div>
          <div className="text-green-200">Geschätzte Dauer</div>
        </div>
      </div>
    </div>
  </div>
);

const DefinitionSlide = ({ slide }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-4xl font-bold text-blue-400 mb-4">{slide.title}</h2>
      <h3 className="text-xl text-gray-300">{slide.subtitle}</h3>
    </div>
    
    <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-6">
      <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Definition
      </h4>
      <p className="text-blue-200 text-lg leading-relaxed">{slide.content.description}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/10 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">🔑 Wichtige Punkte</h4>
        <div className="space-y-3">
          {slide.content.keyPoints?.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{point}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">💡 Beispiele</h4>
        <div className="space-y-3">
          {slide.content.examples?.map((example, index) => (
            <div key={index} className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
              <span className="text-yellow-200 text-sm">{example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ConceptSlide = ({ slide, drawingMode, setDrawingMode, drawnLines, setDrawnLines }) => {
  const svgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);

  const handleMouseDown = (e) => {
    if (!drawingMode) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ startX: x, startY: y, endX: x, endY: y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentLine) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine(prev => ({ ...prev, endX: x, endY: y }));
  };

  const handleMouseUp = () => {
    if (currentLine) {
      setDrawnLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
    setIsDrawing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-blue-400 mb-4">{slide.title}</h2>
        <h3 className="text-xl text-gray-300">{slide.subtitle}</h3>
      </div>
      
      <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4">
        <p className="text-blue-200 mb-4">{slide.content.description}</p>
        
        {slide.interactiveComponents.hasDrawingTools && (
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setDrawingMode(!drawingMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                drawingMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              <PenTool className="w-4 h-4" />
              {drawingMode ? 'Drawing aktiv' : 'Trendlinien zeichnen'}
            </button>
            <button
              onClick={() => setDrawnLines([])}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Löschen
            </button>
          </div>
        )}
        
        {slide.interactiveComponents.hasCharts && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-bold mb-4">{slide.content.chartData?.instrument} Chart</h4>
            <svg
              ref={svgRef}
              className="w-full h-64 bg-black rounded cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Price Line */}
              {slide.content.chartData?.prices && (
                <polyline
                  points={slide.content.chartData.prices.map((point, index) => 
                    `${(index / (slide.content.chartData.prices.length - 1)) * 800},${256 - ((point.price - 1.2050) * 2000)}`
                  ).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              )}
              
              {/* Drawn Lines */}
              {drawnLines.map((line, index) => (
                <line
                  key={index}
                  x1={line.startX}
                  y1={line.startY}
                  x2={line.endX}
                  y2={line.endY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              ))}
              
              {/* Current Line */}
              {currentLine && (
                <line
                  x1={currentLine.startX}
                  y1={currentLine.startY}
                  x2={currentLine.endX}
                  y2={currentLine.endY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slide.content.keyPoints?.map((point, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-white">Tipp {index + 1}</span>
            </div>
            <p className="text-gray-300">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizSlide = ({ slide, answers, setAnswers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const question = slide.content.questions?.[currentQuestion];

  const handleAnswer = (questionId, selectedIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < slide.content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowResult(false);
    }
  };

  if (!question) return <div>Keine Fragen verfügbar</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-blue-400 mb-4">{slide.title}</h2>
        <h3 className="text-xl text-gray-300">{slide.subtitle}</h3>
      </div>
      
      <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-purple-400">
            Frage {currentQuestion + 1} von {slide.content.questions.length}
          </h4>
          <div className="text-sm text-gray-400">
            {Math.round(((currentQuestion + 1) / slide.content.questions.length) * 100)}% abgeschlossen
          </div>
        </div>
        
        <h5 className="text-xl text-white mb-6">{question.question}</h5>
        
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = answers[question.id] === index;
            const isCorrect = question.correct === index;
            const showCorrectness = showResult && isSelected;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showCorrectness
                    ? isCorrect
                      ? 'border-green-500 bg-green-500/20 text-green-200'
                      : 'border-red-500 bg-red-500/20 text-red-200'
                    : isSelected
                    ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                  {showCorrectness && isCorrect && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                </div>
              </button>
            );
          })}
        </div>
        
        {showResult && (
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
            <h6 className="font-bold text-blue-400 mb-2">Erklärung:</h6>
            <p className="text-blue-200">{question.explanation}</p>
            
            {currentQuestion < slide.content.questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nächste Frage
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SummarySlide = ({ slide }) => (
  <div className="space-y-8 text-center">
    <div>
      <h2 className="text-4xl font-bold text-green-400 mb-4">{slide.title}</h2>
      <h3 className="text-xl text-gray-300">{slide.subtitle}</h3>
    </div>
    
    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6">
      <h4 className="text-lg font-bold text-green-400 mb-4">🎯 Wichtigste Erkenntnisse</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slide.content.keyTakeaways?.map((takeaway, index) => (
          <div key={index} className="bg-green-600/30 rounded-lg p-3">
            <span className="text-green-200">{takeaway}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-6">
      <h4 className="text-lg font-bold text-blue-400 mb-4">🚀 Nächste Schritte</h4>
      <div className="space-y-3">
        {slide.content.nextSteps?.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <span className="text-blue-200">{step}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DefaultSlide = ({ slide }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-4xl font-bold text-white mb-4">{slide.title}</h2>
      <h3 className="text-xl text-gray-300">{slide.subtitle}</h3>
    </div>
    
    <div className="bg-white/10 rounded-xl p-6">
      <p className="text-gray-300 text-lg">
        Content für Slide-Type "{slide.type}" wird geladen...
      </p>
      <pre className="mt-4 text-xs text-gray-400">
        {JSON.stringify(slide.content, null, 2)}
      </pre>
    </div>
  </div>
);

export default DynamicLessonRenderer;