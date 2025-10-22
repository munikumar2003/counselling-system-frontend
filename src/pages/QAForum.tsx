import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, ThumbsUp, Reply, Plus, Search, ListFilter as Filter, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  upvotes: number;
  answers: number;
  date: string;
  answered: boolean;
}

interface Answer {
  id: string;
  question_id: string;
  content: string;
  author: string;
  upvotes: number;
  date: string;
  best_answer: boolean;
}

export default function QAForum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const categories = [
    'All Categories', 'JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'CAT', 
    'College Selection', 'Counselling Process', 'Admission', 'Fees & Scholarships'
  ];

  const mockQuestions: Question[] = [
    {
      id: '1',
      title: 'What is the minimum JEE Main percentile required for NIT admission?',
      content: 'I scored 92 percentile in JEE Main and belong to OBC category. Can I get admission in any NIT for Computer Science?',
      author: 'Rahul Kumar',
      category: 'JEE Main',
      tags: ['JEE Main', 'NIT', 'Cutoff', 'OBC'],
      upvotes: 15,
      answers: 3,
      date: '2024-03-20',
      answered: true
    },
    {
      id: '2',
      title: 'NEET counselling process - State quota vs All India quota',
      content: 'Can someone explain the difference between state quota and all India quota in NEET counselling? Which one should I choose?',
      author: 'Priya Sharma',
      category: 'NEET',
      tags: ['NEET', 'Counselling', 'State Quota', 'AIQ'],
      upvotes: 22,
      answers: 5,
      date: '2024-03-18',
      answered: true
    },
    {
      id: '3',
      title: 'Is it worth taking a drop year for JEE preparation?',
      content: 'I got 85 percentile in JEE Main this year. Should I take a drop year to prepare again or join a decent college?',
      author: 'Arjun Patel',
      category: 'JEE Main',
      tags: ['JEE Main', 'Drop Year', 'Career Advice'],
      upvotes: 8,
      answers: 2,
      date: '2024-03-15',
      answered: false
    },
    {
      id: '4',
      title: 'GATE score vs College selection for M.Tech',
      content: 'I have a GATE score of 650. Which IITs/NITs can I target for M.Tech in Computer Science?',
      author: 'Sneha Reddy',
      category: 'GATE',
      tags: ['GATE', 'M.Tech', 'IIT', 'NIT'],
      upvotes: 12,
      answers: 4,
      date: '2024-03-12',
      answered: true
    },
    {
      id: '5',
      title: 'CAT percentile vs IIM admission chances',
      content: 'What CAT percentile is required for top IIMs? I have 2 years work experience.',
      author: 'Vikash Singh',
      category: 'CAT',
      tags: ['CAT', 'IIM', 'MBA', 'Work Experience'],
      upvotes: 18,
      answers: 6,
      date: '2024-03-10',
      answered: true
    }
  ];

  const mockAnswers: Answer[] = [
    {
      id: '1',
      question_id: '1',
      content: 'With 92 percentile and OBC category, you have good chances for NITs. The cutoff varies by state and branch, but you can expect admission in NITs like NIT Raipur, NIT Hamirpur for CS. Check the previous year cutoffs for better prediction.',
      author: 'Expert Counsellor',
      upvotes: 25,
      date: '2024-03-20',
      best_answer: true
    },
    {
      id: '2',
      question_id: '1',
      content: 'I had similar percentile last year and got NIT Kurukshetra CS through home state quota. Apply for both JoSAA and state counselling.',
      author: 'Alumni Student',
      upvotes: 12,
      date: '2024-03-20',
      best_answer: false
    }
  ];

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const submitQuestion = () => {
    if (!newQuestion.title || !newQuestion.content || !newQuestion.category) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Question posted successfully!');
    setShowAskQuestion(false);
    setNewQuestion({ title: '', content: '', category: '', tags: '' });
  };

  const getAnswersForQuestion = (questionId: string) => {
    return mockAnswers.filter(answer => answer.question_id === questionId);
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Q&A Forum</h1>
                  <p className="text-blue-100 mt-2">
                    Ask questions and get answers from the community
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAskQuestion(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ask Question</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
                      >
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{question.content}</p>
                    </div>
                    {question.answered && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        <Award className="w-3 h-3" />
                        <span>Answered</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">by {question.author}</span>
                      <span className="text-sm text-gray-500">{new Date(question.date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        question.category === 'JEE Main' ? 'bg-blue-100 text-blue-800' :
                        question.category === 'NEET' ? 'bg-green-100 text-green-800' :
                        question.category === 'GATE' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {question.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{question.upvotes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Reply className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{question.answers} answers</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Answers */}
                  {selectedQuestion === question.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Answers ({question.answers})</h4>
                      <div className="space-y-4">
                        {getAnswersForQuestion(question.id).map((answer) => (
                          <div key={answer.id} className={`p-4 rounded-lg ${
                            answer.best_answer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{answer.author}</span>
                                {answer.best_answer && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Best Answer
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span className="text-sm">{answer.upvotes}</span>
                                </button>
                                <span className="text-sm text-gray-500">
                                  {new Date(answer.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{answer.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Found</h3>
                <p className="text-gray-600">
                  No questions match your search criteria. Try adjusting your filters or be the first to ask!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ask Question Modal */}
        {showAskQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Ask a Question</h2>
                <p className="text-blue-100">Get help from the community</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Title *</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="What is your question?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Details *</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed information about your question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="JEE Main, Cutoff, NIT"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAskQuestion(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}