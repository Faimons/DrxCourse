// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\LessonDemo.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause, 
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  Target,
  AlertTriangle,
  Lightbulb,
  Calculator,
  TrendingUp,
  FileText,
  Video,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface LessonSection {
  id: string;
  title: string;
  type: 'concept' | 'example' | 'exercise' | 'video' | 'quiz';
  duration: number;
  content: {
    title: string;
    description?: string;
    keyPoints?: string[];
    example?: {
      scenario: string;
      calculation: string;
      result: string;
    };
    quiz?: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };
    exercise?: {
      task: string;
      steps: string[];
      solution: string;
    };
  };
}

const LessonDemo = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResult, setShowQuizResult] = useState<{[key: string]: boolean}>({});
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Lektion 1: Trading Grundlagen - Professionell strukturiert
  const lessonData = {
    id: 1,
    title: 'Trading Fundamentals',
    subtitle: 'Foundation for Successful Trading',
    module: 'Module 1: Basics',
    duration: 25,
    difficulty: 'Beginner' as const,
    description: 'Learn the essential concepts and terminology needed to start trading financial markets.',
    objectives: [
      'Understand what trading is and how markets work',
      'Learn key trading terminology and concepts',
      'Identify different market participants and their roles',
      'Calculate basic profit and loss scenarios'
    ]
  };

  const sections: LessonSection[] = [
    {
      id: 'intro',
      title: 'What is Trading?',
      type: 'concept',
      duration: 3,
      content: {
        title: 'Understanding Financial Trading',
        description: 'Trading is the act of buying and selling financial instruments with the goal of generating profit from price movements.',
        keyPoints: [
          'Trading involves buying low and selling high (or selling high and buying low)',
          'Profits come from price differences between entry and exit points',
          'Markets operate 24/5 for forex, with specific hours for stocks',
          'Risk management is essential for long-term success'
        ]
      }
    },
    {
      id: 'market-participants',
      title: 'Who Trades the Markets?',
      type: 'concept',
      duration: 4,
      content: {
        title: 'Market Participants',
        keyPoints: [
          'Retail Traders: Individual investors trading personal accounts',
          'Institutional Traders: Banks, hedge funds, pension funds',
          'Market Makers: Provide liquidity by offering buy/sell prices',
          'Central Banks: Influence currency values through monetary policy'
        ]
      }
    },
    {
      id: 'basic-example',
      title: 'Simple Trading Example',
      type: 'example',
      duration: 5,
      content: {
        title: 'EUR/USD Trading Example',
        example: {
          scenario: 'You believe the Euro will strengthen against the US Dollar',
          calculation: 'Buy EUR/USD at 1.1000, Sell at 1.1050 with 1 standard lot (100,000 units)',
          result: 'Profit = (1.1050 - 1.1000) × 100,000 = $500'
        }
      }
    },
    {
      id: 'terminology',
      title: 'Essential Terminology',
      type: 'concept',
      duration: 6,
      content: {
        title: 'Key Trading Terms',
        keyPoints: [
          'Pip: Smallest price movement (0.0001 for most currency pairs)',
          'Spread: Difference between bid (sell) and ask (buy) prices',
          'Leverage: Borrowing capital to increase potential returns',
          'Margin: Required deposit to open a leveraged position',
          'Long: Buying a currency expecting it to rise',
          'Short: Selling a currency expecting it to fall'
        ]
      }
    },
    {
      id: 'quiz-1',
      title: 'Knowledge Check',
      type: 'quiz',
      duration: 3,
      content: {
        title: 'Test Your Understanding',
        quiz: {
          question: 'If you buy EUR/USD at 1.1000 and sell at 1.0950, what happened?',
          options: [
            'You made a profit of 50 pips',
            'You made a loss of 50 pips', 
            'You broke even',
            'Not enough information'
          ],
          correct: 1,
          explanation: 'You sold at a lower price than you bought, resulting in a loss of 50 pips (1.1000 - 1.0950 = 0.0050 = 50 pips).'
        }
      }
    },
    {
      id: 'exercise',
      title: 'Practice Calculation',
      type: 'exercise',
      duration: 4,
      content: {
        title: 'Calculate Your Profit/Loss',
        exercise: {
          task: 'Calculate the profit/loss for this trade scenario',
          steps: [
            'Trade: Buy GBP/USD at 1.2500',
            'Exit: Sell GBP/USD at 1.2580', 
            'Position size: 0.1 lots (10,000 units)',
            'Calculate the result in USD'
          ],
          solution: 'Profit = (1.2580 - 1.2500) × 10,000 = $80'
        }
      }
    }
  ];

  const currentSectionData = sections[currentSection];

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      setCurrentSection(currentSection + 1);
    } else {
      setLessonCompleted(true);
      setCompletedSections(prev => new Set([...prev, currentSection]));
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = (sectionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [sectionId]: answerIndex }));
    setShowQuizResult(prev => ({ ...prev, [sectionId]: true }));
  };

  const getProgressPercentage = () => {
    return Math.round(((completedSections.size + (lessonCompleted ? 1 : 0)) / sections.length) * 100);
  };

  const renderSectionContent = () => {
    const section = currentSectionData;
    
    switch (section.type) {
      case 'concept':
        return (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-6 w-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-white">{section.content.title}</h3>
              </div>
              
              {section.content.description && (
                <p className="text-gray-300 text-lg mb-4">{section.content.description}</p>
              )}
              
              {section.content.keyPoints && (
                <div className="space-y-3">
                  {section.content.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Calculator className="h-6 w-6 text-emerald-400 mr-3" />
                <h3 className="text-xl font-bold text-white">{section.content.title}</h3>
              </div>
              
              {section.content.example && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-400 mb-2">Scenario:</h4>
                    <p className="text-gray-300">{section.content.example.scenario}</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Calculation:</h4>
                    <p className="text-gray-300 font-mono">{section.content.example.calculation}</p>
                  </div>
                  
                  <div className="bg-emerald-600/20 rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-400 mb-2">Result:</h4>
                    <p className="text-white text-lg font-semibold">{section.content.example.result}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="h-6 w-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">{section.content.title}</h3>
              </div>
              
              {section.content.quiz && (
                <div className="space-y-4">
                  <h4 className="text-lg text-white font-medium">{section.content.quiz.question}</h4>
                  
                  <div className="space-y-2">
                    {section.content.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(section.id, index)}
                        disabled={showQuizResult[section.id]}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          showQuizResult[section.id]
                            ? index === section.content.quiz!.correct
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                              : quizAnswers[section.id] === index
                              ? 'bg-red-600/20 border-red-500 text-red-300'
                              : 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {showQuizResult[section.id] && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                      <h5 className="font-semibold text-blue-400 mb-2">Explanation:</h5>
                      <p className="text-gray-300">{section.content.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-yellow-400 mr-3" />
                <h3 className="text-xl font-bold text-white">{section.content.title}</h3>
              </div>
              
              {section.content.exercise && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Task:</h4>
                    <p className="text-gray-300">{section.content.exercise.task}</p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-3">Steps:</h4>
                    <ol className="space-y-2">
                      {section.content.exercise.steps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-blue-600 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-300">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <details className="bg-emerald-600/20 rounded-lg">
                    <summary className="p-4 cursor-pointer font-semibold text-emerald-400">
                      Show Solution
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-white font-mono text-lg">{section.content.exercise.solution}</p>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/app/course" className="text-gray-400 hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="text-sm text-emerald-400">{lessonData.module}</div>
                <h1 className="text-xl font-bold text-white">{lessonData.title}</h1>
                <div className="text-sm text-gray-400">{lessonData.subtitle}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {currentSection + 1} / {sections.length}
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-sm text-emerald-400 font-medium">
                {getProgressPercentage()}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        
        {/* Table of Contents Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Lesson Overview</h3>
            
            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Learning Objectives</h4>
              <div className="space-y-2">
                {lessonData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <Target className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Sections</h4>
              <div className="space-y-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSection === index
                        ? 'bg-emerald-600 text-white'
                        : completedSections.has(index)
                        ? 'bg-emerald-600/20 text-emerald-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {section.type === 'concept' && <BookOpen className="h-4 w-4 mr-2" />}
                        {section.type === 'example' && <Calculator className="h-4 w-4 mr-2" />}
                        {section.type === 'quiz' && <HelpCircle className="h-4 w-4 mr-2" />}
                        {section.type === 'exercise' && <Target className="h-4 w-4 mr-2" />}
                        {section.type === 'video' && <Video className="h-4 w-4 mr-2" />}
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {completedSections.has(index) && (
                          <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                        )}
                        <span className="text-xs text-gray-400">{section.duration}m</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentSectionData.title}</h2>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{currentSectionData.duration} minutes</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{currentSectionData.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Content */}
            {renderSectionContent()}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Section Progress</div>
                <div className="flex space-x-1">
                  {sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentSection
                          ? 'bg-emerald-400'
                          : completedSections.has(index)
                          ? 'bg-emerald-600'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {lessonCompleted ? (
                <Link
                  to="/app/course"
                  className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Lesson
                </Link>
              ) : (
                <button
                  onClick={handleNextSection}
                  className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {currentSection === sections.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDemo;