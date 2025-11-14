/* GramSetu AI – App logic (SPA with hash routing, mock data, localStorage) */

const APP_NAME = 'GramSetu AI – National Governance Intelligence Network';
const STORE_KEY = 'gramsetu_data_v1';

// Seed mock data
const seedData = {
  meta: { createdAt: Date.now(), version: 1 },
  citizens: {
    complaints: [
      { id: 'GSAI-100001', category: 'Water', text: 'No water supply since 2 days in Ward 12', urgency: 'High', status: 'Validated', createdAt: Date.now()-86400000*2 },
      { id: 'GSAI-100002', category: 'Health', text: 'PHC lacks medicines', urgency: 'Medium', status: 'Assigned', createdAt: Date.now()-86400000*1.5 },
      { id: 'GSAI-100003', category: 'Electricity', text: 'Frequent power cuts during evening', urgency: 'Medium', status: 'Filed', createdAt: Date.now()-86400000*1.2 },
      { id: 'GSAI-100004', category: 'Roads', text: 'Potholes near school', urgency: 'High', status: 'Resolved', createdAt: Date.now()-86400000*3 },
      { id: 'GSAI-100005', category: 'Sanitation', text: 'Garbage not collected this week', urgency: 'Low', status: 'Audited', createdAt: Date.now()-86400000*7 },
    ]
  },
  field: {
    tasks: [
      { id: 'TASK-2001', title: 'Inspect water valve - Ward 12', dept: 'Water', status: 'Pending', coords: [12, 22], attachments: [] },
      { id: 'TASK-2002', title: 'Verify PHC medicine stock', dept: 'Health', status: 'Completed', coords: [66, 40], attachments: ['photo_1.jpg'] },
      { id: 'TASK-2003', title: 'Road pothole survey - School zone', dept: 'Roads', status: 'Pending', coords: [36, 72], attachments: [] },
      { id: 'TASK-2004', title: 'Transformer inspection', dept: 'Electricity', status: 'Verified', coords: [84, 64], attachments: ['video_1.mp4'] },
    ],
    lastSync: Date.now()-3600*1000
  },
  district: {
    officers: [
      { id: 'OFF-1', name: 'Officer Sharma', efficiency: 92 },
      { id: 'OFF-2', name: 'Officer Rao', efficiency: 88 },
      { id: 'OFF-3', name: 'Officer Khan', efficiency: 86 },
    ],
    departments: ['Water','Roads','Health','Electricity','Sanitation','Education'],
  },
  state: {
    integrity: Array.from({length: 60}, () => Math.floor(Math.random()*100)), // 10x6 grid
    lifecycleStats: { Filed: 25, Validated: 18, Assigned: 16, Resolved: 14, Audited: 10 },
    graphNodes: [
      { id: 'Water' }, { id: 'Health' }, { id: 'Roads' }, { id: 'Electricity' }, { id: 'Sanitation' }, { id: 'Education' }
    ],
    graphLinks: [
      ['Water','Health'], ['Water','Sanitation'], ['Roads','Electricity'], ['Education','Health'], ['Electricity','Water']
    ]
  },
  national: {
    states: [
      { code: 'MH', name: 'Maharashtra', integrity: 74 },
      { code: 'KA', name: 'Karnataka', integrity: 78 },
      { code: 'DL', name: 'Delhi', integrity: 70 },
      { code: 'WB', name: 'West Bengal', integrity: 67 },
      { code: 'GJ', name: 'Gujarat', integrity: 81 },
      { code: 'RJ', name: 'Rajasthan', integrity: 69 },
      { code: 'PB', name: 'Punjab', integrity: 73 },
      { code: 'UP', name: 'Uttar Pradesh', integrity: 65 },
      { code: 'TN', name: 'Tamil Nadu', integrity: 79 },
      { code: 'BR', name: 'Bihar', integrity: 61 },
    ],
    transparency: 76
  }
};

