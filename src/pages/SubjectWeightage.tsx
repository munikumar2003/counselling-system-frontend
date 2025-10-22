import React, { useState } from 'react';
import { ArrowLeft, ChartBar as BarChart3, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface SubjectData {
  subject: string;
  weightage: number;
  difficulty: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  questions: number;
  marks: number;
}

export default function SubjectWeightage() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState('JEE Main');

  const exams = ['JEE Main', 'NEET', 'GATE CSE', 'GATE ECE', 'CAT'];

  const subjectData: { [key: string]: SubjectData[] } = {
    'JEE Main': [
      { subject: 'Physics', weightage: 33.3, difficulty: 7.5, trend: 'increasing', questions: 25, marks: 100 },
      { subject: 'Chemistry', weightage: 33.3, difficulty: 6.8, trend: 'stable', questions: 25, marks: 100 },
      { subject: 'Mathematics', weightage: 33.3, difficulty: 8.2, trend: 'increasing', questions: 25, marks: 100 }
    ],
    'NEET': [
      { subject: 'Physics', weightage: 25, difficulty: 7.8, trend: 'increasing', questions: 45, marks: 180 },
      { subject: 'Chemistry', weightage: 25, difficulty: 6.5, trend: 'stable', questions: 45, marks: 180 },
      { subject: 'Botany', weightage: 25, difficulty: 6.2, trend: 'decreasing', questions: 45, marks: 180 },
      { subject: 'Zoology', weightage: 25, difficulty: 6.8, trend: 'stable', questions: 45, marks: 180 }
    ],
    'GATE CSE': [
      { subject: 'Programming', weightage: 15, difficulty: 8.0, trend: 'increasing', questions: 11, marks: 22 },
      { subject: 'Data Structures', weightage: 13, difficulty: 7.5, trend: 'stable', questions: 9, marks: 18 },
      { subject: 'Algorithms', weightage: 13, difficulty: 8.5, trend: 'increasing', questions: 9, marks: 18 },
      { subject: 'Computer Networks', weightage: 12, difficulty: 7.0, trend: 'stable', questions: 8, marks: 16 },
      { subject: 'Operating Systems', weightage: 10, difficulty: 6.8, trend: 'decreasing', questions: 7, marks: 14 },
      { subject: 'Database Systems', weightage: 10, difficulty: 7.2, trend: 'stable', questions: 7, marks: 14 },
      { subject: 'Theory of Computation', weightage: 8, difficulty: 8.8, trend: 'increasing', questions: 6, marks: 12 },
      { subject: 'Compiler Design', weightage: 7, difficulty: 8.2, trend: 'stable', questions: 5, marks: 10 },
      { subject: 'Digital Logic', weightage: 6, difficulty: 6.5, trend: 'decreasing', questions: 4, marks: 8 },
      { subject: 'Computer Architecture', weightage: 6, difficulty: 7.0, trend: 'stable', questions: 4, marks: 8 }
    ],
    'CAT': [
      { subject: 'Quantitative Ability', weightage: 33.3, difficulty: 7.8, trend: 'increasing', questions: 22, marks: 66 },
      { subject: 'Verbal Ability', weightage: 33.3, difficulty: 7.2, trend: 'stable', questions: 24, marks: 72 },
      { subject: 'Data Interpretation', weightage: 33.3, difficulty: 8.0, trend: 'increasing', questions: 20, marks: 60 }
    ]
  };

  const difficultyTrendData = [
    { year: '2020', difficulty: 6.5 },
    { year: '2021', difficulty: 7.0 },
    { year: '2022', difficulty: 7.3 },
    { year: '2023', difficulty: 7.8 },
    { year: '2024', difficulty: 8.1 }
  ];

  const currentSubjects = subjectData[selectedExam] || [];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600 bg-red-100';
      case 'decreasing': return 'text-green-600 bg-green-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

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
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Subject Weightage Visualizer</h1>
                <p className="text-purple-100 mt-2">
                  Interactive analysis of subject-wise weightage and difficulty trends
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Exam Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {exams.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Total Subjects</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">{currentSubjects.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Total Questions</h3>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {currentSubjects.reduce((sum, subject) => sum + subject.questions, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Avg Difficulty</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-2">
                  {(currentSubjects.reduce((sum, subject) => sum + subject.difficulty, 0) / currentSubjects.length).toFixed(1)}/10
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Total Marks</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {currentSubjects.reduce((sum, subject) => sum + subject.marks, 0)}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Weightage Distribution */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Weightage Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentSubjects}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="weightage"
                      nameKey="subject"
                    >
                      {currentSubjects.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Weightage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Difficulty Analysis */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Difficulty Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentSubjects}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="difficulty" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficulty Trend Over Years */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Difficulty Trend (2020-2024)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={difficultyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[5, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="difficulty" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Details Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Subject Analysis</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weightage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSubjects.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{subject.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{subject.weightage}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{subject.questions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{subject.marks}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(subject.difficulty / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{subject.difficulty}/10</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrendColor(subject.trend)}`}>
                            <span className="mr-1">{getTrendIcon(subject.trend)}</span>
                            {subject.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Study Recommendations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">High Priority Subjects</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  {currentSubjects
                    .filter(s => s.weightage >= 25 || s.difficulty >= 8)
                    .slice(0, 3)
                    .map((subject, index) => (
                      <li key={index}>• {subject.subject} ({subject.weightage}% weightage)</li>
                    ))}
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">Increasing Difficulty</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  {currentSubjects
                    .filter(s => s.trend === 'increasing')
                    .slice(0, 3)
                    .map((subject, index) => (
                      <li key={index}>• {subject.subject} (Difficulty: {subject.difficulty}/10)</li>
                    ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Wins</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {currentSubjects
                    .filter(s => s.difficulty < 7 && s.weightage >= 10)
                    .slice(0, 3)
                    .map((subject, index) => (
                      <li key={index}>• {subject.subject} (Easy + High weightage)</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}