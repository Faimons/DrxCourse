// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Monitor, 
  CreditCard,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Lock
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  avatar: string;
  bio: string;
  joinedAt: string;
}

interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'en' | 'de' | 'es' | 'fr';
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    progressVisible: boolean;
    achievementsVisible: boolean;
  };
  learning: {
    autoplayVideos: boolean;
    subtitles: boolean;
    playbackSpeed: number;
    reminderTime: string;
    weeklyGoal: number;
  };
}

const SettingsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || 'Trading Pro',
    email: user?.email || 'user@example.com',
    phone: '+49 123 456 789',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    avatar: '',
    bio: 'Learning trading and financial markets.',
    joinedAt: '2024-01-15'
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    language: 'de',
    notifications: {
      email: true,
      push: true,
      achievements: true,
      reminders: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      progressVisible: true,
      achievementsVisible: true
    },
    learning: {
      autoplayVideos: true,
      subtitles: false,
      playbackSpeed: 1.0,
      reminderTime: '19:00',
      weeklyGoal: 5
    }
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Monitor },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'data', name: 'Data', icon: Download },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <Upload className="h-4 w-4 inline mr-2" />
              Upload Photo
            </button>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Appearance</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  preferences.theme === 'dark'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Dark
              </button>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  preferences.theme === 'light'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Light
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value as 'en' | 'de' | 'es' | 'fr' }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Learning Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Autoplay Videos</label>
              <p className="text-xs text-gray-400">Automatically play videos in lessons</p>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ 
                ...prev, 
                learning: { ...prev.learning, autoplayVideos: !prev.learning.autoplayVideos }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.learning.autoplayVideos ? 'bg-emerald-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.learning.autoplayVideos ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Subtitles</label>
              <p className="text-xs text-gray-400">Show subtitles in videos</p>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ 
                ...prev, 
                learning: { ...prev.learning, subtitles: !prev.learning.subtitles }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.learning.subtitles ? 'bg-emerald-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.learning.subtitles ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Playback Speed</label>
            <select
              value={preferences.learning.playbackSpeed}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                learning: { ...prev.learning, playbackSpeed: parseFloat(e.target.value) }
              }))}
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            >
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1x (Normal)</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2x</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Weekly Learning Goal</label>
            <input
              type="number"
              value={preferences.learning.weeklyGoal}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                learning: { ...prev.learning, weeklyGoal: parseInt(e.target.value) }
              }))}
              min="1"
              max="20"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Lessons per week</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <p className="text-xs text-gray-400">
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Browser push notifications'}
                  {key === 'achievements' && 'New achievement notifications'}
                  {key === 'reminders' && 'Learning reminder notifications'}
                  {key === 'marketing' && 'Marketing and promotional emails'}
                </p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, [key]: !value }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-emerald-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Password</h3>
        
        {!showPasswordChange ? (
          <button
            onClick={() => setShowPasswordChange(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Export Data</h4>
              <p className="text-sm text-gray-400">Download your profile, progress, and achievements</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 inline mr-2" />
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Delete Account</h4>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="h-4 w-4 inline mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'data':
        return renderDataTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                <span className="text-emerald-300">Settings saved successfully!</span>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Tabs */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-xl p-2 border border-gray-700">
            <nav className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;