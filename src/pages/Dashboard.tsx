import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, Search, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, TrendingUp, Calendar, Bell, ArrowRight, Crown, Zap, Lock, Calculator, Users, MessageCircle, GraduationCap, Award, Star, FileText, Target, ChartBar as BarChart3, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user, searchCount } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Fill your academic and personal details',
      icon: <User className="w-6 h-6" />,
      link: '/profile',
      completed: user.profileComplete,
      urgent: !user.profileComplete
    },
    {
      title: 'Find Colleges',
      description: 'Search colleges based on your exam scores',
      icon: <Search className="w-6 h-6" />,
      link: '/college-finder',
      completed: false,
      urgent: user.profileComplete
    },
    {
      title: 'Upgrade to Premium',
      description: 'Get unlimited college searches and premium features',
      icon: <Crown className="w-6 h-6" />,
      link: '/payment',
      completed: user.paymentStatus === 'completed',
      urgent: user.paymentStatus !== 'completed' && searchCount >= 2,
      premium: true
    }
  ];

  const advancedFeatures = [
    {
      title: 'Multi-Exam Predictor',
      description: 'Compare results from multiple entrance exams',
      icon: <Calculator className="w-6 h-6" />,
      link: '/multi-exam-predictor',
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'Rank vs Branch Heatmap',
      description: 'Visual analysis of cutoffs across branches',
      icon: <TrendingUp className="w-6 h-6" />,
      link: '/rank-heatmap',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Trend Analysis',
      description: 'Historical cutoff trends with AI predictions',
      icon: <TrendingUp className="w-6 h-6" />,
      link: '/trend-analysis',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Document Tracker',
      description: 'Track counselling documents and deadlines',
      icon: <FileText className="w-6 h-6" />,
      link: '/document-tracker',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'Seat Matrix Analyzer',
      description: 'View detailed seat availability data',
      icon: <Users className="w-6 h-6" />,
      link: '/seat-matrix',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Counselling Calendar',
      description: 'Important dates and deadlines',
      icon: <Calendar className="w-6 h-6" />,
      link: '/counselling-calendar',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Student Reviews',
      description: 'Verified reviews from alumni',
      icon: <Star className="w-6 h-6" />,
      link: '/student-reviews',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Q&A Forum',
      description: 'Ask questions and get answers',
      icon: <MessageCircle className="w-6 h-6" />,
      link: '/qa-forum',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mentorship',
      description: '1-on-1 sessions with experts',
      icon: <Award className="w-6 h-6" />,
      link: '/mentorship',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Alumni Connect',
      description: 'Success stories and networking',
      icon: <GraduationCap className="w-6 h-6" />,
      link: '/alumni-connect',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const newAdvancedFeatures = [
    {
      title: 'Wait Time Analysis',
      description: 'Predict counselling rounds for seat allotment',
      icon: <Clock className="w-6 h-6" />,
      link: '/wait-time-analysis',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Subject Weightage',
      description: 'Interactive exam subject analysis',
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/subject-weightage',
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'College Resources',
      description: 'Videos, alumni profiles, and resources',
      icon: <BookOpen className="w-6 h-6" />,
      link: '/college-resources',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'Future Rank Predictor',
      description: 'Predict next year attempt results (Premium)',
      icon: <Target className="w-6 h-6" />,
      link: '/rank-predictor',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Profile Verification Required',
      message: 'Please upload your 12th mark sheet for verification',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Payment Confirmation',
      message: 'Your payment has been received and processed',
      time: '1 day ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Choice Filling Deadline',
      message: 'Last date to fill choices is 15th March 2024',
      time: '2 days ago',
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user.firstName}!
          </h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-600">
              Registration Number: {user.registrationNumber}
            </p>
            {user.paymentStatus !== 'completed' && (
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                <span>{3 - searchCount} {t('dashboard.searchesLeft')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion Notice */}
            {!user.profileComplete && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900">Complete Your Profile First</h3>
                    <p className="text-orange-700 mt-1">
                      You need to complete your profile before you can access the College Finder. 
                      Please fill in your basic details to proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Upgrade Notice */}
            {user.paymentStatus !== 'completed' && searchCount >= 2 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Upgrade to Premium</h3>
                    <p className="text-purple-700 mt-1">
                      You're running low on free searches. Upgrade now for unlimited access and premium features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.quickActions')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      action.completed 
                        ? 'border-green-200 bg-green-50'
                        : action.premium && user.paymentStatus === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : action.urgent
                        ? 'border-orange-200 bg-orange-50 hover:border-orange-300'
                        : action.link === '/college-finder' && !user.profileComplete
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                    onClick={action.link === '/college-finder' && !user.profileComplete ? (e) => e.preventDefault() : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          action.completed 
                            ? 'bg-green-100 text-green-600'
                            : action.premium && user.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : action.premium
                            ? 'bg-purple-100 text-purple-600'
                            : action.urgent
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                          {action.link === '/college-finder' && !user.profileComplete && (
                            <p className="text-xs text-red-600 mt-1">Complete profile first</p>
                          )}
                          {action.premium && user.paymentStatus === 'completed' && (
                            <p className="text-xs text-green-600 mt-1">Premium Active</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {action.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {action.premium && user.paymentStatus === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {action.urgent && <Clock className="w-5 h-5 text-orange-600" />}
                        {action.premium && user.paymentStatus !== 'completed' && <Crown className="w-5 h-5 text-purple-600" />}
                        {!(action.link === '/college-finder' && !user.profileComplete) && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.advancedFeatures')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...advancedFeatures, ...newAdvancedFeatures].map((feature, index) => (
                  <Link
                    key={index}
                    to={feature.link}
                    className="group relative overflow-hidden rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 min-h-[120px]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <div className="relative">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-3`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{user.profileComplete ? '100%' : '50%'}</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Search className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {user.paymentStatus === 'completed' ? '∞' : `${3 - searchCount}`}
                  </div>
                  <div className="text-sm text-gray-600">Searches Left</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  {user.paymentStatus === 'completed' ? (
                    <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  ) : (
                    <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  )}
                  <div className="text-2xl font-bold text-purple-600">
                    {user.paymentStatus === 'completed' ? 'Premium' : 'Free'}
                  </div>
                  <div className="text-sm text-gray-600">Account Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Premium Features Card */}
            {user.paymentStatus !== 'completed' && (
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center mb-4">
                  <Crown className="w-6 h-6 mr-2" />
                  <h2 className="text-lg font-semibold">Upgrade to Premium</h2>
                </div>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Unlimited college searches
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Advanced filtering options
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Priority customer support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Detailed college analytics
                  </li>
                </ul>
                <Link
                  to="/payment"
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors inline-block"
                >
                  Upgrade Now - ₹999
                </Link>
              </div>
            )}

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-start space-x-3">
                      {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />}
                      {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                      {notification.type === 'info' && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is here to help you with any questions or issues.
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}