function loadData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(seedData));
    return JSON.parse(JSON.stringify(seedData));
  }
  try { return JSON.parse(raw); } catch { return JSON.parse(JSON.stringify(seedData)); }
}
function saveData(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
let db = loadData();

// Utils
const $ = sel => document.querySelector(sel);
const $on = (el, evt, fn) => el && el.addEventListener(evt, fn);
const fmtPct = n => `${Math.round(n)}%`;
const randId = (p='GSAI') => `${p}-${Math.floor(100000 + Math.random()*900000)}`;
const toast = (msg) => { const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(()=> t.classList.remove('show'), 1800); };

// Router
const routes = {
  '/': renderHome,
  '/citizen': renderCitizen,
  '/field': renderField,
  '/district': renderDistrict,
  '/state': renderState,
  '/national': renderNational,
};

function router() {
  const hash = location.hash.replace('#','') || '/';
  const view = routes[hash] || renderHome;
  const html = view();
  const app = $('#app');
  app.innerHTML = html;
  app.classList.add('fade-in');
  setTimeout(()=> app.classList.remove('fade-in'), 350);
  // Per-view mounts
  if (hash === '/citizen') mountCitizen();
  if (hash === '/field') mountField();
  if (hash === '/district') mountDistrict();
  if (hash === '/state') mountState();
  if (hash === '/national') mountNational();
  // FAB visible only on state
  const fab = $('#ai-fab');
  if (hash === '/state') fab.classList.remove('hide'); else fab.classList.add('hide');
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  router();
  const themeBtn = $('#themeToggle');
  $on(themeBtn, 'click', () => document.body.classList.toggle('light'));
  const fab = $('#ai-fab');
  $on(fab, 'click', toggleAIChat);
});

// HOME
function renderHome() {
  return `
    <section class="hero">
      <div class="card glass">
        <div class="row center" style="justify-content:space-between; gap:12px;">
          <div>
            <div class="hero-title">GramSetu AI – From Voice to Policy</div>
            <div class="hero-tag tagline">AI-powered governance for every voice of Bharat 🇮🇳</div>
          </div>
          <div class="ribbon small">National Governance Intelligence Network</div>
        </div>
      </div>
      <div class="grid home-cards">
        ${moduleCard('Citizen','Citizen interface for IVR + complaints','📣','citizen','linear-gradient(135deg, #ffb86b, #ff9a44)')}
        ${moduleCard('Field','Field tasks, GPS, uploads','🧭','field','linear-gradient(135deg, #42e695, #3bb2b8)')}
        ${moduleCard('District','Analytics, accountability','🏛️','district','linear-gradient(135deg, #84fab0, #8fd3f4)')}
        ${moduleCard('State','AI command center','🧠','state','linear-gradient(135deg, #a18cd1, #fbc2eb)')}
        ${moduleCard('National','Map + policy insights','🌐','national','linear-gradient(135deg, #89f7fe, #66a6ff)')}
      </div>
    </section>
  `;
}
function moduleCard(title, sub, emoji, route, bg) {
  return `
    <div class="card clickable" style="background:${bg}; color:#0b1220;" onclick="location.hash='/${route}'">
      <div class="card-title" style="font-size:18px; display:flex; align-items:center; gap:8px;">${emoji} ${title}</div>
      <div class="card-sub" style="color:#0b1220; opacity:0.8;">${sub}</div>
    </div>
  `;
}

