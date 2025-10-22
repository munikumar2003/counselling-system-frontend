import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, ListFilter as Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeatmapData {
  branch: string;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
}

export default function RankHeatmap() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('IIT Delhi');
  const [selectedExam, setSelectedExam] = useState('JEE Advanced');

  const colleges = [
    'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'BITS Pilani', 'VIT Vellore'
  ];

  const heatmapData: HeatmapData[] = [
    { branch: 'Computer Science', general: 45, obc: 125, sc: 285, st: 445, ews: 78 },
    { branch: 'Electrical Engineering', general: 156, obc: 298, sc: 567, st: 789, ews: 234 },
    { branch: 'Mechanical Engineering', general: 234, obc: 445, sc: 678, st: 890, ews: 345 },
    { branch: 'Civil Engineering', general: 445, obc: 678, sc: 890, st: 1234, ews: 567 },
    { branch: 'Chemical Engineering', general: 345, obc: 567, sc: 789, st: 1123, ews: 456 },
    { branch: 'Aerospace Engineering', general: 567, obc: 789, sc: 1123, st: 1456, ews: 678 },
    { branch: 'Biotechnology', general: 789, obc: 1123, sc: 1456, st: 1789, ews: 890 },
    { branch: 'Metallurgy', general: 890, obc: 1234, sc: 1567, st: 1890, ews: 1123 },
    { branch: 'Engineering Physics', general: 678, obc: 890, sc: 1234, st: 1567, ews: 789 },
    { branch: 'Production Engineering', general: 1123, obc: 1456, sc: 1789, st: 2123, ews: 1234 }
  ];

  const getColorIntensity = (rank: number, maxRank: number = 2500) => {
    const intensity = 1 - (rank / maxRank);
    if (intensity > 0.8) return 'bg-red-600';
    if (intensity > 0.6) return 'bg-red-400';
    if (intensity > 0.4) return 'bg-orange-400';
    if (intensity > 0.2) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getTextColor = (rank: number, maxRank: number = 2500) => {
    const intensity = 1 - (rank / maxRank);
    return intensity > 0.4 ? 'text-white' : 'text-gray-900';
  };

  const categories = [
    { key: 'general', name: 'General', color: 'bg-blue-100' },
    { key: 'obc', name: 'OBC', color: 'bg-green-100' },
    { key: 'sc', name: 'SC', color: 'bg-purple-100' },
    { key: 'st', name: 'ST', color: 'bg-orange-100' },
    { key: 'ews', name: 'EWS', color: 'bg-pink-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Rank vs Branch Heatmap</h1>
                <p className="text-red-100 mt-2">
                  Visual analysis of closing ranks across branches and categories
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select College
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span className="text-sm">Most Competitive (Top 10%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-sm">Highly Competitive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-sm">Moderately Competitive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">Less Competitive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm">Least Competitive</span>
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-6 gap-1 mb-2">
                  <div className="p-3 font-semibold text-gray-900">Branch</div>
                  {categories.map(category => (
                    <div key={category.key} className={`p-3 text-center font-semibold text-gray-900 rounded ${category.color}`}>
                      {category.name}
                    </div>
                  ))}
                </div>
                
                {heatmapData.map((row, index) => (
                  <div key={index} className="grid grid-cols-6 gap-1 mb-1">
                    <div className="p-3 font-medium text-gray-900 bg-gray-100 rounded flex items-center">
                      {row.branch}
                    </div>
                    {categories.map(category => {
                      const rank = row[category.key as keyof HeatmapData] as number;
                      return (
                        <div
                          key={category.key}
                          className={`p-3 text-center font-semibold rounded transition-all hover:scale-105 cursor-pointer ${getColorIntensity(rank)} ${getTextColor(rank)}`}
                          title={`${category.name}: Rank ${rank}`}
                        >
                          {rank}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Most Competitive</h4>
                <p className="text-sm text-red-700">Computer Science Engineering has the tightest cutoffs across all categories.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Best Opportunities</h4>
                <p className="text-sm text-green-700">Production Engineering offers the best chances for admission.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Category Impact</h4>
                <p className="text-sm text-blue-700">SC/ST categories have significantly relaxed cutoffs compared to General.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}