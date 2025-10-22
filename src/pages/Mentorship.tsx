import React, { useState } from 'react';
import { ArrowLeft, Users, Calendar, Clock, Star, Video, MessageCircle, Award, CircleCheck as CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Mentor {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialization: string[];
  rating: number;
  reviews: number;
  price_per_hour: number;
  availability: string[];
  image: string;
  bio: string;
  achievements: string[];
}

interface Session {
  id: string;
  mentor_id: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'chat';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function Mentorship() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState<'video' | 'chat'>('video');

  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      title: 'Senior Educational Counsellor',
      experience: '15+ years',
      specialization: ['JEE Main', 'JEE Advanced', 'Engineering Counselling'],
      rating: 4.9,
      reviews: 245,
      price_per_hour: 2000,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former IIT professor with extensive experience in engineering counselling and career guidance.',
      achievements: ['IIT Delhi Alumni', '500+ Students Placed', 'Published Author']
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      title: 'Medical Counselling Expert',
      experience: '12+ years',
      specialization: ['NEET', 'Medical Counselling', 'MBBS Admission'],
      rating: 4.8,
      reviews: 189,
      price_per_hour: 1800,
      availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Medical professional turned counsellor, helping students navigate medical college admissions.',
      achievements: ['AIIMS Alumni', 'Medical Council Member', '300+ NEET Selections']
    },
    {
      id: '3',
      name: 'Prof. Amit Patel',
      title: 'MBA Admission Specialist',
      experience: '10+ years',
      specialization: ['CAT', 'MBA Counselling', 'IIM Preparation'],
      rating: 4.7,
      reviews: 156,
      price_per_hour: 2500,
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'IIM graduate with corporate experience, specializing in MBA admissions and career transitions.',
      achievements: ['IIM Ahmedabad Alumni', 'Fortune 500 Experience', '200+ MBA Admissions']
    },
    {
      id: '4',
      name: 'Dr. Sneha Reddy',
      title: 'GATE & M.Tech Counsellor',
      experience: '8+ years',
      specialization: ['GATE', 'M.Tech Admission', 'Research Guidance'],
      rating: 4.6,
      reviews: 98,
      price_per_hour: 1500,
      availability: ['Tuesday', 'Thursday', 'Friday', 'Sunday'],
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'PhD holder with research experience, guiding students for higher studies and research careers.',
      achievements: ['PhD from IISc', 'Research Publications', '150+ M.Tech Admissions']
    }
  ];

  const mockSessions: Session[] = [
    {
      id: '1',
      mentor_id: '1',
      date: '2024-04-15',
      time: '10:00 AM',
      duration: 60,
      type: 'video',
      status: 'upcoming'
    },
    {
      id: '2',
      mentor_id: '2',
      date: '2024-04-10',
      time: '2:00 PM',
      duration: 45,
      type: 'chat',
      status: 'completed'
    }
  ];

  const bookSession = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    if (user?.paymentStatus !== 'completed') {
      toast.error('Please upgrade to premium to book mentorship sessions');
      navigate('/payment');
      return;
    }

    toast.success('Session booked successfully! You will receive confirmation details via email.');
    setShowBooking(false);
    setSelectedMentor(null);
    setSelectedDate('');
    setSelectedTime('');
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

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Counselling Mentorship</h1>
                <p className="text-green-100 mt-2">
                  Get personalized guidance from experienced counsellors
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Premium Notice */}
            {user?.paymentStatus !== 'completed' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Premium Feature</h3>
                </div>
                <p className="text-orange-700 text-sm mb-4">
                  Mentorship sessions are available for premium users only. Upgrade now to book 1-on-1 sessions with expert counsellors.
                </p>
                <button
                  onClick={() => navigate('/payment')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            {/* My Sessions */}
            {user?.paymentStatus === 'completed' && mockSessions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockSessions.map((session) => {
                    const mentor = mentors.find(m => m.id === session.mentor_id);
                    return (
                      <div key={session.id} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{mentor?.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {session.type === 'video' ? <Video className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                            <span>{session.type}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Mentors */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Mentors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-blue-600 font-medium">{mentor.title}</p>
                        <p className="text-sm text-gray-600">{mentor.experience} experience</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(mentor.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {mentor.rating} ({mentor.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{mentor.bio}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Specialization:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialization.map((spec, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Achievements:</h4>
                      <ul className="space-y-1">
                        {mentor.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{mentor.price_per_hour}</span>
                        <span className="text-sm text-gray-600">/hour</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowBooking(true);
                        }}
                        disabled={user?.paymentStatus !== 'completed'}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && selectedMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Book Session</h2>
                <p className="text-green-100">with {selectedMentor.name}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSessionType('video')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        sessionType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <Video className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Video Call</div>
                      <div className="text-sm text-gray-600">Face-to-face session</div>
                    </button>
                    <button
                      onClick={() => setSessionType('chat')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        sessionType === 'chat' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Chat Session</div>
                      <div className="text-sm text-gray-600">Text-based guidance</div>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Session Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mentor:</span>
                      <span>{selectedMentor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>60 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{sessionType}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Cost:</span>
                      <span>₹{selectedMentor.price_per_hour}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowBooking(false);
                      setSelectedMentor(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={bookSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Session
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