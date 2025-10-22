import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calculator, TrendingUp, MapPin, Star, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ExamScore {
  examName: string;
  score: number;
  category: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  type: string;
  nirf_rank: number;
  fees: number;
  branches: string[];
  cutoffs: {
    [exam: string]: {
      [category: string]: number;
    };
  };
  rating: number;
  highlights: string[];
}

export default function MultiExamPredictor() {
  const { user, searchCount, incrementSearchCount } = useAuth();
  const navigate = useNavigate();
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const availableExams = [
    { id: 'jee_main', name: 'JEE Main', scoreType: 'Percentile (0-100)' },
    { id: 'mht_cet', name: 'MHT CET', scoreType: 'Percentile (0-100)' },
    { id: 'kcet', name: 'KCET', scoreType: 'Rank (1-200000)' },
    { id: 'comedk', name: 'COMEDK', scoreType: 'Rank (1-100000)' },
    { id: 'bitsat', name: 'BITSAT', scoreType: 'Score (0-450)' },
    { id: 'viteee', name: 'VITEEE', scoreType: 'Rank (1-500000)' }
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const mockColleges: College[] = [
    {
      id: '1',
      name: 'IIT Delhi',
      location: 'New Delhi',
      type: 'Government',
      nirf_rank: 2,
      fees: 200000,
      branches: ['Computer Science', 'Electrical', 'Mechanical'],
      cutoffs: {
        jee_main: { General: 99.5, OBC: 99.0, SC: 95.0, ST: 90.0, EWS: 99.2 },
        mht_cet: { General: 99.8, OBC: 99.3, SC: 96.0, ST: 92.0, EWS: 99.5 }
      },
      rating: 4.8,
      highlights: ['Top Placements', 'Research Excellence', 'World-class Faculty']
    },
    {
      id: '2',
      name: 'COEP Pune',
      location: 'Pune, Maharashtra',
      type: 'Government',
      nirf_rank: 45,
      fees: 150000,
      branches: ['Computer Science', 'IT', 'Mechanical', 'Civil'],
      cutoffs: {
        jee_main: { General: 95.0, OBC: 92.0, SC: 85.0, ST: 80.0, EWS: 94.0 },
        mht_cet: { General: 99.2, OBC: 98.5, SC: 95.0, ST: 90.0, EWS: 98.8 }
      },
      rating: 4.5,
      highlights: ['Strong Alumni Network', 'Industry Connections', 'Good Campus']
    },
    {
      id: '3',
      name: 'VJTI Mumbai',
      location: 'Mumbai, Maharashtra',
      type: 'Government',
      nirf_rank: 52,
      fees: 120000,
      branches: ['Computer Science', 'Electronics', 'Mechanical'],
      cutoffs: {
        jee_main: { General: 94.0, OBC: 91.0, SC: 83.0, ST: 78.0, EWS: 93.0 },
        mht_cet: { General: 98.8, OBC: 98.0, SC: 94.0, ST: 88.0, EWS: 98.5 }
      },
      rating: 4.4,
      highlights: ['Mumbai Location', 'Industry Exposure', 'Good Placements']
    },
    {
      id: '4',
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      type: 'Private',
      nirf_rank: 25,
      fees: 450000,
      branches: ['Computer Science', 'Electronics', 'Mechanical', 'Chemical'],
      cutoffs: {
        bitsat: { General: 350, OBC: 340, SC: 320, ST: 310, EWS: 345 },
        jee_main: { General: 97.0, OBC: 95.0, SC: 88.0, ST: 85.0, EWS: 96.5 }
      },
      rating: 4.7,
      highlights: ['No Reservation', 'Excellent Placements', 'Industry Partnerships']
    },
    {
      id: '5',
      name: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      type: 'Private',
      nirf_rank: 15,
      fees: 400000,
      branches: ['Computer Science', 'IT', 'Electronics', 'Mechanical'],
      cutoffs: {
        viteee: { General: 50000, OBC: 60000, SC: 80000, ST: 90000, EWS: 55000 },
        jee_main: { General: 92.0, OBC: 89.0, SC: 82.0, ST: 78.0, EWS: 91.0 }
      },
      rating: 4.3,
      highlights: ['International Exposure', 'Modern Infrastructure', 'Research Focus']
    }
  ];

  const addExamScore = () => {
    if (examScores.length >= 3) {
      toast.error('Maximum 3 exams allowed');
      return;
    }
    setExamScores([...examScores, { examName: '', score: 0, category: 'General' }]);
  };

  const updateExamScore = (index: number, field: keyof ExamScore, value: string | number) => {
    const updated = [...examScores];
    updated[index] = { ...updated[index], [field]: value };
    setExamScores(updated);
  };

  const removeExamScore = (index: number) => {
    setExamScores(examScores.filter((_, i) => i !== index));
  };

  const predictColleges = async () => {
    if (examScores.length === 0) {
      toast.error('Please add at least one exam score');
      return;
    }

    if (user?.paymentStatus !== 'completed' && searchCount >= 3) {
      toast.error('Free searches exhausted. Please upgrade to premium.');
      navigate('/payment');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter colleges based on multiple exam scores
      const eligibleColleges = mockColleges.filter(college => {
        return examScores.some(examScore => {
          const cutoff = college.cutoffs[examScore.examName]?.[examScore.category];
          if (!cutoff) return false;
          
          // Different logic for different exam types
          if (examScore.examName.includes('rank') || examScore.examName === 'viteee') {
            return examScore.score <= cutoff; // Lower rank is better
          } else {
            return examScore.score >= cutoff; // Higher score is better
          }
        });
      });

      setResults(eligibleColleges);
      setShowResults(true);
      incrementSearchCount();
      toast.success(`Found ${eligibleColleges.length} colleges based on your multiple exam scores!`);
    } catch (error) {
      toast.error('Failed to predict colleges');
    } finally {
      setLoading(false);
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
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Multi-Exam Predictor</h1>
                <p className="text-blue-100 mt-2">
                  Compare results from multiple entrance exams and get comprehensive college predictions
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!showResults ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">How it works</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Add scores from multiple exams (JEE Main + State CET, etc.) and get unified college predictions. 
                    Our algorithm considers all your exam performances to suggest the best colleges.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Your Exam Scores</h2>
                    <button
                      onClick={addExamScore}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Exam
                    </button>
                  </div>

                  {examScores.map((examScore, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exam Name
                          </label>
                          <select
                            value={examScore.examName}
                            onChange={(e) => updateExamScore(index, 'examName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Exam</option>
                            {availableExams.map(exam => (
                              <option key={exam.id} value={exam.id}>{exam.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Score/Rank
                          </label>
                          <input
                            type="number"
                            value={examScore.score}
                            onChange={(e) => updateExamScore(index, 'score', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter score"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={examScore.category}
                            onChange={(e) => updateExamScore(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeExamScore(index)}
                            className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {examScores.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No exam scores added yet. Click "Add Exam" to get started.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={predictColleges}
                  disabled={loading || examScores.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? 'Analyzing Your Scores...' : 'Predict My Colleges'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Prediction Results ({results.length} colleges found)
                  </h2>
                  <button
                    onClick={() => setShowResults(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    New Search
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Exam Scores:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {examScores.map((score, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg">
                        <div className="font-medium text-gray-900">
                          {availableExams.find(e => e.id === score.examName)?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Score: {score.score} | Category: {score.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((college) => (
                    <div key={college.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{college.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{college.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">NIRF Rank</div>
                          <div className="font-semibold text-blue-600">#{college.nirf_rank}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Annual Fees</div>
                          <div className="font-semibold text-green-600">₹{college.fees.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Available Branches</div>
                        <div className="flex flex-wrap gap-2">
                          {college.branches.slice(0, 3).map((branch, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {branch}
                            </span>
                          ))}
                          {college.branches.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              +{college.branches.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {college.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {results.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Colleges Found</h3>
                    <p className="text-gray-600">
                      Based on your current scores, no colleges match the criteria. 
                      Consider adding more exam scores or check your inputs.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}