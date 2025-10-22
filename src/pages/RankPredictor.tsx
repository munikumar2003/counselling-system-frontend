import React, { useState } from 'react';
import { ArrowLeft, Target, TrendingUp, Calculator, Crown, CircleAlert as AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

interface PredictionData {
  exam: string;
  currentScore: number;
  targetScore: number;
  currentRank: number;
  predictedRank: number;
  improvement: number;
  difficulty: number;
  competition: number;
}

export default function RankPredictor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState('JEE Main');
  const [currentScore, setCurrentScore] = useState(85);
  const [targetScore, setTargetScore] = useState(95);
  const [showResults, setShowResults] = useState(false);

  const exams = ['JEE Main', 'NEET', 'GATE CSE', 'CAT'];

  const predictionData: PredictionData = {
    exam: selectedExam,
    currentScore,
    targetScore,
    currentRank: Math.round(1000000 * Math.pow((100 - currentScore) / 100, 2)),
    predictedRank: Math.round(1000000 * Math.pow((100 - targetScore) / 100, 2)),
    improvement: targetScore - currentScore,
    difficulty: 7.5,
    competition: 8.2
  };

  const trendData = [
    { year: '2020', candidates: 900000, cutoff: 90.5 },
    { year: '2021', candidates: 950000, cutoff: 91.2 },
    { year: '2022', candidates: 1100000, cutoff: 92.1 },
    { year: '2023', candidates: 1200000, cutoff: 92.8 },
    { year: '2024', candidates: 1350000, cutoff: 93.5 },
    { year: '2025', candidates: 1450000, cutoff: 94.2 }
  ];

  const collegeData = [
    { name: 'IIT Delhi CSE', currentChance: 15, predictedChance: 75 },
    { name: 'IIT Bombay CSE', currentChance: 8, predictedChance: 45 },
    { name: 'NIT Trichy CSE', currentChance: 65, predictedChance: 90 },
    { name: 'BITS Pilani CSE', currentChance: 80, predictedChance: 95 },
    { name: 'VIT Vellore CSE', currentChance: 90, predictedChance: 98 }
  ];

  const handlePredict = () => {
    if (user?.paymentStatus !== 'completed') {
      toast.error('This is a premium feature. Please upgrade to access rank prediction.');
      navigate('/payment');
      return;
    }

    if (targetScore <= currentScore) {
      toast.error('Target score should be higher than current score');
      return;
    }

    setShowResults(true);
    toast.success('Prediction generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Future Rank Predictor</h1>
                <p className="text-purple-100 mt-2">
                  Predict your rank for next year's attempt with hypothetical scores
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Premium Notice */}
            {user?.paymentStatus !== 'completed' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Premium Feature</h3>
                </div>
                <p className="text-orange-700 text-sm mb-4">
                  Future rank prediction is available for premium users only. Get detailed analysis and predictions for your next attempt.
                </p>
                <button
                  onClick={() => navigate('/payment')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            {!showResults ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">How it works</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Enter your current performance and target score for next year. Our AI model considers increasing competition, 
                    difficulty trends, and historical data to predict your future rank and college chances.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {exams.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Score/Percentile</label>
                    <input
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Score/Percentile</label>
                    <input
                      type="number"
                      value={targetScore}
                      onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  Generate Prediction
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Prediction Results</h2>
                  <button
                    onClick={() => setShowResults(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    New Prediction
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Current Rank</div>
                    <div className="text-2xl font-bold text-blue-900">{predictionData.currentRank.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium">Predicted Rank</div>
                    <div className="text-2xl font-bold text-green-900">{predictionData.predictedRank.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-sm text-orange-600 font-medium">Rank Improvement</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {(predictionData.currentRank - predictionData.predictedRank).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium">Score Improvement</div>
                    <div className="text-2xl font-bold text-purple-900">+{predictionData.improvement}%</div>
                  </div>
                </div>

                {/* Competition Trend */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Competition Trend Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="candidates" fill="#8884d8" name="Total Candidates" />
                      <Line yAxisId="right" type="monotone" dataKey="cutoff" stroke="#82ca9d" strokeWidth={3} name="Cutoff Percentile" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* College Chances Comparison */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">College Admission Chances</h3>
                  <div className="space-y-4">
                    {collegeData.map((college, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{college.name}</h4>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              Current: <span className="font-semibold text-red-600">{college.currentChance}%</span>
                            </span>
                            <span className="text-sm text-gray-600">
                              Predicted: <span className="font-semibold text-green-600">{college.predictedChance}%</span>
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Current Chance</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${college.currentChance}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Predicted Chance</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${college.predictedChance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Preparation Strategy</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-orange-900 mb-2">Focus Areas</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Mathematics: 40% weightage</li>
                        <li>• Physics: 35% weightage</li>
                        <li>• Chemistry: 25% weightage</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900 mb-2">Time Allocation</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Daily study: 8-10 hours</li>
                        <li>• Mock tests: 3 per week</li>
                        <li>• Revision: 2 hours daily</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900 mb-2">Key Milestones</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• 6 months: 90% syllabus</li>
                        <li>• 3 months: Full revision</li>
                        <li>• 1 month: Mock tests only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}