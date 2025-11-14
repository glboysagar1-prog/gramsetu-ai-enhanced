import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Mic, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Welcome message
    const welcomeMsg = {
      role: 'assistant',
      content: getWelcomeMessage(user.role),
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, [user.role]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (role) => {
    const welcomeMessages = {
      citizen: `Hello ${user.name}! 👋 I'm your Governance AI Assistant. I can help you:
• Track your complaints and get status updates
• File new complaints with voice or text
• Get estimated resolution times
• Understand governance processes
• Connect you with the right authorities

What would you like to know today?`,
      
      field: `Welcome, Field Officer ${user.name}! 👮 I'm here to assist you with:
• Prioritizing tasks based on urgency and location
• Optimal route planning for field visits
• Quick access to citizen complaint history
• Evidence documentation guidelines
• Best practices for resolution

How can I help you today?`,
      
      district: `Greetings, District Officer ${user.name}! 🏛️ I can help you:
• Analyze ward-level performance metrics
• Identify bottlenecks and escalation patterns
• Predict complaint hotspots
• Generate comprehensive reports
• Optimize officer allocation

What insights do you need?`,
      
      state: `Hello, State Officer ${user.name}! ⚖️ I can assist with:
• Analyzing state-wide integrity trends
• District-level comparative analytics
• Policy impact assessment
• Risk pattern detection
• Fund allocation optimization

What would you like to explore?`,
      
      national: `Welcome to National Command, ${user.name}! 🇮🇳 I provide:
• Pan-India governance analytics
• State performance comparisons
• Policy effectiveness insights
• Predictive trend analysis
• Federation-wide compliance monitoring

How may I assist you today?`
    };

    return welcomeMessages[role] || 'Hello! How can I help you today?';
  };

  const getAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Role-specific responses
    const responses = {
      citizen: {
        'status': `Your recent complaint (#C12345) regarding water supply is currently in progress. Our field officer is scheduled to visit your location tomorrow at 10 AM. Expected resolution: 2-3 days.`,
        'new complaint': `I can help you file a new complaint. Please tell me:
1. Category (Water/Roads/Electricity/Sanitation)
2. Brief description
3. Your location
Or click the microphone to record your complaint in any Indian language!`,
        'track': `You have 3 active complaints:
• #C12345 - Water Supply (In Progress)
• #C12342 - Street Light (Assigned)
• #C12340 - Road Repair (Pending)
Which one would you like to check?`,
        'default': `I can help you with complaint filing, tracking, status updates, and understanding the resolution process. What specific assistance do you need?`
      },
      
      field: {
        'route': `Based on your current location and pending tasks, here's the optimal route:
1. Ward 3 - Water leak (High Priority) - 2.3 km
2. Ward 1 - Street light (Medium) - 3.1 km
3. Ward 5 - Road pothole (Low) - 1.8 km
Total distance: 7.2 km | Estimated time: 2.5 hours`,
        'priority': `Your high-priority tasks for today:
🔴 Critical (2 tasks) - Response time < 4 hours
• Ward 3: Water contamination
• Ward 7: Electrical hazard
🟡 High (5 tasks) - Response time < 24 hours
• Ward 1, 2, 4, 6, 8`,
        'history': `Loading citizen complaint history... Which area or citizen ID would you like to check?`,
        'default': `I can assist with task prioritization, route optimization, accessing citizen histories, and resolution guidelines. What do you need?`
      },
      
      district: {
        'performance': `Ward Performance Summary (Last 30 days):
🥇 Ward 4: 94% resolution rate | 2.1 days avg
🥈 Ward 2: 91% resolution rate | 2.5 days avg
🥉 Ward 1: 87% resolution rate | 3.2 days avg
⚠️ Ward 3: 76% resolution rate | 4.8 days avg (requires attention)`,
        'escalation': `12 complaints require immediate attention:
• 3 overdue > 72 hours
• 5 citizen escalations
• 4 high-urgency pending
Would you like me to auto-assign or show details?`,
        'report': `Generating comprehensive district report...
✓ Complaint trends analysis
✓ Officer performance metrics
✓ Resource utilization
✓ Predictive insights
Format: PDF/Excel? Email to: ${user.email}?`,
        'default': `I can provide ward analytics, identify escalations, generate reports, and optimize officer allocation. What analysis do you need?`
      },
      
      state: {
        'integrity': `State Integrity Index: 87/100 (↑2 points)
Top Performers:
• Mumbai District: 94
• Pune District: 91
• Nagpur District: 88
Areas needing attention:
• Raigad District: 72 (policy intervention recommended)`,
        'comparison': `District Comparison Matrix:
Efficiency: Mumbai > Pune > Thane > Nashik
Response Time: Pune (1.8d) < Mumbai (2.1d) < Thane (2.7d)
Citizen Satisfaction: Mumbai (91%) > Pune (88%) > Nashik (84%)`,
        'risk': `5 risk patterns detected:
🔴 High Risk: 2 districts showing declining trends
🟡 Medium Risk: 3 districts with resource constraints
📊 Predictive model suggests intervention in Raigad and Dhule`,
        'default': `I can analyze integrity trends, compare districts, detect risk patterns, and assess policy impact. What insights do you need?`
      },
      
      national: {
        'compliance': `National Compliance Dashboard:
🇮🇳 Overall: 88% (28/29 states compliant)
Top States: Kerala (96%), Tamil Nadu (94%), Maharashtra (92%)
Action Required: 1 state below threshold (requires federal assistance)`,
        'trends': `National Governance Trends (Q4 2024):
✓ 12% improvement in resolution times
✓ 18% increase in digital complaint filing
✓ 91% citizen satisfaction (↑5%)
⚠️ Regional disparity in rural vs urban (action recommended)`,
        'policy': `Policy Impact Analysis:
New Digital India Initiative:
• 34% faster complaint processing
• 28% reduction in escalations
• 89% adoption rate across states
ROI: High | Recommendation: Expand to Tier-2 cities`,
        'default': `I provide national analytics, state comparisons, policy assessments, and strategic insights. How can I help?`
      }
    };

    const roleResponses = responses[user.role] || responses.citizen;
    
    for (const [key, response] of Object.entries(roleResponses)) {
      if (lowerMsg.includes(key)) {
        return response;
      }
    }
    
    return roleResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg = {
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = {
    citizen: ['Check Status', 'File Complaint', 'Track Issues', 'Contact Support'],
    field: ['View Tasks', 'Optimize Route', 'Update Status', 'Get Guidelines'],
    district: ['Ward Analytics', 'View Escalations', 'Generate Report', 'Officer Performance'],
    state: ['Integrity Index', 'District Comparison', 'Risk Analysis', 'Policy Impact'],
    national: ['National Dashboard', 'State Rankings', 'Compliance Check', 'Trend Analysis']
  };

  return (
    <div className={`ai-chat-page ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="chat-header">
        <div className="header-content">
          <Sparkles className="header-icon" />
          <div>
            <h1>🤖 AI Assistant</h1>
            <p>Intelligent governance support powered by GramSetu AI</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message assistant typing">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {(quickActions[user.role] || []).map((action, index) => (
            <button 
              key={index}
              className="quick-action-btn"
              onClick={() => setInput(action)}
            >
              {action}
            </button>
          ))}
        </div>

        <div className="chat-input-area">
          <button className="voice-btn" title="Voice Input">
            <Mic size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about governance, complaints, or analytics..."
            rows="1"
          />
          <button 
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
