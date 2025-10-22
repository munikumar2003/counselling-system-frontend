import React, { useState } from 'react';
import { ArrowLeft, Clock, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WaitTimeData {
  college: string;
  branch: string;
  category: string;
  userRank: number;
  openingRank: number;
  closingRank: number;
  expectedRound: number;
  probability: number;
  waitTime: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function WaitTimeAnalysis() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('IIT Delhi');
  const [selectedBranch, setBranch] = useState('Computer Science');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [userRank, setUserRank] = useState(1500);

  const colleges = ['IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore'];
  const branches = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const waitTimeData: WaitTimeData[] = [
    {
      college: 'IIT Delhi',
      branch: 'Computer Science',
      category: 'General',
      userRank: 1500,
      openingRank: 45,
      closingRank: 1200,
      expectedRound: 1,
      probability: 85,
      waitTime: 'Round 1',
      riskLevel: 'low'
    },
    {
      college: 'NIT Trichy',
      branch: 'Computer Science',
      category: 'General',
      userRank: 1500,
      openingRank: 800,
      closingRank: 1800,
      expectedRound: 2,
      probability: 70,
      waitTime: 'Round 2-3',
      riskLevel: 'medium'
    },
    {
      college: 'BITS Pilani',
      branch: 'Computer Science',
      category: 'General',
      userRank: 1500,
      openingRank: 1200,
      closingRank: 2500,
      expectedRound: 1,
      probability: 90,
      waitTime: 'Round 1',
      riskLevel: 'low'
    }
  ];

  const roundData = [
    { round: 'Round 1', seats: 45, probability: 85 },
    { round: 'Round 2', seats: 25, probability: 70 },
    { round: 'Round 3', seats: 15, probability: 50 },
    { round: 'Round 4', seats: 10, probability: 30 },
    { round: 'Round 5', seats: 5, probability: 15 },
    { round: 'Round 6', seats: 3, probability: 10 }
  ];

  const probabilityData = [
    { name: 'High Chance', value: 85, color: '#10B981' },
    { name: 'Medium Chance', value: 15, color: '#F59E0B' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <Target className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Wait Time & Rounds Analysis</h1>
                <p className="text-orange-100 mt-2">
                  Predict which counselling round you'll get your preferred seat
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rank</label>
                <input
                  type="number"
                  value={userRank}
                  onChange={(e) => setUserRank(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Analysis Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Wait Time Prediction */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-4">Wait Time Prediction</h3>
                <div className="space-y-4">
                  {waitTimeData.slice(0, 1).map((data, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{data.college} - {data.branch}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(data.riskLevel)}`}>
                          {getRiskIcon(data.riskLevel)}
                          <span className="ml-1">{data.riskLevel.toUpperCase()} RISK</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Opening Rank:</span>
                          <span className="font-semibold ml-2">{data.openingRank}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Closing Rank:</span>
                          <span className="font-semibold ml-2">{data.closingRank}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected Round:</span>
                          <span className="font-semibold ml-2 text-orange-600">{data.waitTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Probability:</span>
                          <span className="font-semibold ml-2 text-green-600">{data.probability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Probability Chart */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Admission Probability</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={probabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {probabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {probabilityData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Round-wise Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Round-wise Seat Availability</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roundData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="seats" fill="#F59E0B" name="Available Seats" />
                  <Bar dataKey="probability" fill="#10B981" name="Your Probability %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">High Probability Colleges</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• BITS Pilani - CSE (90% chance)</li>
                  <li>• VIT Vellore - CSE (85% chance)</li>
                  <li>• Manipal - CSE (80% chance)</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">Medium Probability</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• NIT Trichy - CSE (70% chance)</li>
                  <li>• DTU Delhi - CSE (65% chance)</li>
                  <li>• NSUT Delhi - CSE (60% chance)</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Reach Colleges</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• IIT Delhi - CSE (30% chance)</li>
                  <li>• IIT Bombay - CSE (25% chance)</li>
                  <li>• IIT Madras - CSE (20% chance)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}