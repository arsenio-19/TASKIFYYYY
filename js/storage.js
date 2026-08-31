/* ============================================================
   STORAGE — semua akses localStorage (data layer / "backend" lokal)
   ============================================================ */
const STORE_KEYS = { users: 'taskify_users', session: 'taskify_session', tasks: 'taskify_tasks' };
const DEMO_ACCOUNT = { name: 'Demo User', email: 'demo@taskify.com', password: 'taskify123' };

const CATEGORIES = [
  { id: 'work',     label: 'Work',     color: '#2E86D8' },
  { id: 'study',    label: 'Study',    color: '#7C5CE0' },
  { id: 'personal', label: 'Personal', color: '#1FB6A6' },
  { id: 'creative', label: 'Creative', color: '#E4694F' },
  { id: 'health',   label: 'Health',   color: '#33A867' },
];

/* ---------------- storage helpers ---------------- */
function loadUsers(){ return JSON.parse(localStorage.getItem(STORE_KEYS.users) || '[]'); }
function saveUsers(u){ localStorage.setItem(STORE_KEYS.users, JSON.stringify(u)); }
function loadSession(){ return JSON.parse(localStorage.getItem(STORE_KEYS.session) || 'null'); }
function saveSession(s){ localStorage.setItem(STORE_KEYS.session, JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem(STORE_KEYS.session); }
function loadTasks(){ return JSON.parse(localStorage.getItem(STORE_KEYS.tasks) || '[]'); }
function saveTasks(t){ localStorage.setItem(STORE_KEYS.tasks, JSON.stringify(t)); }

function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }

function ensureDemoUser(){
  const users = loadUsers();
  if (!users.some(u => u.email === DEMO_ACCOUNT.email)) {
    users.push({ id: uid(), ...DEMO_ACCOUNT });
    saveUsers(users);
  }
}

function seedIfEmpty(){
  if (loadTasks().length) return;
  const today = startOfToday();
  const iso_ = (d) => iso(d);
  const back = (n) => addDays(today, -n);

  const demo = [
    // dua contoh task dari sebelum hari ini, biar hari lampau gak kosong pas di-scroll
    { id: uid(), title: 'Reflect & recharge', desc: 'Review the day and slow things down before logging off.', date: iso_(back(1)), time: '21:00', category: 'personal', done: true },
    { id: uid(), title: 'Grocery run', desc: 'Stock up on essentials for the week ahead.', date: iso_(back(2)), time: '10:00', category: 'personal', done: true },
    // rencana hari ini
    { id: uid(), title: 'Morning coffee & planning', desc: 'Sketch out the priorities for today before diving in.', date: iso_(today), time: '09:30', category: 'personal', done: false },
    { id: uid(), title: 'Design task dashboard', desc: 'Collaborating on a dashboard layout with teammates.', date: iso_(today), time: '', category: 'work', done: false },
  ];
  saveTasks(demo);
}

function clearTasks() {
  localStorage.removeItem(STORE_KEYS.tasks);
}