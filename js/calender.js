/* ============================================================
   MINI CALENDAR
   ============================================================ */
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
    const isToday = cellIso === todayIso;
    const isSelected = cellIso === selectedIso;
    const hasTask = tasksByDate.has(cellIso);

    const el = document.createElement('div');
    let cls = 'aspect-square flex items-center justify-center text-xs rounded-lg cursor-pointer relative select-none ';
    if (c.muted) cls += 'text-slate-300 ';
    else cls += 'text-slate-700 hover:bg-sky-200 ';
    if (isToday) cls += 'bg-sky-600 text-white font-bold hover:bg-sky-600 ';
    else if (isSelected) cls += 'bg-sky-200 font-bold ';
    el.className = cls;
    el.textContent = c.day;

    if (hasTask) {
      const dot = document.createElement('span');
      dot.className = `absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-sky-600'}`;
      el.appendChild(dot);
    }

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
