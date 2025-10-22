import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, ChartBar as BarChart3, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  year: string;
  closing_rank: number;
  predicted?: boolean;
}

export default function TrendAnalysis() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('NIT Trichy');
  const [selectedBranch, setBranch] = useState('Computer Science Engineering');
  const [selectedCategory, setSelectedCategory] = useState('General');

  const colleges = [
    'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'NIT Warangal', 'BITS Pilani',
    'VIT Vellore', 'DTU Delhi', 'NSUT Delhi', 'IIIT Hyderabad', 'IIIT Bangalore'
  ];

  const branches = [
    'Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Chemical Engineering', 'Electronics & Communication'
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const trendData: TrendData[] = [
    { year: '2020', closing_rank: 1250 },
    { year: '2021', closing_rank: 1180 },
    { year: '2022', closing_rank: 1320 },
    { year: '2023', closing_rank: 1150 },
    { year: '2024', closing_rank: 1080, predicted: true }
  ];

  const getTrendDirection = () => {
    const recent = trendData.slice(-3);
    const trend = recent[2].closing_rank - recent[0].closing_rank;
    if (trend < -50) return { direction: 'Decreasing', color: 'text-red-600', icon: '📈' };
    if (trend > 50) return { direction: 'Increasing', color: 'text-green-600', icon: '📉' };
    return { direction: 'Stable', color: 'text-blue-600', icon: '➡️' };
  };

  const trend = getTrendDirection();

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
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Year-over-Year Trend Analysis</h1>
                <p className="text-purple-100 mt-2">
                  Historical cutoff trends with AI-powered predictions
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trend Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Trend Direction</h3>
                </div>
                <p className={`text-2xl font-bold ${trend.color} mt-2`}>
                  {trend.icon} {trend.direction}
                </p>
                <p className="text-sm text-gray-600 mt-1">Based on last 3 years</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">2024 Prediction</h3>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">Rank 1080</p>
                <p className="text-sm text-gray-600 mt-1">AI-powered forecast</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Volatility</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-2">±170 ranks</p>
                <p className="text-sm text-gray-600 mt-1">Average fluctuation</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Closing Rank Trend: {selectedCollege} - {selectedBranch} ({selectedCategory})
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `Rank ${value}${trendData.find(d => d.closing_rank === value)?.predicted ? ' (Predicted)' : ''}`,
                      'Closing Rank'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="closing_rank" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Key Insights</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Cutoffs have become more competitive over the years</li>
                  <li>• 2024 prediction shows continued tightening</li>
                  <li>• Average rank improvement: 170 ranks over 4 years</li>
                  <li>• Most significant drop was in 2023</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">Recommendations</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Target rank better than 1080 for safe admission</li>
                  <li>• Consider this as a reach college option</li>
                  <li>• Have backup options with ranks around 1500+</li>
                  <li>• Monitor real-time cutoffs during counselling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}