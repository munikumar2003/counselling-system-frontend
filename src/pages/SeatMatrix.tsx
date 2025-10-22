import React, { useState } from 'react';
import { ArrowLeft, Users, ListFilter as Filter, Download, TrendingUp, Building, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SeatData {
  college: string;
  branch: string;
  total_seats: number;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  location: string;
  type: 'Government' | 'Private' | 'Deemed';
  fees: number;
}

export default function SeatMatrix() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState('jee_main');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const exams = [
    { id: 'jee_main', name: 'JEE Main' },
    { id: 'neet', name: 'NEET' },
    { id: 'gate', name: 'GATE' },
    { id: 'cat', name: 'CAT' }
  ];

  const states = [
    'All States', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 
    'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Rajasthan', 'Haryana'
  ];

  const mockSeatData: SeatData[] = [
    {
      college: 'IIT Delhi',
      branch: 'Computer Science Engineering',
      total_seats: 120,
      general: 60,
      obc: 32,
      sc: 18,
      st: 6,
      ews: 12,
      location: 'New Delhi',
      type: 'Government',
      fees: 200000
    },
    {
      college: 'IIT Delhi',
      branch: 'Electrical Engineering',
      total_seats: 100,
      general: 50,
      obc: 27,
      sc: 15,
      st: 5,
      ews: 10,
      location: 'New Delhi',
      type: 'Government',
      fees: 200000
    },
    {
      college: 'NIT Trichy',
      branch: 'Computer Science Engineering',
      total_seats: 150,
      general: 75,
      obc: 40,
      sc: 22,
      st: 8,
      ews: 15,
      location: 'Tiruchirappalli, Tamil Nadu',
      type: 'Government',
      fees: 150000
    },
    {
      college: 'BITS Pilani',
      branch: 'Computer Science Engineering',
      total_seats: 200,
      general: 200,
      obc: 0,
      sc: 0,
      st: 0,
      ews: 0,
      location: 'Pilani, Rajasthan',
      type: 'Private',
      fees: 450000
    },
    {
      college: 'VIT Vellore',
      branch: 'Computer Science Engineering',
      total_seats: 300,
      general: 300,
      obc: 0,
      sc: 0,
      st: 0,
      ews: 0,
      location: 'Vellore, Tamil Nadu',
      type: 'Private',
      fees: 400000
    },
    {
      college: 'DTU Delhi',
      branch: 'Information Technology',
      total_seats: 80,
      general: 40,
      obc: 22,
      sc: 12,
      st: 4,
      ews: 8,
      location: 'New Delhi',
      type: 'Government',
      fees: 180000
    },
    {
      college: 'Manipal Institute of Technology',
      branch: 'Computer Science Engineering',
      total_seats: 250,
      general: 250,
      obc: 0,
      sc: 0,
      st: 0,
      ews: 0,
      location: 'Manipal, Karnataka',
      type: 'Private',
      fees: 380000
    },
    {
      college: 'AIIMS Delhi',
      branch: 'MBBS',
      total_seats: 125,
      general: 63,
      obc: 34,
      sc: 19,
      st: 6,
      ews: 13,
      location: 'New Delhi',
      type: 'Government',
      fees: 50000
    },
    {
      college: 'CMC Vellore',
      branch: 'MBBS',
      total_seats: 100,
      general: 50,
      obc: 27,
      sc: 15,
      st: 5,
      ews: 10,
      location: 'Vellore, Tamil Nadu',
      type: 'Private',
      fees: 2500000
    },
    {
      college: 'IIM Ahmedabad',
      branch: 'MBA',
      total_seats: 395,
      general: 198,
      obc: 107,
      sc: 59,
      st: 20,
      ews: 40,
      location: 'Ahmedabad, Gujarat',
      type: 'Government',
      fees: 2500000
    }
  ];

  const filteredData = mockSeatData.filter(item => {
    const matchesSearch = item.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || item.location.includes(selectedState);
    const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType;
    return matchesSearch && matchesState && matchesType;
  });

  const totalSeats = filteredData.reduce((sum, item) => sum + item.total_seats, 0);
  const totalGeneral = filteredData.reduce((sum, item) => sum + item.general, 0);
  const totalOBC = filteredData.reduce((sum, item) => sum + item.obc, 0);
  const totalSC = filteredData.reduce((sum, item) => sum + item.sc, 0);
  const totalST = filteredData.reduce((sum, item) => sum + item.st, 0);
  const totalEWS = filteredData.reduce((sum, item) => sum + item.ews, 0);

  const downloadCSV = () => {
    const headers = ['College', 'Branch', 'Total Seats', 'General', 'OBC', 'SC', 'ST', 'EWS', 'Location', 'Type', 'Fees'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.college,
        row.branch,
        row.total_seats,
        row.general,
        row.obc,
        row.sc,
        row.st,
        row.ews,
        row.location,
        row.type,
        row.fees
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seat_matrix.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Seat Matrix Analyzer</h1>
                <p className="text-blue-100 mt-2">
                  Comprehensive seat availability data for all major colleges and branches
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam
                  </label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All States</option>
                    {states.slice(1).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                    <option value="deemed">Deemed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="College or branch..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{totalSeats}</div>
                <div className="text-sm text-blue-800">Total Seats</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{totalGeneral}</div>
                <div className="text-sm text-green-800">General</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{totalOBC}</div>
                <div className="text-sm text-orange-800">OBC</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{totalSC}</div>
                <div className="text-sm text-purple-800">SC</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{totalST}</div>
                <div className="text-sm text-red-800">ST</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{totalEWS}</div>
                <div className="text-sm text-indigo-800">EWS</div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadCSV}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Seat Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">College</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Branch</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Total</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">General</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">OBC</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">SC</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">ST</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">EWS</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Location</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">{item.college}</td>
                      <td className="border border-gray-300 px-4 py-3">{item.branch}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">
                        {item.total_seats}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.general}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.obc}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.sc}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.st}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.ews}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.location}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'Government' ? 'bg-green-100 text-green-800' :
                          item.type === 'Private' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                        ₹{item.fees.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Found</h3>
                <p className="text-gray-600">
                  No seat data matches your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}