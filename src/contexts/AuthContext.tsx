import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';
//import api from '../api/axiosConfig';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
  searchCount: number;
  incrementSearchCount: () => void;
  resetSearchCount: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password validation
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain at least one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
  return errors;
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    // Check for existing session with security validation
    const storedUser = localStorage.getItem('user');
    const sessionToken = localStorage.getItem('sessionToken');
    const searchCountStored = localStorage.getItem('searchCount');
    
    if (storedUser && sessionToken) {
      try {
        const userData = JSON.parse(storedUser);
        // Validate session token (in real app, verify with backend)
        if (sessionToken && sessionToken.length > 20) {
          setUser(userData);
          setSearchCount(searchCountStored ? parseInt(searchCountStored) : 0);
        } else {
          // Invalid session, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('searchCount');
        }
      } catch (error) {
        // Corrupted data, clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('searchCount');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const response = await axios.post(
      'http://localhost:8080/api/users/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.success) {
      const userData = response.data.user; // ✅ Extract user details
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // optional persistence
      return response.data;
    } else {
      throw new Error(response.data.message || "Invalid credentials");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  const register = async (userData: RegisterData) => {
  setLoading(true);
  try {
    // Basic validation (you can keep your detailed checks if you want)
    if (!validateEmail(userData.email)) {
      throw new Error('Please enter a valid email address');
    }
    if (!validatePhone(userData.phone)) {
      throw new Error('Please enter a valid phone number');
    }
    const passwordErrors = validatePassword(userData.password);
    if (passwordErrors.length > 0) {
      console.log(passwordErrors.length);
      throw new Error(passwordErrors[0]);
    }
    
    // 🔥 Actual API call to Spring Boot backend
    const response = await axios.post(
      'http://localhost:8080/api/users/register',
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("hello");

    // ✅ Save user returned by backend
    const registeredUser: User = response.data;
    setUser(registeredUser);
    localStorage.setItem('user', JSON.stringify(registeredUser));

    // Create fake session token (for client-side use)
    const sessionToken = generateSecureToken();
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('sessionExpiration', (Date.now() + 86400000).toString());

  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    setSearchCount(0);
    // Clear all session data
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionExpiration');
    localStorage.removeItem('searchCount');
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in registered users list
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = storedUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
  };

  const incrementSearchCount = () => {
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    localStorage.setItem('searchCount', newCount.toString());
  };

  const resetSearchCount = () => {
    setSearchCount(0);
    localStorage.setItem('searchCount', '0');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      loading,
      searchCount,
      incrementSearchCount,
      resetSearchCount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Generate secure session token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
