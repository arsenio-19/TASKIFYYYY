/* ============================================================
   TASKIFY — front-end demo app
   All data is stored locally in the browser (localStorage).
   Login is a mock/demo auth flow — no real server involved.
   ============================================================ */

const STORE_KEYS = { users: 'taskify_users', session: 'taskify_session', tasks: 'taskify_tasks' };

const CATEGORIES = [
  { id: 'work',     label: 'Work',     color: '#2E86D8' },
  { id: 'study',    label: 'Study',    color: '#7C5CE0' },
  { id: 'personal', label: 'Personal', color: '#1FB6A6' },
  { id: 'creative', label: 'Creative', color: '#E4694F' },
  { id: 'health',   label: 'Health',   color: '#33A867' },
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------------- storage helpers ---------------- */
function loadUsers(){ return JSON.parse(localStorage.getItem(STORE_KEYS.users) || '[]'); }
function saveUsers(u){ localStorage.setItem(STORE_KEYS.users, JSON.stringify(u)); }
function loadSession(){ return JSON.parse(localStorage.getItem(STORE_KEYS.session) || 'null'); }
function saveSession(s){ localStorage.setItem(STORE_KEYS.session, JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem(STORE_KEYS.session); }
function loadTasks(){ return JSON.parse(localStorage.getItem(STORE_KEYS.tasks) || '[]'); }
function saveTasks(t){ localStorage.setItem(STORE_KEYS.tasks, JSON.stringify(t)); }

function seedIfEmpty(){
  if (loadTasks().length) return;
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0,10);
  const plus = (n) => { const d = new Date(today); d.setDate(d.getDate()+n); return d; };
  const demo = [
    { id: uid(), title: 'Design task dashboard', desc: 'Collaborating on a dashboard layout with teammates.', date: iso(today), time: '', category: 'work', done: false },
    { id: uid(), title: 'Morning coffee & planning', desc: 'Sketch out the priorities for today before diving in.', date: iso(today), time: '09:30', category: 'personal', done: false },
    { id: uid(), title: 'Review pull requests', desc: 'Quick pass on the team\'s open pull requests.', date: iso(plus(1)), time: '', category: 'work', done: false },
    { id: uid(), title: 'Study session', desc: 'Refresh a few key topics for 30 minutes.', date: iso(plus(1)), time: '19:00', category: 'study', done: true },
    { id: uid(), title: 'Creative time', desc: "Do something just because it's fun, not because it's useful.", date: iso(plus(2)), time: '16:00', category: 'creative', done: false },
    { id: uid(), title: 'Evening walk', desc: 'Light movement to reset before the next day.', date: iso(plus(3)), time: '18:00', category: 'health', done: false },
  ];
  saveTasks(demo);
}

function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }

/* ---------------- state ---------------- */
let session = loadSession();
let dayWindowStart = startOfToday();
let visibleDays = 4;
let calendarCursor = new Date();
let editingTaskId = null;
let sidebarCollapsed = false;

function startOfToday(){ const d = new Date(); d.setHours(0,0,0,0); return d; }
function iso(d){ return d.toISOString().slice(0,10); }
function addDays(d, n){ const r = new Date(d); r.setDate(r.getDate()+n); return r; }

/* ============================================================
   AUTH VIEW
   ============================================================ */
let authMode = 'login'; // 'login' | 'signup'

function renderAuthMode(){
  const isSignup = authMode === 'signup';
  $('#authTitle').textContent = isSignup ? 'Create your account' : 'Welcome Back!';
  $('#authSubtitle').textContent = isSignup ? 'Start planning with Taskify' : 'Enter your details below';
  $('#nameField').classList.toggle('hidden', !isSignup);
  $('#authName').required = isSignup;
  $('.btn-primary.full').textContent = isSignup ? 'Sign up' : 'Log in';
  $('#switchText').textContent = isSignup ? 'Already have an account?' : "Don't have an account?";
  $('#switchAuthLink').textContent = isSignup ? 'Log in' : 'Sign Up';
}

$('#switchAuthLink').addEventListener('click', (e) => {
  e.preventDefault();
  authMode = authMode === 'login' ? 'signup' : 'login';
  renderAuthMode();
});

$('#togglePw').addEventListener('click', () => {
  const input = $('#authPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
});

$('#authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#authEmail').value.trim().toLowerCase();
  const password = $('#authPassword').value;
  const users = loadUsers();

  if (authMode === 'signup') {
    const name = $('#authName').value.trim() || email.split('@')[0];
    if (users.some(u => u.email === email)) {
      showToast('An account with that email already exists — log in instead.');
      authMode = 'login'; renderAuthMode();
      return;
    }
    const user = { id: uid(), name, email, password };
    users.push(user); saveUsers(users);
    logIn(user);
    showToast(`Welcome to Taskify, ${name}!`);
  } else {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      showToast('No matching account found. Try signing up first.');
      return;
    }
    logIn(user);
    showToast(`Welcome back, ${user.name}!`);
  }
});

$('#continueGuest').addEventListener('click', () => {
  showApp();
});

function logIn(user){
  session = { id: user.id, name: user.name, email: user.email };
  saveSession(session);
  showApp();
}

