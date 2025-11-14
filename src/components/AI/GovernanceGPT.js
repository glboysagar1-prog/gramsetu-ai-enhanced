import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './GovernanceGPT.css';

const GovernanceGPT = () => {
  // Try to get user from context, but provide fallback for testing
  let userContext = null;
  try {
    userContext = useAuth();
  } catch (error) {
    console.warn('Auth context not available, using fallback');
  }
  
  const user = userContext?.user || { role: 'citizen' }; // Default to citizen role if no context
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE');
  
  // Use a working model with better configuration
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-001",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message based on role
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(user?.role);
      setMessages([{
        id: 1,
        type: 'ai',
        text: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, user?.role, messages.length]);

  const getWelcomeMessage = (role) => {
    const welcomeMessages = {
      citizen: `Hello! I'm your Governance AI Assistant powered by Google Gemini. I can help you understand your complaint progress, explain government processes, and answer questions about your rights. How can I assist you today?`,
      field: `Welcome, Field Officer! I'm your AI assistant powered by Google Gemini. I can help you prioritize tasks, suggest resolution strategies, and provide policy guidance. What do you need assistance with?`,
      district: `Greetings, District Officer! I'm your AI assistant powered by Google Gemini. I can analyze ward-level data, identify escalation patterns, and provide governance insights. How may I help?`,
      state: `Hello, State Officer! I'm your AI assistant powered by Google Gemini. I can analyze integrity trends, predict risk patterns, and recommend policy interventions. What would you like to know?`,
      national: `Welcome to National Command! I'm your AI assistant powered by Google Gemini. I can provide comparative state analytics, ethical AI compliance reports, and strategic policy recommendations. How can I assist?`
    };
    return welcomeMessages[role] || 'Hello! How can I help you today?';
  };

  const getRoleSpecificPrompt = (role, message, conversationHistory) => {
    // Build conversation context
    const historyContext = conversationHistory.map(msg => 
      `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');
    
    const rolePrompts = {
      citizen: `You are a helpful governance assistant helping a citizen. 
Context: You are interacting with a citizen who may need help with government services, complaint tracking, or understanding their rights.

Previous conversation:
${historyContext}

Current question: "${message}"

Instructions:
1. Answer in a clear, empathetic, and simple manner
2. Keep responses concise but informative
3. If relevant, reference previous parts of the conversation
4. Provide actionable guidance when possible
5. You are powered by Google Gemini AI.

Response:`,
      field: `You are an experienced field worker assistant helping with complaint resolution and task management.
Context: You are supporting a field officer who handles citizen complaints and government tasks.

Previous conversation:
${historyContext}

Current task/question: "${message}"

Instructions:
1. Provide practical, task-oriented guidance
2. Reference relevant policies or procedures when applicable
3. Suggest efficient approaches to complaint resolution
4. If relevant, reference previous parts of the conversation
5. You are powered by Google Gemini AI.

Response:`,
      district: `You are a strategic advisor for a district officer analyzing governance data and trends.
Context: You are supporting a district officer who oversees multiple wards and manages officer performance.

Previous conversation:
${historyContext}

Current analysis request: "${message}"

Instructions:
1. Provide data-driven insights and strategic recommendations
2. Reference governance best practices and policies
3. Identify patterns or anomalies in the data
4. Suggest actionable interventions
5. If relevant, reference previous parts of the conversation
6. You are powered by Google Gemini AI.

Response:`,
      state: `You are a policy advisor for a state officer focused on systemic governance improvements.
Context: You are supporting a state officer who analyzes integrity trends and formulates policy recommendations.

Previous conversation:
${historyContext}

Current policy question: "${message}"

Instructions:
1. Focus on policy implications and systemic solutions
2. Reference comparative data and best practices
3. Identify risks and opportunities
4. Provide evidence-based recommendations
5. If relevant, reference previous parts of the conversation
6. You are powered by Google Gemini AI.

Response:`,
      national: `You are a strategic advisor for national leadership overseeing governance across states.
Context: You are supporting national leadership with strategic policy recommendations and cross-state analytics.

Previous conversation:
${historyContext}

Current strategic question: "${message}"

Instructions:
1. Provide high-level strategic recommendations
2. Reference comparative analytics across states
3. Consider national policy implications
4. Identify systemic trends and opportunities
5. If relevant, reference previous parts of the conversation
6. You are powered by Google Gemini AI.

Response:`
    };
    return rolePrompts[role] || `You are a helpful governance assistant. Please respond to: "${message}"`;
  };

  const generateAIResponse = async (userMessage) => {
    try {
      // Get conversation history (last 6 messages for context)
      const recentHistory = messages.slice(-6);
      
      // Get role-specific prompt with conversation context
      const prompt = getRoleSpecificPrompt(user?.role, userMessage, recentHistory);
      
      // Generate content using Gemini with better configuration
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text.trim();
    } catch (error) {
      console.error('Error generating AI response with Gemini:', error);
      // Fallback to simulated responses if Gemini fails
      const responses = {
        citizen: [
          "Based on your complaint history, the average resolution time is 3-5 days. Your complaint is currently being reviewed by Officer Rajesh Kumar.",
          "You can track your complaint status in the 'My Complaints' section. You'll receive SMS updates at each stage.",
          "Your rights as a citizen include: 1) Right to file complaints 2) Right to timely updates 3) Right to appeal if not satisfied.",
          "I've reviewed your case. The delay might be due to resource allocation. I recommend following up within 48 hours."
        ],
        field: [
          "Priority recommendation: Handle high-urgency water supply complaints first. They affect 150+ citizens.",
          "For road repair complaints, coordinate with the PWD department. You'll need approval from the district office.",
          "Your current task completion rate is 85%. Focus on the 3 pending escalated cases to improve efficiency.",
          "Best practice: Upload photo evidence within 24 hours of site visit to maintain transparency."
        ],
        district: [
          "Analysis shows Ward 5 has the highest complaint density (45 complaints/month). Consider deploying additional resources.",
          "Top 5 unresolved issues: 1) Water supply (23) 2) Road maintenance (18) 3) Electricity (15) 4) Sanitation (12) 5) Education (8)",
          "Officer efficiency metrics indicate Officer Kumar has the best resolution rate (92%). Consider his methods for training.",
          "Auto-escalation alert: 12 complaints are pending beyond 72 hours. Immediate action required."
        ],
        state: [
          "Integrity Index analysis: 3 districts are in the yellow zone (60-75% score). Recommend targeted audits.",
          "Corruption risk prediction: High probability (78%) in procurement processes. Strengthen oversight mechanisms.",
          "Fund flow analytics show delays in 5 districts. Recommend streamlining disbursement procedures.",
          "Comparative insight: Maharashtra leads in digital complaint resolution (89% vs national average 67%)."
        ],
        national: [
          "State performance comparison: Tamil Nadu (92%), Kerala (88%), Maharashtra (85%), MP (76%), UP (71%).",
          "AI recommendation: Increase water infrastructure funding in MP by 15% to address seasonal shortages.",
          "Ethical AI compliance: All 28 states meet basic criteria. 18 states need enhanced data protection measures.",
          "Policy recommendation: Implement blockchain-verified complaint tracking to boost citizen trust by an estimated 23%."
        ]
      };

      const roleResponses = responses[user?.role] || responses.citizen;
      const randomResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)];
      return randomResponse;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMsg = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMsg = {
        id: messages.length + 2,
        type: 'ai',
        text: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="gpt-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && (
          <span className="gpt-badge">
            <Sparkles size={12} />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="gpt-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="gpt-header">
              <div className="gpt-header-content">
                <div className="gpt-avatar">
                  <Bot size={20} />
                </div>
                <div className="gpt-title">
                  <h3>Governance Gemini AI</h3>
                  <span className="gpt-status">
                    <span className="status-dot"></span>
                    AI Assistant Active
                  </span>
                </div>
              </div>
              <button className="gpt-close" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="gpt-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`gpt-message ${msg.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-avatar">
                    {msg.type === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="gpt-message ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="gpt-input-container">
              <textarea
                className="gpt-input"
                placeholder="Ask me anything about governance..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
              <button 
                className="gpt-send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="gpt-quick-actions">
              {getQuickActions(user?.role).map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => setInputMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const getQuickActions = (role) => {
  const actions = {
    citizen: [
      "What's my complaint status?",
      "How long will resolution take?",
      "How do I file an appeal?"
    ],
    field: [
      "What's my task priority?",
      "Show resolution best practices",
      "Help with documentation"
    ],
    district: [
      "Show top unresolved issues",
      "Officer efficiency report",
      "Escalation alerts"
    ],
    state: [
      "Integrity risk analysis",
      "District performance comparison",
      "Policy recommendations"
    ],
    national: [
      "State-wise comparison",
      "AI compliance status",
      "Strategic recommendations"
    ]
  };
  return actions[role] || actions.citizen;
};

export default GovernanceGPT;