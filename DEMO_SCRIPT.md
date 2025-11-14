# 🎯 Demo Script - GramSetu AI
## IIT Bombay Techfest Presentation (120 seconds)

---

## Pre-Demo Checklist
- [ ] Application running (localhost:3000 or deployed URL)
- [ ] Demo credentials ready
- [ ] Browser console clear (F12)
- [ ] Audio working (for voice demo)
- [ ] Screen recording started (backup)
- [ ] Timer visible

---

## Demo Flow (Total: 120 seconds)

### **Opening Statement** (5 seconds)
> "GramSetu AI — transforming citizen voice into national intelligence in 120 seconds."

**Action:** Show homepage with 5 role cards

---

### **ACT 1: Citizen Voice** (25 seconds)

**Timestamp 0:05 - 0:30**

1. **Login as Citizen** (5s)
   - Email: `citizen@gramsetu.in`
   - Password: `citizen123`
   - Click "Use Demo Credentials" button

2. **Navigate to Analytics** (3s)
   - Click "Analytics" in sidebar
   - Show skeleton loaders → data appears

3. **File Voice Complaint** (12s)
   - Click "File New Complaint"
   - Category: Water Supply
   - Click 🎤 microphone button
   - **Say clearly:** "No water supply in Ward 12, Street 5 since two days. Very urgent."
   - Watch AI classifier analyze
   - Urgency auto-detected: **High**
   - Click **Submit**

4. **Show Optimistic UI** (5s)
   - Complaint appears immediately with "Pending..." badge
   - Skeleton transforms to complaint card
   - Green success toast: "Complaint #C12348 filed successfully"

**Narration:**
> "Citizen files a voice complaint in their local language. AI classifies it instantly and assigns urgency."

---

### **ACT 2: District Command** (30 seconds)

**Timestamp 0:30 - 1:00**

1. **Switch Role to District Officer** (5s)
   - Click **Role Switch** button (top-right)
   - Select "District Officer"
   - Dashboard switches instantly (no re-login)

2. **View New Complaint on Heatmap** (8s)
   - Click "Analytics"
   - Show Ward Heatmap with new red marker (Ward 12)
   - KPI cards update: "Active Cases: 153" (was 152)
   - Point to auto-escalation alert: "3 complaints > 72 hours"

3. **Assign to Field Worker** (10s)
   - Click complaint #C12348
   - Modal opens with details
   - Click "Assign to Field Worker"
   - Select "Rajesh Kumar - North Zone"
   - Show notification animation
   - **Green badge:** "Assigned to FW001"

4. **Show Blockchain Log** (7s)
   - Click "View Blockchain Audit"
   - Transaction hash appears:
     ```
     0x7a8f9e...c7b6a5
     Block: 45123458
     ```
   - Click Polygonscan link (opens in new tab)

**Narration:**
> "District officer sees real-time ward analytics, assigns to nearest field worker, and blockchain logs the audit trail."

---

### **ACT 3: Field Resolution** (25 seconds)

**Timestamp 1:00 - 1:25**

1. **Switch to Field Worker** (3s)
   - Role Switch → "Field Worker"
   - Dashboard shows: "3 Active Tasks"

2. **View Assigned Task** (5s)
   - Click "My Tasks"
   - See new task: "Ward 12 - Water Supply Issue"
   - Map shows optimal route: **7.2 km, 2.5 hours**
   - GPS coordinates displayed

3. **Upload Proof & Mark Resolved** (12s)
   - Click task #C12348
   - Click "Upload Evidence"
   - Select image: `water_valve_repaired.jpg`
   - **Optimistic UI:** Image preview appears immediately
   - Click "Mark as Resolved"
   - Add resolution note: "Water valve replaced. Supply restored."
   - Click **Confirm**

4. **Show Status Update** (5s)
   - Green animation: **"Task Completed ✓"**
   - Efficiency score updates: **92% → 93%**
   - New blockchain tx logged automatically

**Narration:**
> "Field worker receives task with GPS route, uploads proof on-site, marks resolved. Evidence is blockchain-verified."

---

### **ACT 4: AI Governance Insights** (25 seconds)

**Timestamp 1:25 - 1:50**

1. **Switch to State Officer** (3s)
   - Role Switch → "State Officer"

