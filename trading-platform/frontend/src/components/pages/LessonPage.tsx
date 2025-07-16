// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\LessonPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Award,
  FileText,
  Video,
  HelpCircle,
  ExternalLink,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  moduleTitle: string;
  lessonNumber: number;
  hasVideo: boolean;
  hasQuiz: boolean;
  content: {
    sections: ContentSection[];
    quiz?: Quiz;
    resources: Resource[];
    brokerRecommendations: BrokerRecommendation[];
  };
  nextLessonId?: number;
  previousLessonId?: number;
}

interface ContentSection {
  id: string;
  type: 'text' | 'video' | 'image' | 'callout' | 'exercise' | 'broker-setup';
  title?: string;
  content: string;
  calloutType?: 'info' | 'warning' | 'tip' | 'important';
  videoUrl?: string;
  imageUrl?: string;
  exerciseSteps?: string[];
}

interface Quiz {
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Resource {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'link' | 'tool';
}

interface BrokerRecommendation {
  name: string;
  description: string;
  affiliateUrl: string;
  relevance: string;
  rating: number;
  features: string[];
}

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    loadLessonData();
  }, [lessonId]);

  const loadLessonData = async () => {
    setLoading(true);
    try {
      // Mock lesson data - replace with real API call
      const mockLesson: LessonContent = {
        id: parseInt(lessonId || '1'),
        title: 'Risk Management Fundamentals',
        description: 'Learn how to protect your capital and manage trading risk effectively.',
        duration: 25,
        difficulty: 'Intermediate',
        moduleTitle: 'Risk Management',
        lessonNumber: 1,
        hasVideo: true,
        hasQuiz: true,
        content: {
          sections: [
            {
              id: 'intro',
              type: 'text',
              title: 'What is Risk Management?',
              content: `Risk management is the most important skill in trading. It's not about making money - it's about **not losing money**. Professional traders understand that protecting capital is more important than making profits.

In this lesson, you'll learn:
- How to calculate position sizes
- Setting effective stop losses  
- Understanding risk-reward ratios
- Portfolio diversification strategies

Remember: **You can't control the market, but you can control your risk.**`
            },
            {
              id: 'video',
              type: 'video',
              title: 'Position Sizing Strategy',
              content: 'Watch this video to understand how professional traders calculate their position sizes.',
              videoUrl: 'https://example.com/video'
            },
            {
              id: 'callout-tip',
              type: 'callout',
              calloutType: 'tip',
              title: 'Pro Tip',
              content: 'Never risk more than 1-2% of your account on a single trade. This is the golden rule that separates professionals from amateurs.'
            },
            {
              id: 'position-sizing',
              type: 'text',
              title: 'Position Sizing Formula',
              content: `The basic position sizing formula is:

**Position Size = (Account Balance × Risk %) ÷ (Entry Price - Stop Loss)**

For example:
- Account Balance: $10,000
- Risk per trade: 2% ($200)
- Entry Price: $100
- Stop Loss: $95
- Risk per share: $5

Position Size = $200 ÷ $5 = 40 shares

This ensures you never lose more than your predetermined risk amount.`
            },
            {
              id: 'exercise',
              type: 'exercise',
              title: 'Practice Exercise',
              content: 'Calculate the position size for the following scenario:',
              exerciseSteps: [
                'Account Balance: $5,000',
                'Risk tolerance: 1.5%',
                'Stock price: $50',
                'Stop loss: $47',
                'Calculate the maximum number of shares to buy'
              ]
            },
            {
              id: 'broker-setup',
              type: 'broker-setup',
              title: 'Setting Up Risk Management in MT5',
              content: 'Learn how to configure automatic position sizing and stop losses in MetaTrader 5.'
            },
            {
              id: 'callout-warning',
              type: 'callout',
              calloutType: 'warning',
              title: 'Common Mistake',
              content: 'Never move your stop loss against you. If the trade goes bad, take the loss and move on. Emotional decision-making destroys accounts.'
            }
          ],
          quiz: {
            questions: [
              {
                id: 'q1',
                question: 'What is the maximum percentage of your account you should risk on a single trade?',
                type: 'multiple-choice',
                options: ['5-10%', '1-2%', '10-15%', 'It depends on the setup'],
                correctAnswer: 1,
                explanation: 'Professional traders typically risk only 1-2% per trade to ensure long-term survival and consistent growth.'
              },
              {
                id: 'q2',
                question: 'Moving your stop loss against you when a trade goes bad is a good strategy.',
                type: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 1,
                explanation: 'False. Moving stops against you is one of the fastest ways to destroy a trading account. Always stick to your original plan.'
              },
              {
                id: 'q3',
                question: 'Position sizing is calculated based on:',
                type: 'multiple-choice',
                options: ['Account balance only', 'Risk tolerance and stop loss distance', 'Market volatility only', 'Gut feeling'],
                correctAnswer: 1,
                explanation: 'Position sizing should be calculated based on your risk tolerance and the distance to your stop loss.'
              }
            ]
          },
          resources: [
            {
              title: 'Position Size Calculator',
              description: 'Free tool to calculate optimal position sizes',
              url: '/tools/position-calculator',
              type: 'tool'
            },
            {
              title: 'Risk Management Checklist',
              description: 'PDF checklist for every trade',
              url: '/resources/risk-checklist.pdf',
              type: 'pdf'
            }
          ],
          brokerRecommendations: [
            {
              name: 'MetaTrader 5',
              description: 'Professional trading platform with advanced risk management tools',
              affiliateUrl: '#mt5-affiliate',
              relevance: 'Required for the broker setup section',
              rating: 4.8,
              features: ['Automated position sizing', 'Advanced stop losses', 'Risk calculators']
            },
            {
              name: 'TradingView',
              description: 'Professional charting and analysis platform',
              affiliateUrl: '#tradingview-affiliate',
              relevance: 'Essential for technical analysis',
              rating: 4.9,
              features: ['Professional charts', 'Risk/reward tools', 'Paper trading']
            }
          ]
        },
        nextLessonId: parseInt(lessonId || '1') + 1,
        previousLessonId: parseInt(lessonId || '1') > 1 ? parseInt(lessonId || '1') - 1 : undefined
      };

      setLesson(mockLesson);
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = () => {
    if (!lesson?.content.quiz) return;

    const questions = lesson.content.quiz.questions;
    let correct = 0;

    questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setQuizCompleted(true);
    
    if (score >= 80) {
      setLessonCompleted(true);
    }
  };

  const renderContentSection = (section: ContentSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            {section.title && <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>}
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {section.content.split('**').map((part, index) => 
                index % 2 === 1 ? <strong key={index} className="text-white font-semibold">{part}</strong> : part
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {section.title && <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>}
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-600">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">{section.content}</p>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center mx-auto">
                <Play className="h-5 w-5 mr-2" />
                Play Video
              </button>
            </div>
          </div>
        );

      case 'callout':
        const calloutStyles = {
          info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          tip: 'bg-green-500/10 border-green-500/30 text-green-400',
          important: 'bg-red-500/10 border-red-500/30 text-red-400'
        };
        
        return (
          <div className={`rounded-lg p-6 border ${calloutStyles[section.calloutType || 'info']}`}>
            {section.title && <h4 className="font-bold mb-2">{section.title}</h4>}
            <p className="text-gray-300">{section.content}</p>
          </div>
        );

      case 'exercise':
        return (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-emerald-400 mr-2" />
              {section.title && <h3 className="text-xl font-bold text-white">{section.title}</h3>}
            </div>
            <p className="text-gray-300 mb-4">{section.content}</p>
            {section.exerciseSteps && (
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                {section.exerciseSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        );

      case 'broker-setup':
        return (
          <div className="bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-lg p-6 border border-emerald-500/30">
            <div className="flex items-center mb-4">
              <ExternalLink className="h-6 w-6 text-emerald-400 mr-2" />
              {section.title && <h3 className="text-xl font-bold text-white">{section.title}</h3>}
            </div>
            <p className="text-gray-300 mb-4">{section.content}</p>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-emerald-400 text-sm font-medium mb-2">📈 Platform Required:</p>
              <p className="text-gray-300 text-sm">MetaTrader 5 is needed for this section. Get it free below.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="text-gray-400">Loading lesson...</span>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lesson not found</h1>
          <Link to="/app/course" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/app/course"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <div className="text-sm text-emerald-400 font-medium">{lesson.moduleTitle}</div>
                <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {lesson.duration} min
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    lesson.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {lesson.difficulty}
                  </span>
                  <span>Lesson {lesson.lessonNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {lessonCompleted && (
                <div className="flex items-center text-emerald-400 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
              <div className="text-sm text-gray-400">
                Progress: {currentSection + 1}/{lesson.content.sections.length}
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          
          {/* Sidebar - Table of Contents */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contents</h3>
            <div className="space-y-2">
              {lesson.content.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSection === index 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    {section.type === 'video' && <Video className="h-4 w-4 mr-2" />}
                    {section.type === 'exercise' && <Target className="h-4 w-4 mr-2" />}
                    {section.type === 'text' && <FileText className="h-4 w-4 mr-2" />}
                    {section.type === 'broker-setup' && <ExternalLink className="h-4 w-4 mr-2" />}
                    <span className="text-sm">{section.title || `Section ${index + 1}`}</span>
                  </div>
                </button>
              ))}
              
              {lesson.hasQuiz && (
                <button
                  onClick={() => setQuizStarted(true)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    quizStarted 
                      ? 'bg-yellow-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Quiz</span>
                    {quizCompleted && <CheckCircle className="h-4 w-4 ml-auto text-green-400" />}
                  </div>
                </button>
              )}
            </div>

            {/* Broker Recommendations */}
            {lesson.content.brokerRecommendations.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-bold text-white mb-3">Required Platforms</h4>
                <div className="space-y-3">
                  {lesson.content.brokerRecommendations.map((broker, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white">{broker.name}</h5>
                        <div className="flex items-center text-yellow-400 text-sm">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {broker.rating}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{broker.description}</p>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2 mb-3">
                        <p className="text-emerald-400 text-xs">{broker.relevance}</p>
                      </div>
                      <a
                        href={broker.affiliateUrl}
                        className="block w-full bg-emerald-600 text-white text-center py-2 rounded hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Get {broker.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {!quizStarted ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-6">
                  {renderContentSection(lesson.content.sections[currentSection])}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>

                  <div className="text-gray-400 text-sm">
                    {currentSection + 1} of {lesson.content.sections.length}
                  </div>

                  <button
                    onClick={() => {
                      if (currentSection < lesson.content.sections.length - 1) {
                        setCurrentSection(currentSection + 1);
                      } else if (lesson.hasQuiz && !quizStarted) {
                        setQuizStarted(true);
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {currentSection === lesson.content.sections.length - 1 && lesson.hasQuiz ? 'Take Quiz' : 'Next'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Section */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                  <div className="flex items-center mb-6">
                    <HelpCircle className="h-6 w-6 text-yellow-400 mr-2" />
                    <h2 className="text-2xl font-bold text-white">Knowledge Check</h2>
                  </div>

                  {!quizCompleted ? (
                    <div className="space-y-6">
                      {lesson.content.quiz?.questions.map((question, index) => (
                        <div key={question.id} className="bg-gray-700 rounded-lg p-6">
                          <h3 className="text-lg font-medium text-white mb-4">
                            Question {index + 1}: {question.question}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center p-3 bg-gray-600 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={optionIndex}
                                  onChange={() => handleQuizAnswer(question.id, optionIndex)}
                                  className="mr-3"
                                />
                                <span className="text-gray-300">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== lesson.content.quiz?.questions.length}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  ) : (
                    /* Quiz Results */
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        quizScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {quizScore >= 80 ? 
                          <CheckCircle className="h-8 w-8 text-white" /> : 
                          <Star className="h-8 w-8 text-white" />
                        }
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {quizScore >= 80 ? 'Excellent!' : 'Good effort!'}
                      </h3>
                      
                      <p className="text-xl text-gray-300 mb-6">
                        You scored {quizScore}% ({Object.keys(quizAnswers).filter(id => 
                          quizAnswers[id] === lesson.content.quiz?.questions.find(q => q.id === id)?.correctAnswer
                        ).length} out of {lesson.content.quiz?.questions.length} correct)
                      </p>

                      {quizScore >= 80 ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                          <p className="text-green-400">🎉 Lesson completed! You can now proceed to the next lesson.</p>
                        </div>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                          <p className="text-yellow-400">💡 Review the lesson content and try again to get 80% or higher.</p>
                        </div>
                      )}

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            setQuizStarted(false);
                            setQuizCompleted(false);
                            setQuizAnswers({});
                            setCurrentSection(0);
                          }}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Review Lesson
                        </button>
                        
                        {lesson.nextLessonId && quizScore >= 80 && (
                          <Link
                            to={`/app/lesson/${lesson.nextLessonId}`}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Next Lesson
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;