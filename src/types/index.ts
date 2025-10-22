export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'student' | 'admin';
  registrationNumber?: string;
  profileComplete: boolean;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  nationality: string;
  state: string;
  city: string;
  pincode: string;
  parentName: string;
  parentPhone: string;
  academicDetails: AcademicDetails;
  documents: Document[];
}

export interface AcademicDetails {
  tenthBoard: string;
  tenthYear: string;
  tenthPercentage: number;
  twelfthBoard: string;
  twelfthYear: string;
  twelfthPercentage: number;
  entranceExam: string;
  entranceRank: number;
  entranceScore: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface Choice {
  id: string;
  userId: string;
  choices: CourseChoice[];
  submittedAt: Date;
  locked: boolean;
}

export interface CourseChoice {
  rank: number;
  collegeId: string;
  collegeName: string;
  courseId: string;
  courseName: string;
  fees: number;
}

export interface Result {
  id: string;
  userId: string;
  allottedCollege?: string;
  allottedCourse?: string;
  allottedRound: number;
  status: 'allotted' | 'waitlisted' | 'not_allotted';
  declaredAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}