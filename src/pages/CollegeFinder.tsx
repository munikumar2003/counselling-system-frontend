import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, ListFilter as Filter, MapPin, Users, Star, TrendingUp, BookOpen, Award, ChevronRight, Building, DollarSign, Lock, Zap, Crown, X, Check, Download, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExamData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  scoreType: 'marks' | 'percentile' | 'rank';
  maxScore: number;
  categories: string[];
}

interface College {
  id: string;
  name: string;
  location: string;
  type: 'government' | 'private' | 'deemed';
  rating: number;
  fees: number;
  branches: string[];
  cutoffs: {
    [branch: string]: {
      [category: string]: number;
    };
  };
  nirf_ranking?: number;
  established: number;
  seats: number;
  highlights?: string[];
  popularityScore: number;
}

interface SelectedCollege extends College {
  selectedBranches: string[];
  preference: number;
}

export default function CollegeFinder() {
  const { user, searchCount, incrementSearchCount } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Exam Selection, 2: Score/Category/Branch, 3: Results
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [score, setScore] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [results, setResults] = useState<College[]>([]);
  const [filteredResults, setFilteredResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [filterBy, setFilterBy] = useState('popularity');
  const [selectedColleges, setSelectedColleges] = useState<SelectedCollege[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [homeState, setHomeState] = useState('no');

  const exams: ExamData[] = [
    {
      id: 'jee_main',
      name: 'JEE Main',
      description: 'Joint Entrance Examination for Engineering',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      scoreType: 'rank',
      maxScore: 1000000,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    },
    {
      id: 'jee_advanced',
      name: 'JEE Advanced',
      description: 'For admission to IITs',
      icon: <Award className="w-8 h-8 text-green-600" />,
      scoreType: 'rank',
      maxScore: 100000,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    },
    {
      id: 'neet',
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test for Medical',
      icon: <Users className="w-8 h-8 text-red-600" />,
      scoreType: 'marks',
      maxScore: 720,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    },
    {
      id: 'gate',
      name: 'GATE',
      description: 'Graduate Aptitude Test in Engineering',
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      scoreType: 'marks',
      maxScore: 1000,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    },
    {
      id: 'cat',
      name: 'CAT',
      description: 'Common Admission Test for MBA',
      icon: <Building className="w-8 h-8 text-orange-600" />,
      scoreType: 'percentile',
      maxScore: 100,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    }
  ];

  const branches = {
    jee_main: ['Computer Science Engineering','Artificial Engineering','Data Science and Engineering','Information Technology', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering','Chemical Engineering', 'Aerospace Engineering', 'Biotechnology','Textile Technology','Instrumentation and Control Engineering', 'Mathematics and Computing','Industrial and Production Engineering','Mining Engineering','Metallurgy and Materials Engineering'],
    jee_advanced: ['Computer Science Engineering','Data Science and Artificial Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Metallurgical Engineering','Environmental Science and Engineering','Industrial Engineering','Engineering Physics','Chemistry','Economics','Mathematics'],
    neet: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'Veterinary Science', 'B.Sc Nursing', 'Physiotherapy'],
    gate: ['Computer Science Engineering','Artificial Engineering','Data Science and Engineering','Information Technology', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering','Chemical Engineering', 'Aerospace Engineering', 'Biotechnology','Textile Technology','Instrumentation and Control Engineering', 'Mathematics and Computing','Industrial and Production Engineering','Mining Engineering','Metallurgy and Materials Engineering'],
    cat: ['MBA', 'PGDM', 'Executive MBA','MBA in Business Analytics', 'MBA in Finance', 'MBA in Marketing', 'MBA in HR', 'MBA in Operations','MBA in Public Policy', 'MBA in International Business']
  };

  // Enhanced mock college data with 10 colleges per exam
  const mockColleges: { [key: string]: College[] } = {
    jee_main: [
      {
        id: '1',
        name: 'Indian Institute of Technology, Delhi',
        location: 'New Delhi',
        type: 'government',
        rating: 4.8,
        fees: 200000,
        branches: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 99.5, obc: 99.2, sc: 98.5, st: 97.8, ews: 99.3 },
          'Mechanical Engineering': { general: 99.2, obc: 98.9, sc: 98.2, st: 97.5, ews: 99.0 }
        },
        nirf_ranking: 2,
        established: 1961,
        seats: 1200,
        highlights: ['Top IIT', 'Excellent Placements', 'Research Excellence'],
        popularityScore: 98
      }
    ],
    neet: [
      {
        id: '31',
        name: 'All Institute of Medical Sciences, Delhi',
        location: 'New Delhi',
        type: 'government',
        rating: 4.9,
        fees: 50000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 720, obc: 701, sc: 612, st: 603, ews: 715 },
          'BDS': { general: 680, obc: 661, sc: 572, st: 563, ews: 675 }
        },
        nirf_ranking: 1,
        established: 1956,
        seats: 125,
        highlights: ['Premier Medical Institute', 'Excellent Faculty', 'Research Excellence'],
        popularityScore: 99
      },
      {
        id: '32',
        name: 'Christian Medical College, Vellore',
        location: 'Vellore, Tamil Nadu',
        type: 'private',
        rating: 4.8,
        fees: 2000000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 715, obc: 696, sc: 607, st: 598, ews: 710 },
          'BDS': { general: 675, obc: 656, sc: 567, st: 558, ews: 670 }
        },
        nirf_ranking: 2,
        established: 1900,
        seats: 100,
        highlights: ['Christian Institution', 'Heritage College', 'Excellent Healthcare'],
        popularityScore: 96
      }
    ],
    cat: [
      {
        id: '91',
        name: 'Indian Institute of Management, Ahmedabad',
        location: 'Ahmedabad, Gujarat',
        type: 'government',
        rating: 4.9,
        fees: 2500000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 99.5, obc: 99.2, sc: 98.5, st: 98.0, ews: 99.3 },
          'PGDM': { general: 99.0, obc: 98.7, sc: 98.0, st: 97.5, ews: 98.8 }
        },
        nirf_ranking: 1,
        established: 1961,
        seats: 400,
        highlights: ['Top IIM', 'Excellent Placements', 'Global Recognition'],
        popularityScore: 99
      },
      {
        id: '92',
        name: 'Indian Institute of Management, Bangalore',
        location: 'Bangalore, Karnataka',
        type: 'government',
        rating: 4.8,
        fees: 2400000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 99.3, obc: 99.0, sc: 98.3, st: 97.8, ews: 99.1 },
          'PGDM': { general: 98.8, obc: 98.5, sc: 97.8, st: 97.3, ews: 98.6 }
        },
        nirf_ranking: 2,
        established: 1973,
        seats: 400,
        highlights: ['Premier IIM', 'Bangalore Location', 'Industry Connect'],
        popularityScore: 97
      }
    ],
    gate: [
      {
        id: '121',
        name: 'Indian Institute of Science, Bangalore',
        location: 'Bangalore, Karnataka',
        type: 'government',
        rating: 4.9,
        fees: 150000,
        branches: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science': { general: 850, obc: 820, sc: 750, st: 720, ews: 840 },
          'Electrical Engineering': { general: 800, obc: 770, sc: 700, st: 670, ews: 790 }
        },
        nirf_ranking: 1,
        established: 1909,
        seats: 300,
        highlights: ['Premier Research Institute', 'Excellent Faculty', 'Innovation Hub'],
        popularityScore: 99
      },
      {
        id: '122',
        name: 'Indian Institute of Technology, Kanpur',
        location: 'Kanpur, Uttar Pradesh',
        type: 'government',
        rating: 4.8,
        fees: 180000,
        branches: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
        cutoffs: {
          'Computer Science': { general: 820, obc: 790, sc: 720, st: 690, ews: 810 },
          'Mechanical Engineering': { general: 780, obc: 750, sc: 680, st: 650, ews: 770 }
        },
        nirf_ranking: 4,
        established: 1959,
        seats: 400,
        highlights: ['Top IIT', 'Research Excellence', 'Strong Alumni'],
        popularityScore: 96
      },
      {
        id: '123',
        name: 'Indian Institute of Technology, Bombay',
        location: 'Mumbai, Maharashtra',
        type: 'government',
        rating: 4.8,
        fees: 190000,
        branches: ['Computer Science', 'Electrical Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science': { general: 830, obc: 800, sc: 730, st: 700, ews: 820 },
          'Electrical Engineering': { general: 790, obc: 760, sc: 690, st: 660, ews: 780 }
        },
        nirf_ranking: 3,
        established: 1958,
        seats: 450,
        highlights: ['Mumbai Location', 'Industry Connect', 'Premier IIT'],
        popularityScore: 97
      }
    ],
    jee_advanced: [
      {
        id: '151',
        name: 'Indian Institute of Technology, Bombay',
        location: 'Mumbai, Maharashtra',
        type: 'government',
        rating: 4.9,
        fees: 220000,
        branches: ['Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 63, obc: 81, sc: 162, st: 224, ews: 71 },
          'Electrical Engineering': { general: 154, obc: 198, sc: 312, st: 428, ews: 172 }
        },
        nirf_ranking: 3,
        established: 1958,
        seats: 800,
        highlights: ['Top IIT', 'Mumbai Location', 'Excellent Placements'],
        popularityScore: 99
      },
      {
        id: '152',
        name: 'Indian Institute of Technology, Delhi',
        location: 'New Delhi',
        type: 'government',
        rating: 4.9,
        fees: 215000,
        branches: ['Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 75, obc: 95, sc: 185, st: 248, ews: 84 },
          'Electrical Engineering': { general: 168, obc: 215, sc: 335, st: 452, ews: 186 }
        },
        nirf_ranking: 2,
        established: 1961,
        seats: 850,
        highlights: ['Premier IIT', 'Delhi Location', 'Research Excellence'],
        popularityScore: 98
      }
    ]
  };

  const handleExamSelect = (exam: ExamData) => {
    setSelectedExam(exam);
    setStep(2);
  };

  const handleBranchToggle = (branch: string) => {
    setSelectedBranches(prev => 
      prev.includes(branch) 
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  const handleSearch = async () => {
    if (!selectedExam || !score || selectedBranches.length === 0) {
      return;
    }

    // Check if user has exceeded free searches
    if (user?.paymentStatus !== 'completed' && searchCount >= 3) {
      toast.error('You have used all 3 free searches. Please upgrade to continue.');
      navigate('/payment');
      return;
    }

    setShowDisclaimer(true);
  };

  const proceedWithSearch = async () => {
  setShowDisclaimer(false);
  setLoading(true);

  try {

    const userId = user?.id;
    // Prepare request body
    console.log(selectedExam);
    const requestBody = {
      score: parseFloat(score),
      category: category.toLowerCase(),
      selectedBranches: selectedBranches,
      ...((selectedExam?.id === "jee_main") && { homeState: homeState === "yes" }),
      userId,
    };

    // Choose correct API endpoint based on selected exam
    let apiUrl = "";
    if (selectedExam?.id === "jee_main") {
      apiUrl = "http://localhost:8080/api/jee-mains/eligible-colleges";
    } else if (selectedExam?.id === "jee_advanced") {
      apiUrl = "http://localhost:8080/api/jee-advanced/eligible-colleges";
    } else if (selectedExam?.id === "neet") {
      apiUrl = "http://localhost:8080/api/neet/eligible-colleges";
    }else if (selectedExam?.id === "gate") {
      apiUrl = "http://localhost:8080/api/gate/eligible-colleges";
    }else if (selectedExam?.id === "cat") {
      apiUrl = "http://localhost:8080/api/cat/eligible-colleges";
    } else {
      throw new Error("Invalid exam selection");
    }

    // 🔥 Make POST request to backend
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch results from backend");
    }

    const data = await response.json();

    // Sort by popularity_score (descending)
    const sortedColleges = [...data].sort(
      (a, b) => b.popularityScore - a.popularityScore
    );

    // Update UI state
    setResults(sortedColleges);
    setFilteredResults(sortedColleges);
    setStep(3);

    // Increment search count only if not premium user
    if (user?.paymentStatus !== "completed") {
      incrementSearchCount();
    }

    toast.success(`Found ${sortedColleges.length} matching colleges!`);
  } catch (error) {
    console.error("Search failed:", error);
    toast.error("Search failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleFilterChange = (filterType: string) => {
    setFilterBy(filterType);
    let sortedResults = [...results];

    switch (filterType) {
      case 'popularityScore':
        sortedResults.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case 'nirf':
        sortedResults.sort((a, b) => (a.nirf_ranking || 999) - (b.nirf_ranking || 999));
        break;
      case 'private':
        sortedResults = results.filter(college => college.type === 'private');
        break;
      case 'government':
        sortedResults = results.filter(college => college.type === 'government');
        break;
      case 'fees_low_high':
        sortedResults.sort((a, b) => a.fees - b.fees);
        break;
      default:
        break;
    }

    setFilteredResults(sortedResults);
  };

  const handleCollegeSelect = (college: College) => {
    const availableBranches = selectedBranches.filter(branch => college.branches.includes(branch));
    
    if (selectedColleges.find(c => c.id === college.id)) {
      setSelectedColleges(prev => prev.filter(c => c.id !== college.id));
      toast.success('College removed from selection');
    } else {
      const newSelection: SelectedCollege = {
        ...college,
        selectedBranches: availableBranches,
        preference: selectedColleges.length + 1
      };
      setSelectedColleges(prev => [...prev, newSelection]);
      toast.success('College added to selection');
    }
  };

  const moveCollegeUp = (index: number) => {
    if (index > 0) {
      const newList = [...selectedColleges];
      [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
      newList.forEach((college, idx) => {
        college.preference = idx + 1;
      });
      setSelectedColleges(newList);
    }
  };

  const moveCollegeDown = (index: number) => {
    if (index < selectedColleges.length - 1) {
      const newList = [...selectedColleges];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      newList.forEach((college, idx) => {
        college.preference = idx + 1;
      });
      setSelectedColleges(newList);
    }
  };

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(prev => {
      const filtered = prev.filter(c => c.id !== collegeId);
      return filtered.map((college, idx) => ({
        ...college,
        preference: idx + 1
      }));
    });
    toast.success('College removed from selection');
  };

  const generatePDF = async () => {
    if (selectedColleges.length === 0) {
      toast.error('Please select at least one college to generate PDF');
      return;
    }

    try {
      const pdf = new jsPDF();
      pdf.setFontSize(20);
      pdf.text('My College Preferences', 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Student: ${user?.firstName} ${user?.lastName}`, 20, 50);
      pdf.text(`Exam: ${selectedExam?.name}`, 20, 60);
      pdf.text(`Score: ${score} ${getScoreLabel()}`, 20, 70);
      pdf.text(`Category: ${category.toUpperCase()}`, 20, 80);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 90);
      
      let yPosition = 110;
      selectedColleges.forEach((college, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.text(`${index + 1}. ${college.name}`, 20, yPosition);
        pdf.setFontSize(10);
        pdf.text(`Location: ${college.location}`, 25, yPosition + 10);
        pdf.text(`Type: ${college.type.toUpperCase()}`, 25, yPosition + 20);
        pdf.text(`Fees: ₹${college.fees.toLocaleString()}`, 25, yPosition + 30);
        pdf.text(`Selected Branches: ${college.selectedBranches.join(', ')}`, 25, yPosition + 40);
        
        yPosition += 60;
      });
      
      pdf.save(`college-preferences-${user?.firstName}-${Date.now()}.pdf`);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const getScoreLabel = () => {
    if (!selectedExam) return '';
    switch (selectedExam.scoreType) {
      case 'marks': return 'Marks';
      case 'percentile': return 'Percentile';
      case 'rank': return 'Rank';
      default: return 'Score';
    }
  };

  const FreeTrialWarning = () => {
    if (user?.paymentStatus === 'completed') return null;
    
    const remainingSearches = 3 - searchCount;
    
    return (
      <div className={`mb-6 p-4 rounded-xl border-2 ${
        remainingSearches === 0 
          ? 'border-red-200 bg-red-50' 
          : remainingSearches === 1 
          ? 'border-orange-200 bg-orange-50'
          : 'border-blue-200 bg-blue-50'
      }`}>
        <div className="flex items-center space-x-3">
          {remainingSearches === 0 ? (
            <Lock className="w-6 h-6 text-red-600" />
          ) : (
            <Zap className="w-6 h-6 text-blue-600" />
          )}
          <div>
            <h3 className={`font-semibold ${
              remainingSearches === 0 ? 'text-red-900' : 'text-gray-900'
            }`}>
              {remainingSearches === 0 
                ? 'Free searches exhausted' 
                : `${remainingSearches} free search${remainingSearches === 1 ? '' : 'es'} remaining`
              }
            </h3>
            <p className={`text-sm ${
              remainingSearches === 0 ? 'text-red-700' : 'text-gray-600'
            }`}>
              {remainingSearches === 0 
                ? 'Upgrade to premium for unlimited college searches and advanced features.'
                : 'Upgrade to premium for unlimited searches and exclusive features.'
              }
            </p>
          </div>
        </div>
        {remainingSearches === 0 && (
          <button
            onClick={() => navigate('/payment')}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade Now</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">College Finder</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Dream College
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best colleges based on your exam scores with our intelligent matching system
          </p>
        </div>

        <FreeTrialWarning />

        {/* Enhanced Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                    step > stepNum ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Disclaimer Modal */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Important Notice</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  These results are based on previous year cutoffs. Do not solely depend on these predictions. 
                  Actual cutoffs may vary based on various factors. Conditions apply.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDisclaimer(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedWithSearch}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    OK, Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Enhanced Exam Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Select Your Exam</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => handleExamSelect(exam)}
                  className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 group-hover:scale-110 transition-transform duration-300 p-4 bg-gray-50 rounded-full group-hover:bg-blue-50">
                      {exam.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{exam.name}</h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{exam.description}</p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>Select Exam</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enhanced Details Input */}
        {step === 2 && selectedExam && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mr-6 p-2 rounded-lg hover:bg-blue-50"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back</span>
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Enter Your Details</h2>
            </div>

            <div className="space-y-8">
              {/* Enhanced Score Input */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <label className="block text-xl font-semibold text-gray-900 mb-4">
                  Your {getScoreLabel()} in {selectedExam.name}
                </label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={`Enter your ${getScoreLabel().toLowerCase()}`}
                  min="0"
                  max={selectedExam.maxScore}
                  step="any"
                  className="w-full max-w-md px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg font-medium shadow-sm"
                />
              </div>

              {/* Enhanced Category Selection */}
              <div>
                <label className="block text-xl font-semibold text-gray-900 mb-6">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {selectedExam.categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        category === cat
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {selectedExam?.id === 'jee_main' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Home State Quota
                    </label>
                    <select
                      value={homeState}
                      onChange={(e) => setHomeState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}


              {/* Enhanced Branch Selection */}
              <div>
                <label className="block text-xl font-semibold text-gray-900 mb-6">
                  Select Branches/Courses
                  <span className="text-sm font-normal text-gray-600 ml-2">(Multiple selection allowed)</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches[selectedExam.id as keyof typeof branches]?.map((branch) => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => handleBranchToggle(branch)}
                      className={`px-6 py-4 rounded-xl font-medium text-left transition-all duration-200 transform hover:scale-105 ${
                        selectedBranches.includes(branch)
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Search Button */}
              <div className="pt-8">
                <button
                  onClick={handleSearch}
                  disabled={!score || selectedBranches.length === 0 || loading || (user?.paymentStatus !== 'completed' && searchCount >= 3)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6" />
                      <span>Find My Colleges</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Enhanced Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mr-6 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Colleges for {selectedExam?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Score: {score} {getScoreLabel()} | Category: {category.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{filteredResults.length}</div>
                  <div className="text-sm text-gray-600">colleges found</div>
                </div>
              </div>

              {/* Filter Options */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'popularity', label: 'Popularity' },
                    { key: 'nirf', label: 'NIRF Ranking' },
                    { key: 'private', label: 'Private' },
                    { key: 'government', label: 'Government' },
                    { key: 'fees_low_high', label: 'Fees: Low to High' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => handleFilterChange(filter.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filterBy === filter.key
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection Panel Toggle */}
              {selectedColleges.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">
                        {selectedColleges.length} college{selectedColleges.length > 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowSelectionPanel(!showSelectionPanel)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {showSelectionPanel ? 'Hide' : 'Show'} Selection
                      </button>
                      <button
                        onClick={generatePDF}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selection Panel */}
              {showSelectionPanel && selectedColleges.length > 0 && (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Your College Preferences</h3>
                  <div className="space-y-3">
                    {selectedColleges.map((college, index) => (
                      <div key={college.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{college.name}</h4>
                            <p className="text-sm text-gray-600">{college.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveCollegeUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveCollegeDown(index)}
                            disabled={index === selectedColleges.length - 1}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeCollege(college.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredResults.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No colleges found</h3>
                  <p className="text-gray-600 text-lg">
                    Try adjusting your criteria or check back later for updated cutoffs.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredResults.map((college, index) => (
                    <div 
                      key={college.id} 
                      className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-white to-gray-50"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-2xl font-bold text-gray-900">{college.name}</h3>
                            <button
                              onClick={() => handleCollegeSelect(college)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                selectedColleges.find(c => c.id === college.id)
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {selectedColleges.find(c => c.id === college.id) ? 'Selected' : 'Select'}
                            </button>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{college.location}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              college.type === 'government' 
                                ? 'bg-green-100 text-green-800' 
                                : college.type === 'private'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {college.type.toUpperCase()}
                            </span>
                            {college.nirf_ranking && (
                              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                NIRF #{college.nirf_ranking}
                              </span>
                            )}
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Popularity: {college.popularityScore}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                            <span className="font-bold text-lg">{college.rating}</span>
                          </div>
                          <div className="text-sm text-gray-600">Est. {college.established}</div>
                        </div>
                      </div>

                      {college.highlights && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {college.highlights.map((highlight, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="flex items-center bg-green-50 p-3 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Annual Fees</div>
                            <div className="font-bold text-green-600">₹{college.fees.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Total Seats</div>
                            <div className="font-bold text-blue-600">{college.seats}</div>
                          </div>
                        </div>
                        <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                          <Award className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Rating</div>
                            <div className="font-bold text-purple-600">{college.rating}/5.0</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">Available Branches & Previous Year Cutoffs:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedBranches.filter(branch => college.branches.includes(branch)).map((branch) => (
                            <div key={branch} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                              <div className="font-semibold text-gray-900 mb-2">{branch}</div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{category.toUpperCase()} Cutoff:</span> 
                                <span className="ml-2 font-bold text-blue-600">
                                  {college.cutoffs[branch]?.[category] || 'N/A'} {getScoreLabel()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}