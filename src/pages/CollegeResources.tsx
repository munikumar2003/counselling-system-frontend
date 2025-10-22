import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Play, Users, MapPin, Star, Globe, Linkedin, Youtube, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CollegeResource {
  id: string;
  name: string;
  location: string;
  type: string;
  rating: number;
  campusVideo: string;
  virtualTour: string;
  officialWebsite: string;
  departmentLinks: {
    name: string;
    url: string;
  }[];
  alumniProfiles: {
    name: string;
    position: string;
    company: string;
    linkedinUrl: string;
    graduationYear: string;
  }[];
  socialMedia: {
    youtube: string;
    instagram: string;
    facebook: string;
  };
  highlights: string[];
  admissionBrochure: string;
  placementReport: string;
}

export default function CollegeResources() {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState('IIT Delhi');
  const [activeTab, setActiveTab] = useState('overview');

  const collegeResources: CollegeResource[] = [
    {
      id: '1',
      name: 'IIT Delhi',
      location: 'New Delhi',
      type: 'Government',
      rating: 4.8,
      campusVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      virtualTour: 'https://iitd.ac.in/virtual-tour',
      officialWebsite: 'https://home.iitd.ac.in/',
      departmentLinks: [
        { name: 'Computer Science & Engineering', url: 'https://cse.iitd.ac.in/' },
        { name: 'Electrical Engineering', url: 'https://ee.iitd.ac.in/' },
        { name: 'Mechanical Engineering', url: 'https://mech.iitd.ac.in/' },
        { name: 'Civil Engineering', url: 'https://civil.iitd.ac.in/' }
      ],
      alumniProfiles: [
        {
          name: 'Sundar Pichai',
          position: 'CEO',
          company: 'Google',
          linkedinUrl: 'https://linkedin.com/in/sundarpichai',
          graduationYear: '1993'
        },
        {
          name: 'Vinod Khosla',
          position: 'Co-founder',
          company: 'Sun Microsystems',
          linkedinUrl: 'https://linkedin.com/in/vinodkhosla',
          graduationYear: '1976'
        },
        {
          name: 'Rajeev Suri',
          position: 'Former CEO',
          company: 'Nokia',
          linkedinUrl: 'https://linkedin.com/in/rajeevsuri',
          graduationYear: '1989'
        }
      ],
      socialMedia: {
        youtube: 'https://youtube.com/c/IITDelhi',
        instagram: 'https://instagram.com/iitdelhi',
        facebook: 'https://facebook.com/IITDelhi'
      },
      highlights: [
        'Ranked #2 in NIRF Engineering Rankings 2023',
        'Average Package: ₹17.5 LPA',
        '100% Placement Rate',
        'Strong Industry Partnerships'
      ],
      admissionBrochure: '/brochures/iit-delhi-2024.pdf',
      placementReport: '/reports/iit-delhi-placement-2023.pdf'
    },
    {
      id: '2',
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      type: 'Private',
      rating: 4.7,
      campusVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      virtualTour: 'https://bits-pilani.ac.in/virtual-tour',
      officialWebsite: 'https://www.bits-pilani.ac.in/',
      departmentLinks: [
        { name: 'Computer Science & Information Systems', url: 'https://bits-pilani.ac.in/csis' },
        { name: 'Electronics & Communication', url: 'https://bits-pilani.ac.in/ece' },
        { name: 'Mechanical Engineering', url: 'https://bits-pilani.ac.in/mech' },
        { name: 'Chemical Engineering', url: 'https://bits-pilani.ac.in/chemical' }
      ],
      alumniProfiles: [
        {
          name: 'Sachin Bansal',
          position: 'Co-founder',
          company: 'Flipkart',
          linkedinUrl: 'https://linkedin.com/in/sachinbansal',
          graduationYear: '2005'
        },
        {
          name: 'Binny Bansal',
          position: 'Co-founder',
          company: 'Flipkart',
          linkedinUrl: 'https://linkedin.com/in/binnybansal',
          graduationYear: '2005'
        },
        {
          name: 'Bhavish Aggarwal',
          position: 'Co-founder & CEO',
          company: 'Ola',
          linkedinUrl: 'https://linkedin.com/in/bhavishaggarwal',
          graduationYear: '2008'
        }
      ],
      socialMedia: {
        youtube: 'https://youtube.com/c/BITSPilani',
        instagram: 'https://instagram.com/bitspilani',
        facebook: 'https://facebook.com/BITSPilani'
      },
      highlights: [
        'Ranked #25 in NIRF Engineering Rankings 2023',
        'Average Package: ₹15.2 LPA',
        'No Reservation Policy',
        'Strong Entrepreneurship Culture'
      ],
      admissionBrochure: '/brochures/bits-pilani-2024.pdf',
      placementReport: '/reports/bits-pilani-placement-2023.pdf'
    }
  ];

  const colleges = collegeResources.map(college => college.name);
  const currentCollege = collegeResources.find(college => college.name === selectedCollege);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'departments', name: 'Departments', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'alumni', name: 'Alumni', icon: <Users className="w-4 h-4" /> },
    { id: 'media', name: 'Media', icon: <Play className="w-4 h-4" /> }
  ];

  if (!currentCollege) return null;

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
              <BookOpen className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">College Resource Library</h1>
                <p className="text-green-100 mt-2">
                  Comprehensive information, videos, and resources for your preferred colleges
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* College Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select College</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>

            {/* College Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentCollege.name}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{currentCollege.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-600">{currentCollege.rating}/5</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentCollege.type === 'Government' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentCollege.type}
                    </span>
                  </div>
                </div>
                <a
                  href={currentCollege.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Official Website</span>
                </a>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Highlights</h3>
                    <ul className="space-y-2">
                      {currentCollege.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <a
                        href={currentCollege.admissionBrochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Admission Brochure 2024</span>
                      </a>
                      <a
                        href={currentCollege.placementReport}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Placement Report 2023</span>
                      </a>
                      <a
                        href={currentCollege.virtualTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Virtual Campus Tour</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCollege.departmentLinks.map((dept, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{dept.name}</h4>
                    <a
                      href={dept.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit Department Website</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'alumni' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCollege.alumniProfiles.map((alumni, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-900 text-lg">{alumni.name}</h4>
                    <p className="text-blue-600 font-medium">{alumni.position}</p>
                    <p className="text-gray-600">{alumni.company}</p>
                    <p className="text-sm text-gray-500 mb-4">Class of {alumni.graduationYear}</p>
                    <a
                      href={alumni.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campus Video</h3>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <a
                        href={currentCollege.campusVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Play className="w-8 h-8" />
                        <span>Watch Campus Tour</span>
                      </a>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                    <div className="space-y-3">
                      <a
                        href={currentCollege.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                      >
                        <Youtube className="w-5 h-5" />
                        <span>YouTube Channel</span>
                      </a>
                      <a
                        href={currentCollege.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Instagram</span>
                      </a>
                      <a
                        href={currentCollege.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Facebook</span>
                      </a>
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