function logOut(){
  session = null;
  clearSession();
  updateAuthUI();
  showToast('Logged out.');
}

function showApp(){
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  updateAuthUI();
  renderAll();
}

function showLogin(mode){
  authMode = mode || 'login';
  renderAuthMode();
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
}

function updateAuthUI(){
  const loggedIn = !!session;
  const initials = loggedIn ? session.name.trim().slice(0,1) : '?';

  $('#sidebarAvatar').textContent = initials;
  $('#sidebarUserName').textContent = loggedIn ? session.name : 'Guest';
  $('#sidebarAuthAction').textContent = loggedIn ? 'Log out' : 'Log in';
  $('#sidebarAuthAction').onclick = (e) => { e.preventDefault(); loggedIn ? logOut() : showLogin('login'); };

  const topbarAuth = $('#topbarAuth');
  if (loggedIn) {
    topbarAuth.innerHTML = `
      <div class="topbar-user">
        <div class="avatar">${initials}</div>
        <span>${session.name}</span>
        <a href="#" class="logout" id="topLogoutBtn">Log out</a>
      </div>`;
    $('#topLogoutBtn').addEventListener('click', (e) => { e.preventDefault(); logOut(); });
  } else {
    topbarAuth.innerHTML = `<button class="btn-outline" id="topLoginBtn">Log in</button>`;
    $('#topLoginBtn').addEventListener('click', () => showLogin('login'));
  }
}

/* ============================================================
   SIDEBAR
   ============================================================ */
$('#sidebarToggle').addEventListener('click', () => {
  sidebarCollapsed = !sidebarCollapsed;
  $('#sidebar').classList.toggle('collapsed', sidebarCollapsed);
});

$('#mobileSidebarToggle').addEventListener('click', () => {
  $('#sidebar').classList.toggle('mobile-open');
});

$('#newPlanBtn').addEventListener('click', () => {
  if (!session) { showToast('Log in to create a new plan.'); showLogin('login'); return; }
  openTaskModal();
});

/* ---------------- mini calendar ---------------- */
function renderMiniCalendar(){
  const y = calendarCursor.getFullYear();
  const m = calendarCursor.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  $('#mcMonthLabel').textContent = `${monthNames[m]} ${y}`;

  const grid = $('#mcGrid');
  grid.innerHTML = '';
  const firstDay = new Date(y, m, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  const tasksByDate = new Set(loadTasks().map(t => t.date));
  const todayIso = iso(startOfToday());
  const selectedIso = iso(dayWindowStart);

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, muted: true, m: m-1 });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false, m });
  while (cells.length % 7 !== 0 || cells.length < 42) cells.push({ day: cells.length - startOffset - daysInMonth + 1, muted: true, m: m+1 });

  cells.forEach(c => {
    const cellDate = new Date(y, c.m, c.day);
    const cellIso = iso(cellDate);
    const el = document.createElement('div');
    el.className = 'mc-day' + (c.muted ? ' muted' : '') + (cellIso === todayIso ? ' today' : '') + (cellIso === selectedIso ? ' selected' : '') + (tasksByDate.has(cellIso) ? ' has-task' : '');
    el.textContent = c.day;
    el.addEventListener('click', () => {
      dayWindowStart = cellDate;
      calendarCursor = cellDate;
      renderMiniCalendar();
      renderBoard();
    });
    grid.appendChild(el);
  });
}

$('#mcPrev').addEventListener('click', () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderMiniCalendar();
});
$('#mcNext').addEventListener('click', () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderMiniCalendar();
});

/* ============================================================
   DAY COLUMNS / BOARD
   ============================================================ */
