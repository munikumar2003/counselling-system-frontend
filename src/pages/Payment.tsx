import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building, Shield, CircleCheck as CheckCircle, Lock, ArrowLeft, Star, Users, Award, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payment() {
  const { user, updateUser, resetSearchCount } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Method Selection, 2: Payment Details, 3: Processing, 4: Success

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    bankName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const validatePayment = () => {
    if (selectedMethod === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Please enter a valid 16-digit card number');
      }
      if (!paymentData.expiryDate || paymentData.expiryDate.length !== 5) {
        throw new Error('Please enter a valid expiry date (MM/YY)');
      }
      if (!paymentData.cvv || paymentData.cvv.length !== 3) {
        throw new Error('Please enter a valid 3-digit CVV');
      }
      if (!paymentData.cardName.trim()) {
        throw new Error('Please enter the cardholder name');
      }
    } else if (selectedMethod === 'upi') {
      if (!paymentData.upiId || !paymentData.upiId.includes('@')) {
        throw new Error('Please enter a valid UPI ID');
      }
    } else if (selectedMethod === 'netbanking') {
      if (!paymentData.bankName) {
        throw new Error('Please select your bank');
      }
    }
  };

  const handlePayment = async () => {
    try {
      validatePayment();
      setLoading(true);
      setStep(3);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        updateUser({ paymentStatus: 'completed' });
        resetSearchCount();
        setStep(4);
        toast.success('Payment successful! You now have unlimited access.');
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building className="w-6 h-6" />,
      description: 'All major banks supported'
    }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank'
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'Unlimited College Search',
      description: 'Search colleges without any restrictions'
    },
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: 'Expert Counselling',
      description: 'Get guidance from experienced counsellors'
    },
    {
      icon: <Award className="w-5 h-5 text-green-500" />,
      title: 'Premium Features',
      description: 'Access to advanced filters and analytics'
    },
    {
      icon: <Star className="w-5 h-5 text-purple-500" />,
      title: 'Priority Support',
      description: '24/7 dedicated customer support'
    }
  ];

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Congratulations! You now have unlimited access to our college finder platform.
            </p>
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  {feature.icon}
                  <div>
                    <div className="font-medium text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/college-finder')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Exploring Colleges
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
            <p className="text-gray-600 mb-4">
              Please wait while we process your payment securely...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <h1 className="text-3xl font-bold text-white">Unlock Premium Access</h1>
                <p className="text-blue-100 mt-2">
                  Get unlimited college searches and premium features
                </p>
              </div>

              <div className="p-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Choose Payment Method</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${
                              selectedMethod === method.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {method.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Change Method
                      </button>
                    </div>

                    {selectedMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={paymentData.expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={paymentData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={paymentData.cardName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={paymentData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@paytm"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {selectedMethod === 'netbanking' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Bank
                        </label>
                        <select
                          name="bankName"
                          value={paymentData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose your bank</option>
                          {banks.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Shield className="w-4 h-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹999 Securely</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium Access</span>
                  <span className="font-semibold">₹999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹180</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹1,179</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">What you get:</h4>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {feature.icon}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{feature.title}</div>
                      <div className="text-xs text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}