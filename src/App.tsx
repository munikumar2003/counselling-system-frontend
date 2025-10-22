import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CollegeFinder from './pages/CollegeFinder';
import MultiExamPredictor from './pages/MultiExamPredictor';
import SeatMatrix from './pages/SeatMatrix';
import CounsellingCalendar from './pages/CounsellingCalendar';
import StudentReviews from './pages/StudentReviews';
import QAForum from './pages/QAForum';
import Mentorship from './pages/Mentorship';
import AlumniConnect from './pages/AlumniConnect';
import RankHeatmap from './pages/RankHeatmap';
import TrendAnalysis from './pages/TrendAnalysis';
import DocumentTracker from './pages/DocumentTracker';
import Payment from './pages/Payment';
import WaitTimeAnalysis from './pages/WaitTimeAnalysis';
import SubjectWeightage from './pages/SubjectWeightage';
import CollegeResources from './pages/CollegeResources';
import RankPredictor from './pages/RankPredictor';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistant from './components/AIAssistant';

function App() {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/college-finder" 
                element={
                  <ProtectedRoute>
                    <CollegeFinder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/multi-exam-predictor" 
                element={
                  <ProtectedRoute>
                    <MultiExamPredictor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seat-matrix" 
                element={
                  <ProtectedRoute>
                    <SeatMatrix />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/counselling-calendar" 
                element={
                  <ProtectedRoute>
                    <CounsellingCalendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-reviews" 
                element={
                  <ProtectedRoute>
                    <StudentReviews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/qa-forum" 
                element={
                  <ProtectedRoute>
                    <QAForum />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mentorship" 
                element={
                  <ProtectedRoute>
                    <Mentorship />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alumni-connect" 
                element={
                  <ProtectedRoute>
                    <AlumniConnect />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rank-heatmap" 
                element={
                  <ProtectedRoute>
                    <RankHeatmap />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trend-analysis" 
                element={
                  <ProtectedRoute>
                    <TrendAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/document-tracker" 
                element={
                  <ProtectedRoute>
                    <DocumentTracker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wait-time-analysis" 
                element={
                  <ProtectedRoute>
                    <WaitTimeAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subject-weightage" 
                element={
                  <ProtectedRoute>
                    <SubjectWeightage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/college-resources" 
                element={
                  <ProtectedRoute>
                    <CollegeResources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rank-predictor" 
                element={
                  <ProtectedRoute>
                    <RankPredictor />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <AIAssistant />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;