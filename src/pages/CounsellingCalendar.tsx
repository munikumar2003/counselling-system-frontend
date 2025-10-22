import React, { useState } from 'react';
import { ArrowLeft, Calendar, Bell, Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  exam: string;
  date: string;
  time: string;
  type: 'result' | 'registration' | 'choice_filling' | 'allotment' | 'counselling';
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  important: boolean;
}

export default function CounsellingCalendar() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState('all');
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderPhone, setReminderPhone] = useState('');

  const exams = [
    { id: 'all', name: 'All Exams' },
    { id: 'jee_main', name: 'JEE Main' },
    { id: 'jee_advanced', name: 'JEE Advanced' },
    { id: 'neet', name: 'NEET' },
    { id: 'gate', name: 'GATE' },
    { id: 'cat', name: 'CAT' }
  ];

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'JEE Main Result Declaration',
      exam: 'jee_main',
      date: '2024-04-25',
      time: '10:00 AM',
      type: 'result',
      status: 'completed',
      description: 'JEE Main 2024 Session 2 results will be declared',
      important: true
    },
    {
      id: '2',
      title: 'JEE Advanced Registration Opens',
      exam: 'jee_advanced',
      date: '2024-05-01',
      time: '09:00 AM',
      type: 'registration',
      status: 'upcoming',
      description: 'Registration for JEE Advanced 2024 begins',
      important: true
    },
    {
      id: '3',
      title: 'NEET Result Declaration',
      exam: 'neet',
      date: '2024-06-14',
      time: '02:00 PM',
      type: 'result',
      status: 'upcoming',
      description: 'NEET UG 2024 results will be announced',
      important: true
    },
    {
      id: '4',
      title: 'JoSAA Choice Filling Starts',
      exam: 'jee_main',
      date: '2024-06-20',
      time: '10:00 AM',
      type: 'choice_filling',
      status: 'upcoming',
      description: 'Joint Seat Allocation Authority choice filling begins',
      important: true
    },
    {
      id: '5',
      title: 'JoSAA Choice Filling Ends',
      exam: 'jee_main',
      date: '2024-06-30',
      time: '05:00 PM',
      type: 'choice_filling',
      status: 'upcoming',
      description: 'Last date for JoSAA choice filling and locking',
      important: true
    },
    {
      id: '6',
      title: 'JoSAA Round 1 Seat Allotment',
      exam: 'jee_main',
      date: '2024-07-05',
      time: '05:00 PM',
      type: 'allotment',
      status: 'upcoming',
      description: 'First round of seat allotment results',
      important: true
    },
    {
      id: '7',
      title: 'NEET Counselling Registration',
      exam: 'neet',
      date: '2024-07-10',
      time: '12:00 PM',
      type: 'registration',
      status: 'upcoming',
      description: 'MCC NEET counselling registration opens',
      important: true
    },
    {
      id: '8',
      title: 'GATE 2025 Application Opens',
      exam: 'gate',
      date: '2024-08-15',
      time: '10:00 AM',
      type: 'registration',
      status: 'upcoming',
      description: 'GATE 2025 application process begins',
      important: false
    },
    {
      id: '9',
      title: 'CAT 2024 Registration Opens',
      exam: 'cat',
      date: '2024-08-01',
      time: '10:00 AM',
      type: 'registration',
      status: 'upcoming',
      description: 'Common Admission Test registration begins',
      important: false
    },
    {
      id: '10',
      title: 'JoSAA Round 2 Seat Allotment',
      exam: 'jee_main',
      date: '2024-07-12',
      time: '05:00 PM',
      type: 'allotment',
      status: 'upcoming',
      description: 'Second round of seat allotment results',
      important: true
    }
  ];

  const filteredEvents = selectedExam === 'all' 
    ? events 
    : events.filter(event => event.exam === selectedExam);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'result': return 'bg-green-100 text-green-800 border-green-200';
      case 'registration': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'choice_filling': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'allotment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'counselling': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ongoing': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'upcoming': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const setupReminders = () => {
    if (!reminderEmail && !reminderPhone) {
      toast.error('Please provide email or phone number for reminders');
      return;
    }
    
    toast.success('Reminder alerts have been set up successfully!');
    setReminderEmail('');
    setReminderPhone('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Counselling Calendar</h1>
                <p className="text-indigo-100 mt-2">
                  Stay updated with all important counselling dates and deadlines
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Reminder Setup */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">Set Up Reminders</h3>
              </div>
              <p className="text-orange-700 mb-4 text-sm">
                Get email and SMS alerts for important counselling dates and deadlines
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="tel"
                  value={reminderPhone}
                  onChange={(e) => setReminderPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={setupReminders}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Setup Alerts
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            {/* Events Timeline */}
            <div className="space-y-4">
              {filteredEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => {
                  const daysUntil = isUpcoming(event.date);
                  return (
                    <div
                      key={event.id}
                      className={`border-l-4 pl-6 py-4 rounded-r-lg ${
                        event.important ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(event.status)}
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            {event.important && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Important
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                              {event.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {exams.find(e => e.id === event.exam)?.name}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">{formatDate(event.date)}</span>
                              <span>{event.time}</span>
                              {event.status === 'upcoming' && daysUntil >= 0 && (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  daysUntil <= 7 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {daysUntil === 0 ? 'Today' : 
                                   daysUntil === 1 ? 'Tomorrow' : 
                                   `${daysUntil} days left`}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600">
                  No events found for the selected exam. Try selecting a different exam.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}