function dayLabel(date){
  const t0 = startOfToday();
  const diffDays = Math.round((new Date(date.getFullYear(),date.getMonth(),date.getDate()) - t0) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function renderBoard(){
  const board = $('#board');
  board.style.setProperty('--cols', visibleDays);
  board.innerHTML = '';
  const tasks = loadTasks();
  const query = $('#searchInput').value.trim().toLowerCase();

  for (let i = 0; i < visibleDays; i++) {
    const date = addDays(dayWindowStart, i);
    const dIso = iso(date);
    let dayTasks = tasks.filter(t => t.date === dIso);
    if (query) dayTasks = dayTasks.filter(t => (t.title + ' ' + t.desc).toLowerCase().includes(query));
    dayTasks.sort((a,b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

    const col = document.createElement('div');
    col.className = 'day-col';

    const head = document.createElement('div');
    head.className = 'day-head';
    head.innerHTML = `
      <span class="day-title">${dayLabel(date)} <span class="dim">· ${date.getDate()} ${date.toLocaleDateString('en-US',{month:'short'})}</span></span>
      <span class="day-count">${dayTasks.length}</span>`;
    col.appendChild(head);

    if (dayTasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks yet for this day.';
      col.appendChild(empty);
    }

    dayTasks.forEach(t => col.appendChild(renderTaskCard(t)));

    const addBtn = document.createElement('button');
    addBtn.className = 'add-task-ghost';
    addBtn.innerHTML = `<span class="plus">+</span> Add New Task`;
    addBtn.addEventListener('click', () => {
      if (!session) { showToast('Log in to add a task.'); showLogin('login'); return; }
      openTaskModal(null, dIso);
    });
    col.appendChild(addBtn);

    board.appendChild(col);
  }
}

function renderTaskCard(t){
  const cat = CATEGORIES.find(c => c.id === t.category) || CATEGORIES[0];
  const card = document.createElement('div');
  card.className = 'task-card' + (t.done ? ' done' : '');
  card.innerHTML = `
    <div class="checkbox" role="checkbox" aria-checked="${t.done}">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="task-body">
      <div class="task-title">${escapeHtml(t.title)}</div>
      ${t.desc ? `<div class="task-desc">${escapeHtml(t.desc)}</div>` : ''}
      <div class="task-meta">
        <span class="task-tag" style="color:${cat.color}"><span class="dot" style="background:${cat.color}"></span>${cat.label}</span>
        ${t.time ? `<span class="task-time">🕐 ${formatTime(t.time)}</span>` : ''}
      </div>
    </div>`;

  card.querySelector('.checkbox').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDone(t.id);
  });
  card.addEventListener('click', () => openTaskModal(t.id));
  return card;
}

function formatTime(t){
  const [h,m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2,'0')} ${period}`;
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function toggleDone(id){
  const tasks = loadTasks();
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTasks(tasks);
  renderBoard();
  renderMiniCalendar();
}

$('#daysPrev').addEventListener('click', () => { dayWindowStart = addDays(dayWindowStart, -visibleDays); renderBoard(); });
$('#daysNext').addEventListener('click', () => { dayWindowStart = addDays(dayWindowStart, visibleDays); renderBoard(); });
$('#searchInput').addEventListener('input', renderBoard);

function adjustVisibleDays(){
  const w = window.innerWidth;
  visibleDays = w <= 720 ? 1 : w <= 980 ? 2 : 4;
  renderBoard();
}
window.addEventListener('resize', debounce(adjustVisibleDays, 150));
function debounce(fn, ms){ let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* ============================================================
   TASK MODAL
   ============================================================ */
function buildCategoryPicker(selected){
  const wrap = $('#categoryPicker');
  wrap.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'cat-chip' + (cat.id === selected ? ' active' : '');
    chip.style.color = cat.color;
    chip.dataset.cat = cat.id;
    chip.innerHTML = `<span class="dot" style="background:${cat.color}"></span>${cat.label}`;
    chip.addEventListener('click', () => {
      $$('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
    wrap.appendChild(chip);
  });
}

function openTaskModal(taskId, presetDate){
  editingTaskId = taskId || null;
  const tasks = loadTasks();
  const t = taskId ? tasks.find(x => x.id === taskId) : null;

  $('#modalTitle').textContent = t ? 'Edit Task' : 'New Task';
  $('#taskTitleInput').value = t ? t.title : '';
  $('#taskDescInput').value = t ? t.desc : '';
  $('#taskDateInput').value = t ? t.date : (presetDate || iso(dayWindowStart));
  $('#taskTimeInput').value = t ? t.time : '';
  buildCategoryPicker(t ? t.category : CATEGORIES[0].id);
  $('#deleteTaskBtn').classList.toggle('hidden', !t);

  $('#taskModalOverlay').classList.remove('hidden');
  setTimeout(() => $('#taskTitleInput').focus(), 50);
}

function closeTaskModal(){
  $('#taskModalOverlay').classList.add('hidden');
  editingTaskId = null;
}
$('#closeModal').addEventListener('click', closeTaskModal);
$('#taskModalOverlay').addEventListener('click', (e) => { if (e.target.id === 'taskModalOverlay') closeTaskModal(); });

$('#taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const activeCat = $('.cat-chip.active');
  const data = {
    title: $('#taskTitleInput').value.trim(),
    desc: $('#taskDescInput').value.trim(),
    date: $('#taskDateInput').value,
    time: $('#taskTimeInput').value,
    category: activeCat ? activeCat.dataset.cat : CATEGORIES[0].id,
  };
  if (!data.title || !data.date) return;

  const tasks = loadTasks();
  if (editingTaskId) {
    const t = tasks.find(x => x.id === editingTaskId);
    Object.assign(t, data);
    showToast('Task updated.');
  } else {
    tasks.push({ id: uid(), done: false, ...data });
    showToast('Task added.');
  }
  saveTasks(tasks);
  closeTaskModal();
  renderBoard();
  renderMiniCalendar();
});

$('#deleteTaskBtn').addEventListener('click', () => {
  if (!editingTaskId) return;
  const tasks = loadTasks().filter(t => t.id !== editingTaskId);
  saveTasks(tasks);
  showToast('Task deleted.');
  closeTaskModal();
  renderBoard();
  renderMiniCalendar();
});

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function showToast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}

/* ============================================================
   INIT
   ============================================================ */
function renderAll(){
  renderMiniCalendar();
  adjustVisibleDays();
  renderBoard();
}

(function init(){
  seedIfEmpty();
  renderAuthMode();
  if (session) {
    showApp();
  } else {
    showLogin('login');
  }
})();
