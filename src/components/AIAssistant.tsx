import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Counselling Assistant. I can help you with college admissions, document requirements, fees, cutoffs, and counselling processes. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = {
    fees: {
      keywords: ['fees', 'cost', 'fee structure', 'tuition', 'expenses'],
      response: 'Here are the typical fee structures:\n\n• IITs: ₹2-2.5 lakhs/year\n• NITs: ₹1.5-2 lakhs/year\n• AIIMS: ₹5,000-50,000/year\n• Private Engineering: ₹3-15 lakhs/year\n• Private Medical: ₹15-25 lakhs/year\n\nSC/ST students get fee waivers in government colleges. Would you like specific fee details for any college?'
    },
    documents: {
      keywords: ['documents', 'certificate', 'papers', 'upload', 'verification'],
      response: 'Required documents vary by category:\n\n📋 **General Documents:**\n• 10th & 12th Mark Sheets\n• Admit Card & Score Card\n• Transfer Certificate\n• Character Certificate\n\n📋 **Category-specific:**\n• OBC: Non-creamy layer certificate\n• SC/ST: Caste certificate\n• EWS: Income certificate\n• PWD: Disability certificate\n\nWhich specific document do you need help with?'
    },
    cutoffs: {
      keywords: ['cutoff', 'rank', 'percentile', 'closing rank', 'opening rank'],
      response: 'Cutoffs vary by college, branch, and category:\n\n🎯 **JEE Main Cutoffs (2023):**\n• IIT Delhi CSE: 99.9+ percentile\n• NIT Trichy CSE: 99.5+ percentile\n• DTU CSE: 99.2+ percentile\n\n🎯 **NEET Cutoffs:**\n• AIIMS Delhi: 99.9+ percentile\n• CMC Vellore: 99.8+ percentile\n\nCutoffs change yearly. Which specific college/branch are you interested in?'
    },
    counselling: {
      keywords: ['counselling', 'josaa', 'mcc', 'choice filling', 'seat allotment'],
      response: 'Counselling Process Overview:\n\n🔄 **JoSAA (Engineering):**\n1. Registration & Document Verification\n2. Choice Filling & Locking\n3. Seat Allotment (6 rounds)\n4. Fee Payment & Reporting\n\n🔄 **MCC (Medical):**\n1. Registration\n2. Choice Filling\n3. Seat Allotment (3 rounds)\n4. Reporting to College\n\nWhich counselling process do you need help with?'
    },
    default: {
      keywords: [],
      response: 'I can help you with:\n\n🎓 College admissions & cutoffs\n📋 Document requirements\n💰 Fee structures & scholarships\n📅 Counselling processes\n🏛️ College information\n📊 Rank predictions\n\nPlease ask me anything specific about college counselling!'
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, data] of Object.entries(aiResponses)) {
      if (key === 'default') continue;
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    return aiResponses.default.response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          AI Assistant
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">AI Counselling Assistant</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about colleges, cutoffs, documents..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}