2. **Open AI Chat Assistant** (5s)
   - Click "AI Assistant" in sidebar
   - Full-page chat interface opens
   - Welcome message appears with role-aware greeting

3. **Ask Governance Question** (12s)
   - Type: **"Which district needs fund allocation?"**
   - Press Enter
   - **AI thinking animation** (dots pulsing)
   - Response appears (after 1.5s):
     ```
     Districts requiring urgent fund allocation:
     • Raigad (Integrity: 72, Resource utilization: 64%)
     • Dhule (Resource utilization: 68%)

     Recommended allocation:
     • ₹2.3 Cr for Raigad infrastructure
     • ₹1.8 Cr for Dhule healthcare

     Predictive model suggests intervention within 14 days.
     ```

4. **Show Quick Actions** (5s)
   - Click quick action: "Integrity Index"
   - Chart appears showing district scores
   - Raigad highlighted in red

**Narration:**
> "State officer asks AI for fund allocation insights. Vector-powered RAG provides data-backed recommendations."

---

### **ACT 5: National Intelligence & Export** (15 seconds)

**Timestamp 1:50 - 2:05**

1. **Switch to National Admin** (3s)
   - Role Switch → "National Admin"
   - India map dashboard appears

2. **View National Metrics** (5s)
   - Compliance Score: **88% (↑3%)**
   - Active States: **28/29**
   - Top performers: Kerala (96%), TN (94%), MH (92%)

3. **Export Report** (7s)
   - Click "Export PDF"
   - Progress bar: **Generating report...**
   - Download starts: `GramSetu_National_Report_2024.pdf` (3.2 MB)
   - Green toast: **"Report downloaded successfully"**

**Narration:**
> "National command sees pan-India compliance. One-click export generates comprehensive PDF with all analytics."

---

### **Closing Statement** (15 seconds)

**Timestamp 2:05 - 2:20**

**Narration:**
> "From a citizen's voice in Hindi to national policy insights — all in 120 seconds. GramSetu AI: Logged, audited, intelligent, and blockchain-verified. Every voice matters. Every complaint counts."

**Final Screen:**
- Show all 5 dashboards in split-screen (5x1 grid)
- Logo animation: GramSetu AI 🇮🇳
- QR code appears: "Try Demo Now"

---

## Backup Points (If Needed)

### If Voice Fails:
- Use text input: "No water supply Ward 12"
- AI still classifies correctly

### If API Slow:
- Mention: "Running on deterministic mocks for demo stability"
- All features identical to production

### If Asked About Tech Stack:
- **Frontend:** React 18, Framer Motion, Recharts, Tailwind
- **Backend:** Flask/FastAPI, PostgreSQL, Redis
- **AI:** OpenAI GPT-3.5, Whisper, LangChain, Pinecone
- **Blockchain:** Thirdweb (Polygon)
- **Deploy:** Docker, Vercel (frontend), Render (backend)

---

## Test Credentials (Keep Visible)

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@gramsetu.in | citizen123 |
| Field Worker | field@gramsetu.in | field123 |
| District Officer | district@gramsetu.in | district123 |
| State Officer | state@gramsetu.in | state123 |
| National Admin | admin@gramsetu.in | admin123 |

---

## Timing Breakdown

| Section | Duration | Cumulative |
|---------|----------|------------|
| Opening | 5s | 0:05 |
| Citizen Voice | 25s | 0:30 |
| District Command | 30s | 1:00 |
| Field Resolution | 25s | 1:25 |
| AI Insights | 25s | 1:50 |
| National Export | 15s | 2:05 |
| Closing | 15s | 2:20 |

**Total:** 2 minutes 20 seconds (with 20s buffer)

---

## Success Criteria

- ✅ No errors in browser console
- ✅ All transitions smooth (<300ms)
- ✅ Blockchain tx visible
- ✅ AI response appears
- ✅ PDF downloads successfully
- ✅ Role switch works instantly
- ✅ Demo completes in <2:30

---

## Emergency Fallback

If live demo fails:
1. Press **F11** for fullscreen
2. Navigate to: `http://localhost:3000?offline=true`
3. All data pre-seeded from `seed_data.json`
4. OR play backup video: `/demo/demo_sequence.mp4`

---

**Rehearse 3 times before presentation!**
