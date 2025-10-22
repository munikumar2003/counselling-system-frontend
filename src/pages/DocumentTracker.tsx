import React, { useState } from 'react';
import { ArrowLeft, FileText, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Upload, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  deadline?: string;
  format: string;
  size_limit: string;
  sample_link?: string;
}

export default function DocumentTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const categories = [
    'All Documents', 'Academic', 'Identity', 'Category Certificate', 
    'Income Certificate', 'Medical', 'Other'
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: '10th Mark Sheet',
      description: 'Class 10 board examination mark sheet',
      required: true,
      category: 'Academic',
      status: 'verified',
      deadline: '2024-07-15',
      format: 'PDF, JPG',
      size_limit: '2MB',
      sample_link: '/samples/10th-marksheet.pdf'
    },
    {
      id: '2',
      name: '12th Mark Sheet',
      description: 'Class 12 board examination mark sheet',
      required: true,
      category: 'Academic',
      status: 'verified',
      deadline: '2024-07-15',
      format: 'PDF, JPG',
      size_limit: '2MB'
    },
    {
      id: '3',
      name: 'JEE Main Admit Card',
      description: 'JEE Main 2024 admit card',
      required: true,
      category: 'Academic',
      status: 'uploaded',
      deadline: '2024-07-15',
      format: 'PDF',
      size_limit: '1MB'
    },
    {
      id: '4',
      name: 'JEE Main Score Card',
      description: 'JEE Main 2024 result/score card',
      required: true,
      category: 'Academic',
      status: 'pending',
      deadline: '2024-07-20',
      format: 'PDF',
      size_limit: '1MB'
    },
    {
      id: '5',
      name: 'Aadhaar Card',
      description: 'Aadhaar card for identity verification',
      required: true,
      category: 'Identity',
      status: 'verified',
      deadline: '2024-07-15',
      format: 'PDF, JPG',
      size_limit: '1MB'
    },
    {
      id: '6',
      name: 'OBC Certificate',
      description: 'Non-creamy layer OBC certificate (if applicable)',
      required: false,
      category: 'Category Certificate',
      status: 'pending',
      deadline: '2024-07-25',
      format: 'PDF',
      size_limit: '2MB',
      sample_link: '/samples/obc-certificate.pdf'
    },
    {
      id: '7',
      name: 'EWS Certificate',
      description: 'Economically Weaker Section certificate (if applicable)',
      required: false,
      category: 'Category Certificate',
      status: 'pending',
      deadline: '2024-07-25',
      format: 'PDF',
      size_limit: '2MB'
    },
    {
      id: '8',
      name: 'Income Certificate',
      description: 'Family income certificate',
      required: false,
      category: 'Income Certificate',
      status: 'pending',
      deadline: '2024-07-30',
      format: 'PDF',
      size_limit: '2MB'
    },
    {
      id: '9',
      name: 'Transfer Certificate',
      description: 'School transfer certificate',
      required: true,
      category: 'Academic',
      status: 'pending',
      deadline: '2024-08-01',
      format: 'PDF, JPG',
      size_limit: '2MB'
    },
    {
      id: '10',
      name: 'Character Certificate',
      description: 'Character certificate from school',
      required: true,
      category: 'Academic',
      status: 'pending',
      deadline: '2024-08-01',
      format: 'PDF, JPG',
      size_limit: '2MB'
    }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'uploaded': return <Upload className="w-5 h-5 text-blue-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'uploaded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFileUpload = (docId: string, file: File) => {
    setUploadingDoc(docId);
    
    // Simulate upload process
    setTimeout(() => {
      toast.success('Document uploaded successfully!');
      setUploadingDoc(null);
    }, 2000);
  };

  const getProgress = () => {
    const total = documents.filter(doc => doc.required).length;
    const completed = documents.filter(doc => doc.required && (doc.status === 'verified' || doc.status === 'uploaded')).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const progress = getProgress();

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Document Checklist & Tracker</h1>
                <p className="text-green-100 mt-2">
                  Track your counselling documents and ensure timely submission
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                <span className="text-2xl font-bold text-blue-600">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {progress.completed} of {progress.total} required documents completed
              </p>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Documents' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {filteredDocuments.map((doc) => {
                const daysLeft = doc.deadline ? getDaysUntilDeadline(doc.deadline) : null;
                return (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                            {doc.required && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{doc.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Format: {doc.format}</span>
                            <span>Max Size: {doc.size_limit}</span>
                            {doc.deadline && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(doc.deadline).toLocaleDateString()}</span>
                                {daysLeft !== null && (
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                    daysLeft < 0 ? 'bg-red-100 text-red-800' :
                                    daysLeft <= 7 ? 'bg-orange-100 text-orange-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {daysLeft < 0 ? 'Overdue' : 
                                     daysLeft === 0 ? 'Due Today' :
                                     `${daysLeft} days left`}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {doc.sample_link && (
                          <a
                            href={doc.sample_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Sample Format</span>
                          </a>
                        )}
                      </div>
                      
                      {doc.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            id={`file-${doc.id}`}
                            className="hidden"
                            accept={doc.format.toLowerCase().includes('pdf') ? '.pdf' : '.pdf,.jpg,.jpeg,.png'}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(doc.id, file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-${doc.id}`}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-2 ${
                              uploadingDoc === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploadingDoc === doc.id ? 'Uploading...' : 'Upload'}</span>
                          </label>
                        </div>
                      )}
                      
                      {doc.status === 'uploaded' && (
                        <span className="text-sm text-blue-600">Under Review</span>
                      )}
                      
                      {doc.status === 'verified' && (
                        <span className="text-sm text-green-600">✓ Verified</span>
                      )}
                      
                      {doc.status === 'rejected' && (
                        <button className="text-sm text-red-600 hover:text-red-700">
                          Re-upload
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
                <p className="text-gray-600">
                  No documents found for the selected category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}