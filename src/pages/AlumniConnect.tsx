import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, MapPin, Briefcase, Star, MessageCircle, Linkedin, Mail, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Alumni {
  id: string;
  name: string;
  college: string;
  branch: string;
  graduation_year: string;
  current_position: string;
  company: string;
  location: string;
  image: string;
  story: string;
  achievements: string[];
  advice: string;
  linkedin: string;
  email: string;
  rating: number;
}

export default function AlumniConnect() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  const colleges = [
    'All Colleges', 'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 
    'VIT Vellore', 'DTU Delhi', 'AIIMS Delhi', 'CMC Vellore', 'IIM Ahmedabad'
  ];

  const alumni: Alumni[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      college: 'IIT Delhi',
      branch: 'Computer Science Engineering',
      graduation_year: '2018',
      current_position: 'Senior Software Engineer',
      company: 'Google',
      location: 'Bangalore, India',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'Started my journey at IIT Delhi with a dream to work at a top tech company. Through consistent hard work, coding practice, and leveraging the excellent placement opportunities at IIT, I landed my dream job at Google.',
      achievements: ['Google Software Engineer', 'Published 5 Research Papers', 'Mentored 50+ Students'],
      advice: 'Focus on building strong fundamentals in programming and mathematics. Participate in coding competitions and contribute to open source projects. The IIT tag opens doors, but your skills determine how far you go.',
      linkedin: 'https://linkedin.com/in/rahulsharma',
      email: 'rahul.sharma@example.com',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Priya Patel',
      college: 'AIIMS Delhi',
      branch: 'MBBS',
      graduation_year: '2019',
      current_position: 'Resident Doctor',
      company: 'AIIMS Delhi',
      location: 'New Delhi, India',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'My journey to AIIMS was challenging but rewarding. After clearing NEET with a top rank, I chose AIIMS Delhi for its excellent clinical exposure and research opportunities. Currently pursuing my specialization in Cardiology.',
      achievements: ['NEET AIR 45', 'Published Medical Research', 'Community Health Volunteer'],
      advice: 'NEET preparation requires dedication and consistent study. Focus on NCERT books and practice previous year questions. AIIMS provides the best medical education in India - make the most of every opportunity.',
      linkedin: 'https://linkedin.com/in/priyapatel',
      email: 'priya.patel@example.com',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Arjun Kumar',
      college: 'IIM Ahmedabad',
      branch: 'MBA',
      graduation_year: '2020',
      current_position: 'Product Manager',
      company: 'Amazon',
      location: 'Seattle, USA',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'After working as an engineer for 3 years, I decided to pursue MBA from IIM Ahmedabad. The rigorous curriculum and case study method prepared me well for the corporate world. Now working as a Product Manager at Amazon.',
      achievements: ['CAT 99.8 Percentile', 'Amazon Product Manager', 'Led 10+ Product Launches'],
      advice: 'CAT preparation requires strategic planning and consistent practice. Focus on time management and accuracy. IIM Ahmedabad offers unparalleled opportunities - network well and make lifelong connections.',
      linkedin: 'https://linkedin.com/in/arjunkumar',
      email: 'arjun.kumar@example.com',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      college: 'NIT Trichy',
      branch: 'Electronics and Communication',
      graduation_year: '2017',
      current_position: 'Senior Hardware Engineer',
      company: 'Intel',
      location: 'Bangalore, India',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'NIT Trichy provided me with excellent technical foundation and industry exposure. Started with internships at top companies and gradually built my expertise in hardware design. Currently working on cutting-edge processor technologies at Intel.',
      achievements: ['Intel Senior Engineer', '3 Patents Filed', 'IEEE Conference Speaker'],
      advice: 'NITs offer great opportunities for both higher studies and placements. Focus on practical projects and internships. Build a strong network with seniors and alumni - they are always willing to help.',
      linkedin: 'https://linkedin.com/in/snehareddy',
      email: 'sneha.reddy@example.com',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Vikash Singh',
      college: 'BITS Pilani',
      branch: 'Computer Science Engineering',
      graduation_year: '2019',
      current_position: 'Data Scientist',
      company: 'Microsoft',
      location: 'Hyderabad, India',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'BITS Pilani\'s flexible curriculum allowed me to explore various fields. I developed interest in machine learning and data science through electives and projects. The no-reservation policy ensured merit-based environment.',
      achievements: ['Microsoft Data Scientist', 'Kaggle Expert', 'AI Research Publications'],
      advice: 'BITS offers great flexibility in choosing courses. Explore different fields and find your passion. The campus culture is amazing - participate in fests and technical events. Build projects and showcase your skills.',
      linkedin: 'https://linkedin.com/in/vikashsingh',
      email: 'vikash.singh@example.com',
      rating: 4.5
    },
    {
      id: '6',
      name: 'Ananya Gupta',
      college: 'VIT Vellore',
      branch: 'Information Technology',
      graduation_year: '2020',
      current_position: 'Software Developer',
      company: 'Flipkart',
      location: 'Bangalore, India',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      story: 'VIT provided me with modern infrastructure and industry-relevant curriculum. The diverse student community and international exposure helped me grow personally and professionally. Secured placement at Flipkart through campus recruitment.',
      achievements: ['Flipkart Software Developer', 'Hackathon Winner', 'Open Source Contributor'],
      advice: 'VIT has excellent placement opportunities and modern facilities. Focus on coding skills and participate in hackathons. The faculty is supportive - don\'t hesitate to seek guidance for projects and career advice.',
      linkedin: 'https://linkedin.com/in/ananyagupta',
      email: 'ananya.gupta@example.com',
      rating: 4.4
    }
  ];

  const filteredAlumni = selectedCollege === 'all' 
    ? alumni 
    : alumni.filter(alum => alum.college === selectedCollege);

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
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Alumni Connect</h1>
                <p className="text-purple-100 mt-2">
                  Get inspired by success stories and connect with alumni
                </p>
              </div>
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

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((alum) => (
                <div key={alum.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <img
                      src={alum.image}
                      alt={alum.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="text-lg font-bold text-gray-900">{alum.name}</h3>
                    <p className="text-blue-600 font-medium">{alum.current_position}</p>
                    <p className="text-sm text-gray-600">{alum.company}</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      {renderStars(alum.rating)}
                      <span className="text-sm text-gray-600 ml-1">{alum.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{alum.college} • {alum.branch}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>Class of {alum.graduation_year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{alum.location}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {alum.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <a
                        href={alum.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${alum.email}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedAlumni(alum)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                      Read Story
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredAlumni.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Alumni Found</h3>
                <p className="text-gray-600">
                  No alumni found for the selected college. Try selecting a different college.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alumni Story Modal */}
        {selectedAlumni && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedAlumni.image}
                    alt={selectedAlumni.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedAlumni.name}</h2>
                    <p className="text-purple-100">{selectedAlumni.current_position} at {selectedAlumni.company}</p>
                    <p className="text-purple-200 text-sm">{selectedAlumni.college} • {selectedAlumni.branch}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Story</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedAlumni.story}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Achievements</h3>
                  <ul className="space-y-2">
                    {selectedAlumni.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Advice for Students</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-700 italic">"{selectedAlumni.advice}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <a
                      href={selectedAlumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Connect on LinkedIn</span>
                    </a>
                    <a
                      href={`mailto:${selectedAlumni.email}`}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedAlumni(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
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