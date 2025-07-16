// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\AchievementsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Star, 
  Lock, 
  CheckCircle,
  Clock,
  Target,
  Zap,
  Fire,
  Award,
  BookOpen,
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Crown,
  Medal,
  Gem,
  Filter,
  Search
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'progress' | 'social' | 'special';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  points: number;
  rarity: number; // percentage of users who have this achievement
  requirements: string[];
  reward?: string;
}

interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories] = useState<AchievementCategory[]>([
    {
      id: 'learning',
      name: 'Learning',
      description: 'Complete lessons and master new concepts',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'progress',
      name: 'Progress',
      description: 'Track your continuous improvement',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'social',
      name: 'Social',
      description: 'Engage with the community',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'special',
      name: 'Special',
      description: 'Rare and exclusive achievements',
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600'
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      // Mock achievements data - replace with real API call
      const mockAchievements: Achievement[] = [
        // Learning Achievements
        {
          id: 'first-lesson',
          title: 'First Steps',
          description: 'Complete your very first lesson',
          category: 'learning',
          difficulty: 'bronze',
          icon: '🎯',
          earned: true,
          earnedDate: '2024-06-15',
          points: 50,
          rarity: 95,
          requirements: ['Complete 1 lesson'],
          reward: '50 XP bonus'
        },
        {
          id: 'module-master',
          title: 'Module Master',
          description: 'Complete an entire module',
          category: 'learning',
          difficulty: 'silver',
          icon: '📚',
          earned: true,
          earnedDate: '2024-06-28',
          points: 200,
          rarity: 78,
          requirements: ['Complete all lessons in a module'],
          reward: '200 XP + Trading Tool Access'
        },
        {
          id: 'knowledge-seeker',
          title: 'Knowledge Seeker',
          description: 'Complete 10 lessons',
          category: 'learning',
          difficulty: 'silver',
          icon: '🔍',
          earned: false,
          progress: 8,
          maxProgress: 10,
          points: 300,
          rarity: 65,
          requirements: ['Complete 10 lessons total'],
          reward: '300 XP + Certificate'
        },
        {
          id: 'trading-scholar',
          title: 'Trading Scholar',
          description: 'Complete all modules in the course',
          category: 'learning',
          difficulty: 'gold',
          icon: '🎓',
          earned: false,
          progress: 2,
          maxProgress: 5,
          points: 1000,
          rarity: 25,
          requirements: ['Complete all 5 modules'],
          reward: '1000 XP + Master Certificate + VIP Community Access'
        },

        // Progress Achievements
        {
          id: 'quiz-master',
          title: 'Quiz Master',
          description: 'Score 90%+ on 5 quizzes',
          category: 'progress',
          difficulty: 'silver',
          icon: '🧠',
          earned: true,
          earnedDate: '2024-07-12',
          points: 250,
          rarity: 45,
          requirements: ['Score 90% or higher on 5 different quizzes'],
          reward: '250 XP + Advanced Analytics Access'
        },
        {
          id: 'perfectionist',
          title: 'Perfectionist',
          description: 'Score 100% on any quiz',
          category: 'progress',
          difficulty: 'gold',
          icon: '💯',
          earned: false,
          progress: 95,
          maxProgress: 100,
          points: 500,
          rarity: 15,
          requirements: ['Score 100% on any quiz'],
          reward: '500 XP + Perfect Score Badge'
        },
        {
          id: 'week-warrior',
          title: 'Week Warrior',
          description: 'Learn for 7 days in a row',
          category: 'progress',
          difficulty: 'bronze',
          icon: '🔥',
          earned: true,
          earnedDate: '2024-07-10',
          points: 150,
          rarity: 60,
          requirements: ['Maintain a 7-day learning streak'],
          reward: '150 XP + Streak Booster'
        },
        {
          id: 'month-champion',
          title: 'Month Champion',
          description: 'Learn for 30 days in a row',
          category: 'progress',
          difficulty: 'gold',
          icon: '🏆',
          earned: false,
          progress: 7,
          maxProgress: 30,
          points: 750,
          rarity: 8,
          requirements: ['Maintain a 30-day learning streak'],
          reward: '750 XP + Champion Badge + Premium Features'
        },
        {
          id: 'speed-learner',
          title: 'Speed Learner',
          description: 'Complete 3 lessons in one day',
          category: 'progress',
          difficulty: 'silver',
          icon: '⚡',
          earned: false,
          progress: 2,
          maxProgress: 3,
          points: 200,
          rarity: 35,
          requirements: ['Complete 3 lessons within 24 hours'],
          reward: '200 XP + Speed Bonus Multiplier'
        },

        // Social Achievements
        {
          id: 'community-member',
          title: 'Community Member',
          description: 'Join the trading community',
          category: 'social',
          difficulty: 'bronze',
          icon: '👥',
          earned: false,
          points: 100,
          rarity: 70,
          requirements: ['Join the community forum'],
          reward: '100 XP + Community Badge'
        },
        {
          id: 'helpful-trader',
          title: 'Helpful Trader',
          description: 'Help 5 other students',
          category: 'social',
          difficulty: 'silver',
          icon: '🤝',
          earned: false,
          progress: 0,
          maxProgress: 5,
          points: 300,
          rarity: 20,
          requirements: ['Answer 5 questions in the community'],
          reward: '300 XP + Helper Badge + Mentor Status'
        },

        // Special Achievements
        {
          id: 'early-bird',
          title: 'Early Bird',
          description: 'Join during the first month of launch',
          category: 'special',
          difficulty: 'platinum',
          icon: '🐦',
          earned: true,
          earnedDate: '2024-06-01',
          points: 1000,
          rarity: 5,
          requirements: ['Register account in June 2024'],
          reward: '1000 XP + Early Bird Badge + Lifetime Discount'
        },
        {
          id: 'beta-tester',
          title: 'Beta Tester',
          description: 'Help test new features',
          category: 'special',
          difficulty: 'diamond',
          icon: '🔬',
          earned: false,
          points: 2000,
          rarity: 2,
          requirements: ['Participate in beta testing program'],
          reward: '2000 XP + Beta Badge + Direct Dev Access'
        },
        {
          id: 'legendary-trader',
          title: 'Legendary Trader',
          description: 'Achieve mastery in all areas',
          category: 'special',
          difficulty: 'diamond',
          icon: '👑',
          earned: false,
          progress: 30,
          maxProgress: 100,
          points: 5000,
          rarity: 1,
          requirements: [
            'Complete all modules with 95%+ average',
            'Maintain 100-day streak',
            'Help 20+ community members',
            'Perfect scores on 10+ quizzes'
          ],
          reward: '5000 XP + Legendary Crown + Hall of Fame + Personal Mentorship'
        }
      ];

      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'from-orange-600 to-orange-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-500 to-yellow-600';
      case 'platinum': return 'from-cyan-400 to-cyan-500';
      case 'diamond': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return <Medal className="h-4 w-4" />;
      case 'silver': return <Award className="h-4 w-4" />;
      case 'gold': return <Trophy className="h-4 w-4" />;
      case 'platinum': return <Star className="h-4 w-4" />;
      case 'diamond': return <Gem className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const getRarityText = (rarity: number) => {
    if (rarity > 50) return 'Common';
    if (rarity > 20) return 'Uncommon';
    if (rarity > 5) return 'Rare';
    if (rarity > 1) return 'Epic';
    return 'Legendary';
  };

  const getRarityColor = (rarity: number) => {
    if (rarity > 50) return 'text-gray-400';
    if (rarity > 20) return 'text-green-400';
    if (rarity > 5) return 'text-blue-400';
    if (rarity > 1) return 'text-purple-400';
    return 'text-yellow-400';
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || achievement.difficulty === selectedDifficulty;
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);
  const completionRate = Math.round((earnedAchievements.length / achievements.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="text-gray-400">Loading achievements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-gray-400">Track your progress and unlock rewards</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{earnedAchievements.length}</div>
                <div className="text-sm text-gray-400">Earned</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-emerald-400 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{totalPoints}</div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">{completionRate}%</div>
                <div className="text-sm text-gray-400">Completion</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {achievements.filter(a => a.earned && a.difficulty === 'gold').length}
                </div>
                <div className="text-sm text-gray-400">Gold Badges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">All</div>
              <div className="text-sm opacity-75">{achievements.length} total</div>
            </div>
          </button>

          {categories.map((category) => {
            const Icon = category.icon;
            const count = achievements.filter(a => a.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm opacity-75">{count} achievements</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Difficulties</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>

          <div className="text-sm text-gray-400">
            Showing {filteredAchievements.length} of {achievements.length} achievements
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-6 border-2 transition-all duration-200 hover:scale-105 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-4xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex flex-col items-end">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} text-white`}>
                    {getDifficultyIcon(achievement.difficulty)}
                    <span className="ml-1 capitalize">{achievement.difficulty}</span>
                  </div>
                  <div className={`text-xs mt-1 ${getRarityColor(achievement.rarity)}`}>
                    {getRarityText(achievement.rarity)}
                  </div>
                </div>
              </div>

              <h3 className={`text-lg font-bold mb-2 ${
                achievement.earned ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {achievement.title}
              </h3>

              <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>

              {/* Progress Bar */}
              {!achievement.earned && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-400 mb-2">Requirements:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  {achievement.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-3 w-3 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reward */}
              {achievement.reward && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4">
                  <h4 className="text-xs font-medium text-emerald-400 mb-1">Reward:</h4>
                  <p className="text-xs text-gray-300">{achievement.reward}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <Star className="h-3 w-3 mr-1" />
                  {achievement.points} XP
                </div>
                {achievement.earned && achievement.earnedDate && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(achievement.earnedDate).toLocaleDateString()}
                  </div>
                )}
                {achievement.rarity && (
                  <div className="text-xs text-gray-400">
                    {achievement.rarity}% earned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No achievements found</h3>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            to="/app/dashboard"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;