// CITIZEN
function renderCitizen() {
  const stages = ['Filed','Validated','Assigned','Resolved','Audited'];
  const latest = db.citizens.complaints[db.citizens.complaints.length-1] || { status: 'Filed' };
  const activeIdx = stages.indexOf(latest.status);
  const pct = ((activeIdx) / (stages.length-1)) * 100;
  return `
    <div class="grid grid-2">
      <div class="card glass">
        <div class="card-title">🎙️ Voice Complaint Simulation</div>
        <div class="row">
          <div style="flex:1; min-width:220px;">
            <label>Category</label>
            <select id="c-category">
              <option>Water</option>
              <option>Health</option>
              <option>Electricity</option>
              <option>Roads</option>
              <option>Sanitation</option>
              <option>Education</option>
            </select>
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button id="micBtn" class="btn" title="Simulate voice input">🎤 Speak</button>
          </div>
        </div>
        <div style="margin-top:10px;">
          <label>Type complaint or speak</label>
          <textarea id="c-text" rows="4" placeholder="Describe your issue..."></textarea>
        </div>
        <div class="row" style="margin-top:12px;">
          <button id="c-submit" class="btn primary">Submit Complaint</button>
          <button id="c-clear" class="btn" title="Clear form">Reset</button>
        </div>
      </div>

      <div class="card glass">
        <div class="card-title">🧠 AI Complaint Classifier</div>
        <div id="ai-pred" class="row" style="gap:16px; margin-top:6px; align-items:center;">
          ${fakeClassifierBox('Detected Type','—')}
          ${fakeClassifierBox('Urgency','—')}
          ${fakeClassifierBox('Confidence','—')}
        </div>
        <div style="margin-top:16px;">
          <div class="card-sub">Status tracking</div>
          <div class="progress" style="margin-top:8px;">
            ${stages.map((s,i)=>`<div class="dot ${i<=activeIdx?'active':''}"></div>`).join('<div class=\"bar\"><span style=\"width:${pct}%\"></span></div>')}
          </div>
          <div class="small" style="margin-top:6px;">Latest: <strong>${latest.id||'—'}</strong> · <span>${latest.status}</span></div>
        </div>
      </div>

      <div class="card glass" style="grid-column: 1 / -1;">
        <div class="card-title">Recent Complaints</div>
        <div class="grid grid-3" id="complaints-list" style="margin-top:8px;"></div>
      </div>
    </div>
    <div id="c-popup" style="position:fixed; inset:0; display:none; align-items:center; justify-content:center;">
      <div class="card glass" style="background: rgba(16, 24, 40, 0.95); text-align:center; padding:24px;">
        <div style="font-size:20px; font-weight:800;">✅ Complaint Received</div>
        <div id="c-popup-id" style="margin-top:6px;">ID: —</div>
        <div class="small" style="margin-top:10px;">We will validate and route your complaint.</div>
        <button id="c-popup-close" class="btn green" style="margin-top:14px;">Close</button>
      </div>
    </div>
  `;
}
function fakeClassifierBox(title, val) {
  return `<div class="card" style="flex:1; min-width: 180px; text-align:center;">
    <div class="small">${title}</div>
    <div style="font-weight:800; font-size:18px;">${val}</div>
  </div>`
}
function mountCitizen() {
  const list = $('#complaints-list');
  const items = db.citizens.complaints.slice(-6).reverse().map(c => `
    <div class="card">
      <div class="small">${c.id}</div>
      <div style="font-weight:700;">${c.category}</div>
      <div class="small" style="margin-top:6px; opacity:0.9;">${c.text}</div>
      <div class="row" style="margin-top:10px; gap:8px; align-items:center;">
        <span class="badge">Urgency: ${c.urgency}</span>
        <span class="badge">Status: ${c.status}</span>
      </div>
    </div>
  `).join('');
  list.innerHTML = items || '<div class="small">No complaints yet.</div>';

  const micBtn = $('#micBtn');
  $on(micBtn, 'click', () => {
    const ex = [
      'Water pipeline leakage near market',
      'PHC doctor absent last two days',
      'Transformer buzzing and power outages at night',
      'Big potholes on main road towards station',
      'Garbage pile-up near temple street'
    ];
    $('#c-text').value = ex[Math.floor(Math.random()*ex.length)];
    toast('Voice captured (mock)');
    runClassifier();
  });

  $on($('#c-text'), 'input', runClassifier);
  $on($('#c-category'), 'change', runClassifier);

  $on($('#c-clear'), 'click', ()=> { $('#c-text').value = ''; runClassifier(true); });

  $on($('#c-submit'), 'click', () => {
    const cat = $('#c-category').value;
    const text = ($('#c-text').value || '').trim();
    if (!text) { toast('Please type your complaint.'); return; }
    const { urgency, confidence } = classify(cat, text);
    const id = randId('GSAI');
    const rec = { id, category: cat, text, urgency, status: 'Filed', createdAt: Date.now() };
    db.citizens.complaints.push(rec);
    saveData(db);
    $('#c-popup-id').textContent = `ID: ${id}`;
    $('#c-popup').style.display = 'flex';
    router();
  });
  $on($('#c-popup-close'), 'click', ()=> $('#c-popup').style.display = 'none');

  function runClassifier(clear=false) {
    if (clear) { setPred('—','—','—'); return; }
    const cat = $('#c-category').value;
    const text = ($('#c-text').value || '').toLowerCase();
    const { urgency, confidence, type } = classify(cat, text);
    setPred(type, urgency, `${confidence}%`);
  }
  function setPred(type, urg, conf) {
    const boxes = $('#ai-pred').querySelectorAll('.card');
    boxes[0].querySelector('div:nth-child(2)').textContent = type;
    boxes[1].querySelector('div:nth-child(2)').textContent = urg;
    boxes[2].querySelector('div:nth-child(2)').textContent = conf;
  }
}
function classify(cat, text) {
  let urgency = 'Medium', confidence = 86, type = cat;
  if (/no water|leak|dry|pipeline|supply/.test(text)) { type = 'Water'; urgency = 'High'; confidence = 93; }
  if (/power|electric|transformer|lights|cut/.test(text)) { type = 'Electricity'; urgency = 'High'; confidence = 90; }
  if (/doctor|phc|medicine|health|hospital/.test(text)) { type = 'Health'; urgency = 'Medium'; confidence = 88; }
  if (/pothole|road|traffic|footpath/.test(text)) { type = 'Roads'; urgency = 'Medium'; confidence = 85; }
  if (/garbage|waste|clean|sanitation|drain/.test(text)) { type = 'Sanitation'; urgency = 'Low'; confidence = 82; }
  return { urgency, confidence, type };
}

