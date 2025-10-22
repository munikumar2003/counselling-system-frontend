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
  popularity_score: number;
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

  const exams: ExamData[] = [
    {
      id: 'jee_main',
      name: 'JEE Main',
      description: 'Joint Entrance Examination for Engineering',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      scoreType: 'percentile',
      maxScore: 100,
      categories: ['general', 'obc', 'sc', 'st', 'ews']
    },
    {
      id: 'jee_advanced',
      name: 'JEE Advanced',
      description: 'For admission to IITs',
      icon: <Award className="w-8 h-8 text-green-600" />,
      scoreType: 'rank',
      maxScore: 50000,
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
    jee_main: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology'],
    jee_advanced: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Materials Science'],
    neet: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'Veterinary Science', 'B.Sc Nursing', 'Physiotherapy'],
    gate: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Environmental Engineering'],
    cat: ['MBA', 'PGDM', 'Executive MBA', 'MBA in Finance', 'MBA in Marketing', 'MBA in HR', 'MBA in Operations', 'MBA in International Business']
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
        popularity_score: 98
      },
      {
        id: '2',
        name: 'National Institute of Technology, Trichy',
        location: 'Tiruchirappalli, Tamil Nadu',
        type: 'government',
        rating: 4.6,
        fees: 250000,
        branches: ['Computer Science Engineering', 'Mechanical Engineering', 'Civil Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 98.8, obc: 98.5, sc: 97.8, st: 97.3, ews: 98.6 },
          'Civil Engineering': { general: 97.2, obc: 96.9, sc: 96.2, st: 95.7, ews: 97.0 }
        },
        nirf_ranking: 15,
        established: 1964,
        seats: 800,
        highlights: ['Premier NIT', 'Industry Connections', 'Strong Alumni'],
        popularity_score: 92
      },
      {
        id: '3',
        name: 'Manipal Institute of Technology',
        location: 'Manipal, Karnataka',
        type: 'private',
        rating: 4.4,
        fees: 1500000,
        branches: ['Computer Science Engineering', 'Electronics Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 95.5, obc: 95.2, sc: 94.5, st: 94.0, ews: 95.3 },
          'Electronics Engineering': { general: 94.0, obc: 93.7, sc: 93.0, st: 92.5, ews: 93.8 }
        },
        established: 1957,
        seats: 1500,
        highlights: ['Modern Infrastructure', 'International Exposure', 'Industry Partnerships'],
        popularity_score: 85
      },
      {
        id: '4',
        name: 'Delhi Technological University',
        location: 'New Delhi',
        type: 'government',
        rating: 4.5,
        fees: 180000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 98.5, obc: 98.2, sc: 97.5, st: 97.0, ews: 98.3 },
          'Electronics Engineering': { general: 97.8, obc: 97.5, sc: 96.8, st: 96.3, ews: 97.6 }
        },
        nirf_ranking: 36,
        established: 1941,
        seats: 1000,
        highlights: ['Delhi Location', 'Good Placements', 'Research Focus'],
        popularity_score: 88
      },
      {
        id: '5',
        name: 'Birla Institute of Technology and Science, Pilani',
        location: 'Pilani, Rajasthan',
        type: 'private',
        rating: 4.7,
        fees: 1800000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 96.8, obc: 96.5, sc: 95.8, st: 95.3, ews: 96.6 },
          'Electronics Engineering': { general: 95.5, obc: 95.2, sc: 94.5, st: 94.0, ews: 95.3 }
        },
        nirf_ranking: 25,
        established: 1964,
        seats: 2000,
        highlights: ['Prestigious Private Institute', 'Innovation Hub', 'Global Recognition'],
        popularity_score: 90
      },
      {
        id: '6',
        name: 'Vellore Institute of Technology',
        location: 'Vellore, Tamil Nadu',
        type: 'private',
        rating: 4.3,
        fees: 1200000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 92.5, obc: 92.2, sc: 91.5, st: 91.0, ews: 92.3 },
          'Electronics Engineering': { general: 90.8, obc: 90.5, sc: 89.8, st: 89.3, ews: 90.6 }
        },
        nirf_ranking: 45,
        established: 1984,
        seats: 3000,
        highlights: ['Large Campus', 'Diverse Programs', 'Industry Connect'],
        popularity_score: 82
      },
      {
        id: '7',
        name: 'Jadavpur University',
        location: 'Kolkata, West Bengal',
        type: 'government',
        rating: 4.6,
        fees: 150000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 97.8, obc: 97.5, sc: 96.8, st: 96.3, ews: 97.6 },
          'Electronics Engineering': { general: 96.5, obc: 96.2, sc: 95.5, st: 95.0, ews: 96.3 }
        },
        nirf_ranking: 42,
        established: 1955,
        seats: 800,
        highlights: ['Heritage Institution', 'Strong Engineering', 'Cultural Hub'],
        popularity_score: 86
      },
      {
        id: '8',
        name: 'Indian Institute of Technology, Roorkee',
        location: 'Roorkee, Uttarakhand',
        type: 'government',
        rating: 4.7,
        fees: 210000,
        branches: ['Computer Science Engineering', 'Civil Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 99.3, obc: 99.0, sc: 98.3, st: 97.8, ews: 99.1 },
          'Civil Engineering': { general: 98.5, obc: 98.2, sc: 97.5, st: 97.0, ews: 98.3 }
        },
        nirf_ranking: 8,
        established: 1847,
        seats: 1100,
        highlights: ['Oldest Technical Institute', 'Civil Engineering Pioneer', 'Research Excellence'],
        popularity_score: 95
      },
      {
        id: '9',
        name: 'National Institute of Technology, Warangal',
        location: 'Warangal, Telangana',
        type: 'government',
        rating: 4.5,
        fees: 240000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 98.2, obc: 97.9, sc: 97.2, st: 96.7, ews: 98.0 },
          'Electronics Engineering': { general: 97.0, obc: 96.7, sc: 96.0, st: 95.5, ews: 96.8 }
        },
        nirf_ranking: 19,
        established: 1959,
        seats: 900,
        highlights: ['Top NIT', 'Strong Alumni Network', 'Research Focus'],
        popularity_score: 89
      },
      {
        id: '10',
        name: 'Indian Institute of Technology, Guwahati',
        location: 'Guwahati, Assam',
        type: 'government',
        rating: 4.6,
        fees: 220000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 98.8, obc: 98.5, sc: 97.8, st: 97.3, ews: 98.6 },
          'Electronics Engineering': { general: 97.5, obc: 97.2, sc: 96.5, st: 96.0, ews: 97.3 }
        },
        nirf_ranking: 12,
        established: 1994,
        seats: 1000,
        highlights: ['Scenic Campus', 'Research Excellence', 'Northeast Hub'],
        popularity_score: 91
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
        popularity_score: 99
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
        popularity_score: 96
      },
      {
        id: '33',
        name: 'King George Medical University',
        location: 'Lucknow, Uttar Pradesh',
        type: 'government',
        rating: 4.6,
        fees: 80000,
        branches: ['MBBS', 'BDS', 'BAMS'],
        cutoffs: {
          'MBBS': { general: 680, obc: 661, sc: 572, st: 563, ews: 675 },
          'BDS': { general: 640, obc: 621, sc: 532, st: 523, ews: 635 },
          'BAMS': { general: 520, obc: 501, sc: 412, st: 403, ews: 515 }
        },
        established: 1905,
        seats: 250,
        highlights: ['Government Medical College', 'Good Infrastructure', 'Affordable Fees'],
        popularity_score: 88
      },
      {
        id: '34',
        name: 'Maulana Azad Medical College',
        location: 'New Delhi',
        type: 'government',
        rating: 4.7,
        fees: 60000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 695, obc: 676, sc: 587, st: 578, ews: 690 },
          'BDS': { general: 655, obc: 636, sc: 547, st: 538, ews: 650 }
        },
        nirf_ranking: 8,
        established: 1958,
        seats: 250,
        highlights: ['Delhi Location', 'Government College', 'Good Clinical Exposure'],
        popularity_score: 92
      },
      {
        id: '35',
        name: 'Armed Forces Medical College',
        location: 'Pune, Maharashtra',
        type: 'government',
        rating: 4.8,
        fees: 40000,
        branches: ['MBBS'],
        cutoffs: {
          'MBBS': { general: 710, obc: 691, sc: 602, st: 593, ews: 705 }
        },
        nirf_ranking: 5,
        established: 1948,
        seats: 130,
        highlights: ['Military Medical College', 'Excellent Discipline', 'Top Faculty'],
        popularity_score: 94
      },
      {
        id: '36',
        name: 'Grant Medical College',
        location: 'Mumbai, Maharashtra',
        type: 'government',
        rating: 4.5,
        fees: 70000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 670, obc: 651, sc: 562, st: 553, ews: 665 },
          'BDS': { general: 630, obc: 611, sc: 522, st: 513, ews: 625 }
        },
        established: 1845,
        seats: 200,
        highlights: ['Heritage Medical College', 'Mumbai Location', 'Good Clinical Training'],
        popularity_score: 85
      },
      {
        id: '37',
        name: 'Kasturba Medical College, Manipal',
        location: 'Manipal, Karnataka',
        type: 'private',
        rating: 4.6,
        fees: 1800000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 650, obc: 631, sc: 542, st: 533, ews: 645 },
          'BDS': { general: 610, obc: 591, sc: 502, st: 493, ews: 605 }
        },
        nirf_ranking: 12,
        established: 1953,
        seats: 150,
        highlights: ['Private Medical College', 'Good Infrastructure', 'International Recognition'],
        popularity_score: 83
      },
      {
        id: '38',
        name: 'St. Johns Medical College',
        location: 'Bangalore, Karnataka',
        type: 'private',
        rating: 4.7,
        fees: 1900000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 665, obc: 646, sc: 557, st: 548, ews: 660 },
          'BDS': { general: 625, obc: 606, sc: 517, st: 508, ews: 620 }
        },
        nirf_ranking: 15,
        established: 1963,
        seats: 150,
        highlights: ['Christian Medical College', 'Bangalore Location', 'Quality Education'],
        popularity_score: 87
      },
      {
        id: '39',
        name: 'Jawaharlal Institute of Postgraduate Medical Education',
        location: 'Puducherry',
        type: 'government',
        rating: 4.6,
        fees: 45000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 675, obc: 656, sc: 567, st: 558, ews: 670 },
          'BDS': { general: 635, obc: 616, sc: 527, st: 518, ews: 630 }
        },
        nirf_ranking: 18,
        established: 1964,
        seats: 200,
        highlights: ['Central Government Institute', 'Research Focus', 'Good Faculty'],
        popularity_score: 89
      },
      {
        id: '40',
        name: 'Madras Medical College',
        location: 'Chennai, Tamil Nadu',
        type: 'government',
        rating: 4.5,
        fees: 55000,
        branches: ['MBBS', 'BDS'],
        cutoffs: {
          'MBBS': { general: 660, obc: 641, sc: 552, st: 543, ews: 655 },
          'BDS': { general: 620, obc: 601, sc: 512, st: 503, ews: 615 }
        },
        established: 1835,
        seats: 250,
        highlights: ['Oldest Medical College', 'Chennai Location', 'Heritage Institution'],
        popularity_score: 84
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
        popularity_score: 99
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
        popularity_score: 97
      },
      {
        id: '93',
        name: 'XLRI - Xavier School of Management',
        location: 'Jamshedpur, Jharkhand',
        type: 'private',
        rating: 4.7,
        fees: 2200000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 98.5, obc: 98.2, sc: 97.5, st: 97.0, ews: 98.3 },
          'PGDM': { general: 98.0, obc: 97.7, sc: 97.0, st: 96.5, ews: 97.8 }
        },
        nirf_ranking: 8,
        established: 1949,
        seats: 350,
        highlights: ['Jesuit Institution', 'HR Excellence', 'Strong Alumni'],
        popularity_score: 93
      },
      {
        id: '94',
        name: 'Indian Institute of Management, Calcutta',
        location: 'Kolkata, West Bengal',
        type: 'government',
        rating: 4.8,
        fees: 2300000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 99.2, obc: 98.9, sc: 98.2, st: 97.7, ews: 99.0 },
          'PGDM': { general: 98.7, obc: 98.4, sc: 97.7, st: 97.2, ews: 98.5 }
        },
        nirf_ranking: 3,
        established: 1961,
        seats: 460,
        highlights: ['Heritage IIM', 'Kolkata Location', 'Academic Excellence'],
        popularity_score: 95
      },
      {
        id: '95',
        name: 'Indian School of Business',
        location: 'Hyderabad, Telangana',
        type: 'private',
        rating: 4.7,
        fees: 3500000,
        branches: ['MBA', 'Executive MBA'],
        cutoffs: {
          'MBA': { general: 98.8, obc: 98.5, sc: 97.8, st: 97.3, ews: 98.6 },
          'Executive MBA': { general: 97.5, obc: 97.2, sc: 96.5, st: 96.0, ews: 97.3 }
        },
        nirf_ranking: 5,
        established: 2001,
        seats: 900,
        highlights: ['International Faculty', 'Global Rankings', 'Industry Partnerships'],
        popularity_score: 91
      },
      {
        id: '96',
        name: 'Faculty of Management Studies, Delhi',
        location: 'New Delhi',
        type: 'government',
        rating: 4.6,
        fees: 200000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 97.8, obc: 97.5, sc: 96.8, st: 96.3, ews: 97.6 },
          'PGDM': { general: 97.3, obc: 97.0, sc: 96.3, st: 95.8, ews: 97.1 }
        },
        nirf_ranking: 12,
        established: 1954,
        seats: 220,
        highlights: ['Delhi University', 'Affordable Fees', 'Good Placements'],
        popularity_score: 88
      },
      {
        id: '97',
        name: 'SP Jain Institute of Management and Research',
        location: 'Mumbai, Maharashtra',
        type: 'private',
        rating: 4.5,
        fees: 1800000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 96.5, obc: 96.2, sc: 95.5, st: 95.0, ews: 96.3 },
          'PGDM': { general: 96.0, obc: 95.7, sc: 95.0, st: 94.5, ews: 95.8 }
        },
        nirf_ranking: 18,
        established: 1981,
        seats: 300,
        highlights: ['Mumbai Location', 'Industry Connect', 'Finance Specialization'],
        popularity_score: 85
      },
      {
        id: '98',
        name: 'Indian Institute of Management, Lucknow',
        location: 'Lucknow, Uttar Pradesh',
        type: 'government',
        rating: 4.6,
        fees: 2000000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 97.5, obc: 97.2, sc: 96.5, st: 96.0, ews: 97.3 },
          'PGDM': { general: 97.0, obc: 96.7, sc: 96.0, st: 95.5, ews: 96.8 }
        },
        nirf_ranking: 6,
        established: 1984,
        seats: 440,
        highlights: ['Newer IIM', 'Growing Reputation', 'Good Infrastructure'],
        popularity_score: 89
      },
      {
        id: '99',
        name: 'Management Development Institute',
        location: 'Gurgaon, Haryana',
        type: 'government',
        rating: 4.5,
        fees: 2100000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 96.8, obc: 96.5, sc: 95.8, st: 95.3, ews: 96.6 },
          'PGDM': { general: 96.3, obc: 96.0, sc: 95.3, st: 94.8, ews: 96.1 }
        },
        nirf_ranking: 15,
        established: 1973,
        seats: 480,
        highlights: ['NCR Location', 'HR Focus', 'Industry Partnerships'],
        popularity_score: 86
      },
      {
        id: '100',
        name: 'Indian Institute of Management, Kozhikode',
        location: 'Kozhikode, Kerala',
        type: 'government',
        rating: 4.6,
        fees: 2050000,
        branches: ['MBA', 'PGDM'],
        cutoffs: {
          'MBA': { general: 97.2, obc: 96.9, sc: 96.2, st: 95.7, ews: 97.0 },
          'PGDM': { general: 96.7, obc: 96.4, sc: 95.7, st: 95.2, ews: 96.5 }
        },
        nirf_ranking: 7,
        established: 1996,
        seats: 440,
        highlights: ['Kerala Location', 'Coastal Campus', 'Academic Excellence'],
        popularity_score: 87
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
        popularity_score: 99
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
        popularity_score: 96
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
        popularity_score: 97
      },
      {
        id: '124',
        name: 'Indian Institute of Technology, Delhi',
        location: 'New Delhi',
        type: 'government',
        rating: 4.8,
        fees: 185000,
        branches: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering'],
        cutoffs: {
          'Computer Science': { general: 825, obc: 795, sc: 725, st: 695, ews: 815 },
          'Mechanical Engineering': { general: 785, obc: 755, sc: 685, st: 655, ews: 775 }
        },
        nirf_ranking: 2,
        established: 1961,
        seats: 420,
        highlights: ['Delhi Location', 'Top IIT', 'Research Focus'],
        popularity_score: 98
      },
      {
        id: '125',
        name: 'Indian Institute of Technology, Madras',
        location: 'Chennai, Tamil Nadu',
        type: 'government',
        rating: 4.7,
        fees: 175000,
        branches: ['Computer Science', 'Electrical Engineering', 'Aerospace Engineering'],
        cutoffs: {
          'Computer Science': { general: 815, obc: 785, sc: 715, st: 685, ews: 805 },
          'Electrical Engineering': { general: 775, obc: 745, sc: 675, st: 645, ews: 765 }
        },
        nirf_ranking: 5,
        established: 1959,
        seats: 380,
        highlights: ['Chennai Location', 'Strong Engineering', 'Research Excellence'],
        popularity_score: 94
      },
      {
        id: '126',
        name: 'Indian Institute of Technology, Kharagpur',
        location: 'Kharagpur, West Bengal',
        type: 'government',
        rating: 4.7,
        fees: 170000,
        branches: ['Computer Science', 'Mechanical Engineering', 'Electronics Engineering'],
        cutoffs: {
          'Computer Science': { general: 810, obc: 780, sc: 710, st: 680, ews: 800 },
          'Mechanical Engineering': { general: 770, obc: 740, sc: 670, st: 640, ews: 760 }
        },
        nirf_ranking: 6,
        established: 1951,
        seats: 500,
        highlights: ['First IIT', 'Large Campus', 'Heritage Institution'],
        popularity_score: 92
      },
      {
        id: '127',
        name: 'Indian Institute of Technology, Roorkee',
        location: 'Roorkee, Uttarakhand',
        type: 'government',
        rating: 4.7,
        fees: 175000,
        branches: ['Computer Science', 'Civil Engineering', 'Electrical Engineering'],
        cutoffs: {
          'Computer Science': { general: 805, obc: 775, sc: 705, st: 675, ews: 795 },
          'Civil Engineering': { general: 750, obc: 720, sc: 650, st: 620, ews: 740 }
        },
        nirf_ranking: 8,
        established: 1847,
        seats: 350,
        highlights: ['Oldest Technical Institute', 'Civil Engineering Pioneer', 'Heritage'],
        popularity_score: 90
      },
      {
        id: '128',
        name: 'National Institute of Technology, Trichy',
        location: 'Tiruchirappalli, Tamil Nadu',
        type: 'government',
        rating: 4.6,
        fees: 160000,
        branches: ['Computer Science', 'Mechanical Engineering', 'Electronics Engineering'],
        cutoffs: {
          'Computer Science': { general: 780, obc: 750, sc: 680, st: 650, ews: 770 },
          'Mechanical Engineering': { general: 740, obc: 710, sc: 640, st: 610, ews: 730 }
        },
        nirf_ranking: 15,
        established: 1964,
        seats: 300,
        highlights: ['Premier NIT', 'Tamil Nadu Location', 'Strong Alumni'],
        popularity_score: 88
      },
      {
        id: '129',
        name: 'Indian Institute of Technology, Guwahati',
        location: 'Guwahati, Assam',
        type: 'government',
        rating: 4.6,
        fees: 165000,
        branches: ['Computer Science', 'Electronics Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science': { general: 795, obc: 765, sc: 695, st: 665, ews: 785 },
          'Electronics Engineering': { general: 755, obc: 725, sc: 655, st: 625, ews: 745 }
        },
        nirf_ranking: 12,
        established: 1994,
        seats: 320,
        highlights: ['Scenic Campus', 'Northeast Hub', 'Growing Reputation'],
        popularity_score: 86
      },
      {
        id: '130',
        name: 'Indian Institute of Technology, Hyderabad',
        location: 'Hyderabad, Telangana',
        type: 'government',
        rating: 4.6,
        fees: 170000,
        branches: ['Computer Science', 'Electrical Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science': { general: 790, obc: 760, sc: 690, st: 660, ews: 780 },
          'Electrical Engineering': { general: 750, obc: 720, sc: 650, st: 620, ews: 740 }
        },
        nirf_ranking: 14,
        established: 2008,
        seats: 280,
        highlights: ['New IIT', 'Hyderabad Location', 'Modern Infrastructure'],
        popularity_score: 84
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
        popularity_score: 99
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
        popularity_score: 98
      },
      {
        id: '153',
        name: 'Indian Institute of Technology, Kanpur',
        location: 'Kanpur, Uttar Pradesh',
        type: 'government',
        rating: 4.8,
        fees: 210000,
        branches: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 89, obc: 112, sc: 215, st: 285, ews: 98 },
          'Mechanical Engineering': { general: 195, obc: 248, sc: 385, st: 512, ews: 215 }
        },
        nirf_ranking: 4,
        established: 1959,
        seats: 780,
        highlights: ['Historic IIT', 'Strong Alumni', 'Academic Excellence'],
        popularity_score: 96
      },
      {
        id: '154',
        name: 'Indian Institute of Technology, Madras',
        location: 'Chennai, Tamil Nadu',
        type: 'government',
        rating: 4.8,
        fees: 205000,
        branches: ['Computer Science Engineering', 'Electrical Engineering', 'Aerospace Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 92, obc: 118, sc: 225, st: 295, ews: 102 },
          'Electrical Engineering': { general: 185, obc: 235, sc: 365, st: 485, ews: 205 }
        },
        nirf_ranking: 5,
        established: 1959,
        seats: 720,
        highlights: ['Chennai Location', 'Strong Engineering', 'Research Focus'],
        popularity_score: 95
      },
      {
        id: '155',
        name: 'Indian Institute of Technology, Kharagpur',
        location: 'Kharagpur, West Bengal',
        type: 'government',
        rating: 4.7,
        fees: 200000,
        branches: ['Computer Science Engineering', 'Mechanical Engineering', 'Electronics Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 105, obc: 135, sc: 255, st: 325, ews: 118 },
          'Mechanical Engineering': { general: 225, obc: 285, sc: 425, st: 565, ews: 248 }
        },
        nirf_ranking: 6,
        established: 1951,
        seats: 900,
        highlights: ['First IIT', 'Large Campus', 'Heritage Institution'],
        popularity_score: 93
      },
      {
        id: '156',
        name: 'Indian Institute of Technology, Roorkee',
        location: 'Roorkee, Uttarakhand',
        type: 'government',
        rating: 4.7,
        fees: 208000,
        branches: ['Computer Science Engineering', 'Civil Engineering', 'Electrical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 98, obc: 125, sc: 235, st: 305, ews: 108 },
          'Civil Engineering': { general: 285, obc: 365, sc: 545, st: 725, ews: 315 }
        },
        nirf_ranking: 8,
        established: 1847,
        seats: 650,
        highlights: ['Oldest Technical Institute', 'Civil Engineering Pioneer', 'Heritage'],
        popularity_score: 91
      },
      {
        id: '157',
        name: 'Indian Institute of Technology, Guwahati',
        location: 'Guwahati, Assam',
        type: 'government',
        rating: 4.6,
        fees: 195000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 125, obc: 158, sc: 295, st: 385, ews: 138 },
          'Electronics Engineering': { general: 265, obc: 335, sc: 495, st: 655, ews: 285 }
        },
        nirf_ranking: 12,
        established: 1994,
        seats: 580,
        highlights: ['Scenic Campus', 'Northeast Hub', 'Growing Reputation'],
        popularity_score: 88
      },
      {
        id: '158',
        name: 'Indian Institute of Technology, Hyderabad',
        location: 'Hyderabad, Telangana',
        type: 'government',
        rating: 4.6,
        fees: 198000,
        branches: ['Computer Science Engineering', 'Electrical Engineering', 'Chemical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 135, obc: 172, sc: 315, st: 405, ews: 148 },
          'Electrical Engineering': { general: 285, obc: 365, sc: 535, st: 705, ews: 315 }
        },
        nirf_ranking: 14,
        established: 2008,
        seats: 520,
        highlights: ['New IIT', 'Hyderabad Location', 'Modern Infrastructure'],
        popularity_score: 86
      },
      {
        id: '159',
        name: 'Indian Institute of Technology, Indore',
        location: 'Indore, Madhya Pradesh',
        type: 'government',
        rating: 4.5,
        fees: 192000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 148, obc: 188, sc: 345, st: 445, ews: 165 },
          'Electronics Engineering': { general: 315, obc: 395, sc: 575, st: 755, ews: 345 }
        },
        nirf_ranking: 16,
        established: 2009,
        seats: 480,
        highlights: ['New IIT', 'Central India', 'Growing Reputation'],
        popularity_score: 84
      },
      {
        id: '160',
        name: 'Indian Institute of Technology, Bhubaneswar',
        location: 'Bhubaneswar, Odisha',
        type: 'government',
        rating: 4.5,
        fees: 190000,
        branches: ['Computer Science Engineering', 'Electronics Engineering', 'Mechanical Engineering'],
        cutoffs: {
          'Computer Science Engineering': { general: 155, obc: 195, sc: 355, st: 455, ews: 172 },
          'Electronics Engineering': { general: 325, obc: 405, sc: 585, st: 765, ews: 355 }
        },
        nirf_ranking: 18,
        established: 2008,
        seats: 460,
        highlights: ['New IIT', 'Odisha Location', 'Modern Facilities'],
        popularity_score: 82
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter colleges based on criteria
      const filteredColleges = mockColleges[selectedExam!.id]?.filter(college => {
        return selectedBranches.some(branch => {
          const cutoff = college.cutoffs[branch]?.[category];
          if (!cutoff) return false;
          
          const userScore = parseFloat(score);
          if (selectedExam!.scoreType === 'rank') {
            return userScore <= cutoff;
          } else {
            return userScore >= cutoff;
          }
        });
      }) || [];

      // Sort by popularity by default
      const sortedColleges = [...filteredColleges].sort((a, b) => b.popularity_score - a.popularity_score);
      
      setResults(sortedColleges);
      setFilteredResults(sortedColleges);
      setStep(3);
      
      // Increment search count only if not premium user
      if (user?.paymentStatus !== 'completed') {
        incrementSearchCount();
      }
      
      toast.success(`Found ${sortedColleges.length} matching colleges!`);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string) => {
    setFilterBy(filterType);
    let sortedResults = [...results];

    switch (filterType) {
      case 'popularity':
        sortedResults.sort((a, b) => b.popularity_score - a.popularity_score);
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
      // Update preferences
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
      // Update preferences
      newList.forEach((college, idx) => {
        college.preference = idx + 1;
      });
      setSelectedColleges(newList);
    }
  };

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(prev => {
      const filtered = prev.filter(c => c.id !== collegeId);
      // Update preferences
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
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('My College Preferences', 20, 30);
      
      // Add user info
      pdf.setFontSize(12);
      pdf.text(`Student: ${user?.firstName} ${user?.lastName}`, 20, 50);
      pdf.text(`Exam: ${selectedExam?.name}`, 20, 60);
      pdf.text(`Score: ${score} ${getScoreLabel()}`, 20, 70);
      pdf.text(`Category: ${category.toUpperCase()}`, 20, 80);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 90);
      
      // Add colleges
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

  // Free trial warning component
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
                              Popularity: {college.popularity_score}
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