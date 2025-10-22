import React, { useState } from 'react';
import { ArrowLeft, Star, ThumbsUp, MessageCircle, Shield, Upload, CircleCheck as CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  college: string;
  branch: string;
  student_name: string;
  batch: string;
  rating: number;
  placement_rating: number;
  faculty_rating: number;
  campus_rating: number;
  review_text: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  helpful_count: number;
  date: string;
}

export default function StudentReviews() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    college: '',
    branch: '',
    student_name: '',
    batch: '',
    rating: 5,
    placement_rating: 5,
    faculty_rating: 5,
    campus_rating: 5,
    review_text: '',
    pros: '',
    cons: '',
    admission_proof: null as File | null
  });

  const colleges = [
    'All Colleges', 'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 
    'VIT Vellore', 'DTU Delhi', 'AIIMS Delhi', 'CMC Vellore'
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      college: 'IIT Delhi',
      branch: 'Computer Science Engineering',
      student_name: 'Rahul Sharma',
      batch: '2020-2024',
      rating: 4.5,
      placement_rating: 5,
      faculty_rating: 4,
      campus_rating: 4,
      review_text: 'Excellent college with world-class faculty and amazing placement opportunities. The campus life is vibrant and there are numerous opportunities for research and innovation.',
      pros: ['Excellent placements', 'World-class faculty', 'Great research opportunities', 'Strong alumni network'],
      cons: ['High competition', 'Stressful environment', 'Limited seats'],
      verified: true,
      helpful_count: 45,
      date: '2024-03-15'
    },
    {
      id: '2',
      college: 'BITS Pilani',
      branch: 'Electronics and Communication',
      student_name: 'Priya Patel',
      batch: '2019-2023',
      rating: 4.2,
      placement_rating: 4,
      faculty_rating: 4,
      campus_rating: 5,
      review_text: 'BITS Pilani offers a great balance of academics and extracurricular activities. The no-reservation policy ensures merit-based admissions. Campus infrastructure is top-notch.',
      pros: ['Beautiful campus', 'No reservation policy', 'Good industry connections', 'Flexible curriculum'],
      cons: ['High fees', 'Remote location', 'Limited government job opportunities'],
      verified: true,
      helpful_count: 32,
      date: '2024-02-28'
    },
    {
      id: '3',
      college: 'NIT Trichy',
      branch: 'Mechanical Engineering',
      student_name: 'Arjun Kumar',
      batch: '2018-2022',
      rating: 4.0,
      placement_rating: 4,
      faculty_rating: 4,
      campus_rating: 4,
      review_text: 'One of the best NITs in India. Good placement record and experienced faculty. The campus has all necessary facilities and the student community is very supportive.',
      pros: ['Good placements', 'Experienced faculty', 'Strong alumni network', 'Affordable fees'],
      cons: ['Language barrier initially', 'Hot climate', 'Limited research funding'],
      verified: true,
      helpful_count: 28,
      date: '2024-01-20'
    },
    {
      id: '4',
      college: 'VIT Vellore',
      branch: 'Information Technology',
      student_name: 'Sneha Reddy',
      batch: '2020-2024',
      rating: 3.8,
      placement_rating: 4,
      faculty_rating: 3,
      campus_rating: 4,
      review_text: 'VIT has good infrastructure and placement opportunities. However, the faculty quality varies across departments. The campus is modern with good facilities.',
      pros: ['Modern infrastructure', 'Good placements', 'International exposure', 'Diverse student body'],
      cons: ['Inconsistent faculty quality', 'High fees', 'Strict attendance policy'],
      verified: true,
      helpful_count: 22,
      date: '2024-03-10'
    },
    {
      id: '5',
      college: 'DTU Delhi',
      branch: 'Civil Engineering',
      student_name: 'Vikash Singh',
      batch: '2019-2023',
      rating: 4.1,
      placement_rating: 3,
      faculty_rating: 4,
      campus_rating: 3,
      review_text: 'DTU is a good college with decent faculty and placement opportunities. Being in Delhi provides additional advantages for internships and job opportunities.',
      pros: ['Delhi location advantage', 'Good faculty', 'Affordable fees', 'Industry connections'],
      cons: ['Limited campus space', 'Air pollution', 'Average placements for some branches'],
      verified: true,
      helpful_count: 18,
      date: '2024-02-15'
    }
  ];

  const filteredReviews = selectedCollege === 'all' 
    ? mockReviews 
    : mockReviews.filter(review => review.college === selectedCollege);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewReview({ ...newReview, admission_proof: file });
    }
  };

  const submitReview = () => {
    if (!newReview.college || !newReview.branch || !newReview.student_name || !newReview.review_text) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (!newReview.admission_proof) {
      toast.error('Please upload admission proof for verification');
      return;
    }

    toast.success('Review submitted successfully! It will be published after verification.');
    setShowAddReview(false);
    setNewReview({
      college: '',
      branch: '',
      student_name: '',
      batch: '',
      rating: 5,
      placement_rating: 5,
      faculty_rating: 5,
      campus_rating: 5,
      review_text: '',
      pros: '',
      cons: '',
      admission_proof: null
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Student Reviews & Ratings</h1>
                  <p className="text-purple-100 mt-2">
                    Verified reviews from students who studied at these colleges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddReview(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Add Review
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {colleges.map(college => (
                  <option key={college} value={college === 'All Colleges' ? 'all' : college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{review.college}</h3>
                        {review.verified && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            <Shield className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600">{review.branch}</p>
                      <p className="text-sm text-gray-500">
                        By {review.student_name} • Batch {review.batch} • {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(review.rating)}
                        <span className="text-lg font-bold text-gray-900 ml-2">{review.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">Overall Rating</p>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        {renderStars(review.placement_rating)}
                      </div>
                      <p className="text-sm text-gray-600">Placements</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        {renderStars(review.faculty_rating)}
                      </div>
                      <p className="text-sm text-gray-600">Faculty</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        {renderStars(review.campus_rating)}
                      </div>
                      <p className="text-sm text-gray-600">Campus Life</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.review_text}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Pros:</h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Cons:</h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-4 h-4 text-red-500">•</span>
                            <span className="text-sm text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Helpful ({review.helpful_count})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-600">
                  No reviews found for the selected college. Be the first to add a review!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Add Your Review</h2>
                <p className="text-purple-100">Share your experience to help other students</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
                    <select
                      value={newReview.college}
                      onChange={(e) => setNewReview({ ...newReview, college: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select College</option>
                      {colleges.slice(1).map(college => (
                        <option key={college} value={college}>{college}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                    <input
                      type="text"
                      value={newReview.branch}
                      onChange={(e) => setNewReview({ ...newReview, branch: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Computer Science Engineering"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={newReview.student_name}
                      onChange={(e) => setNewReview({ ...newReview, student_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <input
                      type="text"
                      value={newReview.batch}
                      onChange={(e) => setNewReview({ ...newReview, batch: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 2020-2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
                  <textarea
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Share your detailed experience..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pros (comma separated)</label>
                    <textarea
                      value={newReview.pros}
                      onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Good placements, Great faculty, Modern infrastructure"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cons (comma separated)</label>
                    <textarea
                      value={newReview.cons}
                      onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="High fees, Strict rules, Limited research"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Admission Proof * (for verification)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="admission-proof"
                    />
                    <label htmlFor="admission-proof" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Click to upload admission letter or ID card
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    {newReview.admission_proof && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {newReview.admission_proof.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Submit Review
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