// FIELD
function renderField() {
  const pending = db.field.tasks.filter(t => t.status==='Pending').length;
  const completed = db.field.tasks.filter(t => t.status==='Completed').length;
  const verified = db.field.tasks.filter(t => t.status==='Verified').length;
  return `
    <div class="grid grid-3">
      <div class="card glass">
        <div class="card-title">🗂️ Assigned Tasks</div>
        <div id="tasks" class="grid" style="margin-top:8px;"></div>
      </div>
      <div class="card glass">
        <div class="card-title">📍 GPS Location</div>
        <div class="mini-map" id="mini-map">
          <div class="grid"></div>
          <div class="dot" id="gps-dot" style="left: 12%; top: 16%;"></div>
        </div>
        <div class="row" style="margin-top:10px;">
          <button id="syncBtn" class="btn green">Sync Now</button>
          <span class="small">Last sync: ${new Date(db.field.lastSync).toLocaleString()}</span>
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">📷 Upload Evidence</div>
        <div class="row" style="margin-top:8px;">
          <button class="btn">Upload Photo</button>
          <button class="btn">Upload Video</button>
        </div>
        <div class="small" style="margin-top:8px;">Uploads are mocked for demo.</div>
        <div class="grid" id="uploads" style="margin-top:10px;"></div>
      </div>

      <div class="card glass" style="grid-column: 1 / -1;">
        <div class="row" style="gap:16px;">
          <div class="badge">Pending: ${pending}</div>
          <div class="badge">Completed: ${completed}</div>
          <div class="badge">Verified: ${verified}</div>
        </div>
      </div>
    </div>
  `;
}
function mountField() {
  const tasksC = $('#tasks');
  tasksC.innerHTML = db.field.tasks.map(t => `
    <div class="card">
      <div class="small">${t.id} · ${t.dept}</div>
      <div style="font-weight:700;">${t.title}</div>
      <div class="row" style="margin-top:8px; align-items:center;">
        <span class="badge">Status: ${t.status}</span>
        ${t.status==='Pending' ? `<button class='btn green' data-action='complete' data-id='${t.id}'>Mark Completed</button>`:''}
        ${t.status==='Completed' ? `<button class='btn' data-action='verify' data-id='${t.id}'>Mark Verified</button>`:''}
      </div>
    </div>
  `).join('');

  tasksC.querySelectorAll('button[data-action]').forEach(btn => {
    $on(btn, 'click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const task = db.field.tasks.find(x=>x.id===id);
      if (task) {
        task.status = action==='complete' ? 'Completed' : 'Verified';
        saveData(db);
        toast(`Task ${task.id} → ${task.status}`);
        router();
      }
    });
  });

  const map = $('#mini-map');
  const dot = $('#gps-dot');
  let t = 0;
  const move = () => {
    t += 1; const x = (Math.sin(t/10)*40)+50; const y = (Math.cos(t/13)*30)+50;
    dot.style.left = `${x}%`; dot.style.top = `${y}%`;
    dot.style.transition = 'left .6s ease, top .6s ease';
  };
  const anim = setInterval(move, 900);
  $on(map, 'mouseenter', ()=>move());

  $on($('#syncBtn'), 'click', () => {
    map.style.outline = '2px solid #15c27a';
    setTimeout(()=> map.style.outline = 'none', 800);
    db.field.lastSync = Date.now();
    saveData(db);
    toast('Synced successfully');
    router();
  });

  const uploads = $('#uploads');
  const files = db.field.tasks.flatMap(t=>t.attachments.map(a=>({task: t.id, name:a})));
  uploads.innerHTML = files.length ? files.map(f=>`<div class='badge'>${f.task}: ${f.name}</div>`).join('') : '<div class="small">No uploads yet.</div>';
}

