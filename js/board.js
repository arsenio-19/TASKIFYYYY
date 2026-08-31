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
  board.style.gridTemplateColumns = `repeat(${visibleDays}, minmax(240px,1fr))`;
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
    col.className = 'flex flex-col gap-3 min-w-0';

    const head = document.createElement('div');
    head.className = 'flex items-center justify-between px-0.5';
    head.innerHTML = `
      <span class="font-bold text-sm text-slate-900">${dayLabel(date)} <span class="text-slate-400 font-medium">· ${date.getDate()} ${date.toLocaleDateString('en-US',{month:'short'})}</span></span>
      <span class="bg-sky-100 text-sky-700 text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5">${dayTasks.length}</span>`;
    col.appendChild(head);

    if (dayTasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-slate-300 text-xs text-center py-4 px-2 border border-dashed border-slate-200 rounded-2xl';
      empty.textContent = 'No tasks yet for this day.';
      col.appendChild(empty);
    }

    dayTasks.forEach(t => col.appendChild(renderTaskCard(t)));

    const addBtn = document.createElement('button');
    addBtn.className = 'border-[1.5px] border-dashed border-sky-300 rounded-2xl p-3 text-sky-600 font-semibold text-sm flex items-center gap-1.5 justify-start hover:bg-sky-100 transition';
    addBtn.innerHTML = `<span class="text-base leading-none">+</span> Add New Task`;
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
  card.className = `rounded-2xl p-3.5 flex gap-2.5 cursor-pointer transition shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${t.done ? 'bg-sky-200 border-sky-300' : 'bg-white border-slate-100'}`;

  card.innerHTML = `
    <div class="checkbox w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${t.done ? 'bg-sky-600 border-sky-600' : 'border-sky-400'}">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" class="${t.done ? 'opacity-100' : 'opacity-0'}"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-bold text-sm mb-0.5 ${t.done ? 'text-slate-500 line-through decoration-sky-500' : 'text-slate-900'}">${escapeHtml(t.title)}</div>
      ${t.desc ? `<div class="text-[13px] leading-snug mb-2 line-clamp-2 ${t.done ? 'text-slate-400' : 'text-slate-500'}">${escapeHtml(t.desc)}</div>` : ''}
      <div class="flex items-center gap-2.5 flex-wrap">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold" style="color:${cat.color}"><span class="w-1.5 h-1.5 rounded-full" style="background:${cat.color}"></span>${cat.label}</span>
        ${t.time ? `<span class="text-xs text-slate-500 flex items-center gap-1">🕐 ${formatTime(t.time)}</span>` : ''}
      </div>
    </div>`;

  card.querySelector('.checkbox').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDone(t.id);
  });
  card.addEventListener('click', () => openTaskModal(t.id));
  return card;
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
