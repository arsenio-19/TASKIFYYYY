/* ============================================================
   TASK MODAL — tambah, edit, hapus task
   ============================================================ */
function buildCategoryPicker(selected){
  const wrap = $('#categoryPicker');
  wrap.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    const isActive = cat.id === selected;
    chip.className = `cat-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${isActive ? 'bg-sky-50' : 'border-slate-200'}`;
    chip.style.color = cat.color;
    chip.style.borderColor = isActive ? cat.color : '';
    chip.dataset.cat = cat.id;
    chip.innerHTML = `<span class="w-2 h-2 rounded-full" style="background:${cat.color}"></span>${cat.label}`;
    chip.addEventListener('click', () => {
      $$('.cat-chip').forEach(c => { c.classList.remove('bg-sky-50'); c.classList.add('border-slate-200'); c.style.borderColor = ''; });
      chip.classList.remove('border-slate-200');
      chip.classList.add('bg-sky-50');
      chip.style.borderColor = cat.color;
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
  const activeCat = $('.cat-chip.bg-sky-50');
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