// DISTRICT
function renderDistrict() {
  const total = db.citizens.complaints.length;
  const resolved = db.citizens.complaints.filter(c=>c.status==='Resolved' || c.status==='Audited').length;
  const escalations = Math.max(0, Math.floor(total*0.08) - 1);
  const pct = total ? (resolved/total)*100 : 0;
  return `
    <div class="grid grid-3">
      <div class="card glass">
        <div class="card-title">📊 District Analytics</div>
        <div class="grid grid-3" style="margin-top:8px;">
          <div class="card">
            <div class="kpi">${total}</div>
            <div class="kpi-sub">Total Complaints</div>
          </div>
          <div class="card">
            <div class="kpi">${fmtPct(pct)}</div>
            <div class="kpi-sub">Resolved %</div>
          </div>
          <div class="card">
            <div class="kpi">${escalations}</div>
            <div class="kpi-sub">Escalations</div>
          </div>
        </div>
        <div class="chart" style="margin-top:12px;">
          <canvas id="deptChart" width="600" height="220"></canvas>
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">🧑🏽‍💼 Officer Accountability</div>
        <div class="grid" style="margin-top:8px;">
          ${db.district.officers.map(o=>`<div class='card'><div style='font-weight:700;'>${o.name}</div><div class='small'>Efficiency</div><div class='kpi'>${o.efficiency}%</div></div>`).join('')}
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">⚠️ Auto-Escalation</div>
        <div class="badge" style="margin-top:8px;">No update in 72 hours → Auto alert sent to higher officer.</div>
        <div class="small" style="margin-top:8px;">Automation ensures time-bound service delivery.</div>
      </div>
    </div>
  `;
}
function mountDistrict() {
  const cvs = $('#deptChart');
  const ctx = cvs.getContext('2d');
  const deps = db.district.departments;
  const counts = deps.map(d => db.citizens.complaints.filter(c=>c.category===d).length + Math.floor(Math.random()*6));
  // simple bar chart
  const W = cvs.width, H = cvs.height, pad = 30; const max = Math.max(...counts) || 1;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(0,0,W,H);
  counts.forEach((v,i)=>{
    const x = pad + i*((W-2*pad)/counts.length);
    const bw = (W-2*pad)/counts.length - 14;
    const h = (v/max)*(H-2*pad);
    const y = H - pad - h;
    const grad = ctx.createLinearGradient(0,y,0,y+h);
    grad.addColorStop(0, '#1e88e5'); grad.addColorStop(1, '#42a5f5');
    ctx.fillStyle = grad; ctx.fillRect(x,y,bw,h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '12px Inter'; ctx.fillText(deps[i], x, H-10);
  });
}

// STATE
function renderState() {
  const s = db.state;
  return `
    <div class="grid grid-2">
      <div class="card glass">
        <div class="card-title">🟩 Integrity Heatmap</div>
        <div class="heat-grid" id="heat-grid" style="margin-top:8px;"></div>
      </div>
      <div class="card glass">
        <div class="card-title">⏱️ Complaint Lifecycle Tracker</div>
        <div class="timeline" id="timeline" style="margin-top:8px;"></div>
      </div>
      <div class="card glass">
        <div class="card-title">🔗 Cross-Department Graph</div>
        <div class="graph" id="graph"></div>
      </div>
      <div class="card glass">
        <div class="card-title">💬 Governance GPT Assistant</div>
        <div id="chat" style="height: 200px; overflow:auto; border:1px solid var(--border); border-radius:12px; padding:10px; background: rgba(255,255,255,0.06);"></div>
        <div class="row" style="margin-top:8px;">
          <input class="input" id="chat-input" placeholder="Ask about corruption trends…" />
          <button id="chat-send" class="btn primary">Ask</button>
        </div>
      </div>
    </div>
  `;
}
function mountState() {
  // heatmap
  const grid = $('#heat-grid');
  grid.innerHTML = db.state.integrity.map(v=>{
    const col = v>75 ? 'rgba(21,194,122,0.9)' : v>50 ? 'rgba(242,178,27,0.9)' : 'rgba(239,68,68,0.9)';
    return `<div class='heat-cell' style='background:${col}'><span>${v}</span></div>`;
  }).join('');

  // lifecycle timeline
  const stages = ['Filed','Validated','Assigned','Resolved','Audited'];
  const tl = $('#timeline');
  const stats = db.state.lifecycleStats;
  tl.innerHTML = stages.map((s,i)=>`<div class='stage ${i<=3?'active':''}'>${s}: ${stats[s]||0}</div>`).join('');

  // mock graph
  const g = $('#graph');
  const W = g.clientWidth, H = g.clientHeight; const cx=W/2, cy=H/2, R=Math.min(W,H)/2-40;
  const nodes = db.state.graphNodes.map((n, i, a)=>({ id:n.id, x: cx + Math.cos((i/a.length)*Math.PI*2)*R, y: cy + Math.sin((i/a.length)*Math.PI*2)*R }));
  g.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${W} ${H}">
    ${db.state.graphLinks.map(([a,b])=>{
      const A = nodes.find(n=>n.id===a), B = nodes.find(n=>n.id===b);
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" />`;
    }).join('')}
    ${nodes.map(n=>`<g><circle cx="${n.x}" cy="${n.y}" r="18" fill="#1e88e5" /><text x="${n.x}" y="${n.y+4}" text-anchor="middle" font-size="10" fill="#fff">${n.id}</text></g>`).join('')}
  </svg>`;

  // chat
  const chat = $('#chat');
  const send = () => {
    const input = $('#chat-input');
    const q = (input.value||'').trim(); if (!q) return; input.value='';
    pushMsg('You', q);
    setTimeout(()=> pushMsg('Assistant', generateInsight(q)), 500);
  };
  $on($('#chat-send'), 'click', send);
  $on($('#chat-input'), 'keydown', (e)=>{ if(e.key==='Enter') send(); });
  pushMsg('Assistant','Namaste. Ask me about department performance, integrity trends, or escalations.');

  function pushMsg(who, text){
    const row = document.createElement('div');
    row.className = 'row'; row.style.marginTop='6px'; row.innerHTML = `<div class='badge'>${who}</div><div style='padding:6px 10px; background: rgba(255,255,255,0.06); border-radius:12px; border:1px solid var(--border);'>${text}</div>`;
    chat.appendChild(row); chat.scrollTop = chat.scrollHeight;
  }
}
function toggleAIChat(){ location.hash = '#/state'; toast('Opening Governance GPT'); }
function generateInsight(q){
  q = q.toLowerCase();
  if (q.includes('corruption') || q.includes('integrity')) return 'Integrity is improving in southern districts. Focus audits on procurement in utilities.';
  if (q.includes('water')) return 'High urgency water complaints from 3 districts. Recommend rapid valve inspections and tanker support.';
  if (q.includes('health')) return 'Medicine stockouts correlated with delayed purchase orders. Suggest e-procurement alerts.';
  if (q.includes('escalation')) return '72-hour SLA breaches declining 8% WoW after automated reminders.';
  return 'Key insight: Cross-department coordination improves resolution by 14%. Consider weekly sync between Water and Sanitation.';
}

// NATIONAL
function renderNational() {
  const avg = Math.round(db.national.states.reduce((a,s)=>a+s.integrity,0)/db.national.states.length);
  return `
    <div class="grid grid-2">
      <div class="card glass">
        <div class="card-title">🗺️ India Map (Mock)</div>
        <div style="height:280px; border-radius:14px; border:1px solid var(--border); background: linear-gradient(180deg, #122038, #0e192c); position:relative; overflow:hidden;">
          ${indiaBlobSVG()}
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">📈 Real-time Metrics</div>
        <div class="grid grid-3" style="margin-top:8px;">
          ${db.national.states.slice(0,6).map(s=>`<div class='card'><div class='small'>${s.name}</div><div class='kpi'>${s.integrity}</div><div class='kpi-sub'>Integrity Index</div></div>`).join('')}
        </div>
        <div class="row" style="margin-top:12px; align-items:center; gap:12px;">
          <div class="badge">National Transparency Score: <strong style="margin-left:6px;">${db.national.transparency}</strong></div>
          <div class="badge">Avg Integrity: <strong style="margin-left:6px;">${avg}</strong></div>
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">🧩 AI Policy Recommender</div>
        <div class="grid" style="margin-top:8px;">
          ${["Focus reforms on rural water infrastructure.","Digitize grievance redressal at district HQs.","Publish officer scorecards monthly.","Deploy mobile PHC units in low-access blocks."]
            .map(t=>`<div class='badge'>${t}</div>`).join('')}
        </div>
      </div>
      <div class="card glass">
        <div class="card-title">✅ Ethical AI</div>
        <div class="badge">Privacy-first · Transparent · Fair · Accountable</div>
        <div class="small" style="margin-top:8px;">This demo uses mock data. No personal data is processed.</div>
      </div>
    </div>
  `;
}
function mountNational() {}
function indiaBlobSVG(){
  // Abstract blob as placeholder for India map silhouette
  return `<svg viewBox="0 0 600 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="position:absolute; inset:0;">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#66a6ff" />
        <stop offset="100%" stop-color="#89f7fe" />
      </linearGradient>
    </defs>
    <g opacity="0.85">
      <path d="M170,220 C120,200 90,170 80,140 C70,110 90,80 130,70 C170,60 200,40 230,50 C260,60 290,90 320,90 C350,90 380,70 410,80 C440,90 450,130 440,160 C430,190 400,210 360,220 C320,230 280,240 240,240 C210,240 200,230 170,220 Z" fill="url(#g)"/>
      <circle cx="310" cy="115" r="4" fill="#ffea00" />
    </g>
  </svg>`;
}

// NAVIGATION STATE UTILS
function setHash(route){ location.hash = `#/${route}`; }

// DISTRICT helper used above; nothing to mount for national map

// INIT hash default
if (!location.hash) location.hash = '#/';
