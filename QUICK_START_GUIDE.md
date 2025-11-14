# 🎯 Quick Start Guide - GramSetu AI

## 🚀 How to Run

```bash
# Navigate to project directory
cd "/Users/sagar/Documents/GramSetu AI – National Governance Intelligence Network"

# Install dependencies (if not already done)
npm install

# Start the application
npm start
```

The app will open at `http://localhost:3000`

## 🔑 Login Credentials

### All Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@gramsetu.in | citizen123 |
| Field Worker | field@gramsetu.in | field123 |
| District Officer | district@gramsetu.in | district123 |
| State Officer | state@gramsetu.in | state123 |
| National Admin | admin@gramsetu.in | admin123 |

## 📍 Navigation Guide

### After Login, You'll See:

1. **Sidebar Menu** (Left side, collapsible)
   - 🏠 Dashboard (Main page)
   - 📊 Analytics (Charts & reports)
   - 💬 AI Assistant (Chat interface)
   - Role-specific items (varies by role)
   - ⚙️ Settings (Profile & preferences)
   - 🚪 Logout

2. **Main Content Area** (Center)
   - Dashboard widgets
   - Charts and visualizations
   - Real-time updates (auto-refresh)

3. **Floating AI Assistant** (Bottom-right)
   - Click to open chat
   - Quick governance queries
   - Role-based assistance

## 🎮 Testing Each Feature

### 1. Test Dashboard
- **Action**: After login, you're on the dashboard
- **Look for**: 
  - KPI cards at the top
  - Charts showing data
  - Auto-refresh (data updates every 10-15 seconds)

### 2. Test Analytics Page
- **Action**: Click "📊 Analytics" in sidebar
- **Look for**:
  - Time range selector (7d, 30d, 90d, 1y)
  - Summary cards
  - Multiple interactive charts
  - Export buttons

### 3. Test AI Chat
- **Action**: Click "💬 AI Assistant" in sidebar
- **Try**:
  - Type a question (e.g., "Check status", "Show tasks")
  - Click quick action buttons
  - Test voice button
  - Try fullscreen mode

### 4. Test Settings
- **Action**: Click "⚙️ Settings" in sidebar
- **Explore**:
  - Profile tab: Change avatar, update name
  - Notifications tab: Toggle switches
  - Security tab: Password change form
  - Appearance tab: Change theme/language
  - Privacy tab: Data controls

### 5. Test Role-Specific Features

#### As Citizen
- Click "My Complaints" → See your complaint list
- Click "Notifications" → View alerts

#### As Field Worker
- Click "My Tasks" → Task management
- Click "Citizens" → Citizen database

#### As District Officer
- Click "Ward Map" → Heatmap visualization
- Click "Officers" → Officer list
- Click "Escalations" → Alert management

#### As State Officer
- Click "Integrity Index" → State-level metrics
- Click "District Map" → Geographic view
- Click "Risk Analysis" → Predictive insights

#### As National Admin
- Click "India Map" → National overview
- Click "Compliance" → State compliance
- Click "Policy AI" → Policy analysis

## 🎨 UI Features to Notice

### Animations
- Splash screen on first load
- Smooth page transitions
- Hover effects on buttons
- Typing indicators in chat
- Auto-refresh animations

### Responsive Design
- Collapse sidebar (click ← button)
- Resize browser to see mobile view
- Charts adapt to screen size
- Menu becomes scrollable on small screens

### Interactive Elements
- Hover over charts for tooltips
- Click time ranges in Analytics
- Toggle switches in Settings
- Quick action buttons in AI Chat

## 🔍 Testing Checklist

- [ ] Login with all 5 roles
- [ ] Navigate to Dashboard
- [ ] Click Analytics → Change time ranges
- [ ] Click AI Chat → Ask questions
- [ ] Click Settings → Change preferences
- [ ] Test all role-specific menu items
- [ ] Click Logout → Confirm redirect to login
- [ ] Login again → Verify session persistence
- [ ] Collapse/expand sidebar
- [ ] Test floating AI assistant (bottom-right)
- [ ] Resize browser window
- [ ] Check auto-refresh (watch dashboard data)

## 🐛 Troubleshooting

### If login doesn't work:
- Use exact credentials from table above
- Check console for errors (F12)
- Clear browser cache
- Restart development server

### If navigation redirects to login:
- Already fixed! All routes now work properly
- If issue persists, check browser console

### If charts don't show:
- Wait for auto-refresh (10-15 seconds)
- Check browser console
- Verify Recharts is installed

### If styles look broken:
- Hard refresh (Ctrl/Cmd + Shift + R)
- Clear browser cache
- Check CSS files loaded

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl/Cmd + Shift + M)
3. Select a mobile device
4. Test all features

## 🎯 Demo Flow for Presentation

### Option 1: Quick Demo (2 minutes)
1. Show splash screen
2. Login as National Admin
3. Show national dashboard
4. Navigate to Analytics
5. Open AI Chat
6. Ask AI a question

### Option 2: Full Demo (5 minutes)
1. Splash screen
2. Login as Citizen
3. Show citizen dashboard
4. File a voice complaint
5. Logout → Login as Field Worker
6. Show task management
7. Navigate to Analytics
8. Open AI Chat
9. Go to Settings
10. Show multilingual support

### Option 3: Feature Showcase (10 minutes)
1. All 5 role dashboards
2. Analytics with different time ranges
3. AI Chat with various queries
4. Settings customization
5. Role-specific features
6. Responsive design
7. Auto-refresh demonstration
8. Export functionality

## 🌟 Impressive Features to Highlight

1. **Real-time Updates** - Auto-refresh every 10-15 seconds
2. **AI Integration** - Context-aware AI assistant
3. **Multi-language** - 6 Indian languages supported
4. **Role-based Access** - 5 distinct user roles
5. **Professional Charts** - 6 chart types using Recharts
6. **Voice Input** - Multilingual voice complaints
7. **Responsive Design** - Works on all devices
8. **Digital India Theme** - Patriotic color scheme
9. **Smooth Animations** - Framer Motion effects
10. **Production Ready** - Fully functional system

## 🎓 For IIT Bombay Techfest

### Key Talking Points:
- Built with modern React ecosystem
- Scalable architecture
- Real-time data visualization
- AI-powered governance
- Supports Digital India initiative
- Multi-stakeholder platform
- Production-ready code quality
- Demonstrates full-stack capabilities

### Technical Highlights:
- React 18.3.1 with hooks
- React Router v6 for routing
- Context API for state management
- JWT authentication
- Protected routes
- Code splitting
- Performance optimized
- Accessibility compliant

## 📞 Support

If you encounter any issues:
1. Check browser console (F12)
2. Review error messages
3. Verify all dependencies installed
4. Restart development server
5. Clear browser cache

## 🎉 Enjoy Testing!

Your GramSetu AI dashboard is **fully functional** and ready to impress at IIT Bombay Techfest! 🚀🇮🇳
