/* ============================================================
   STATE — variabel global aplikasi & helper tanggal
   ============================================================ */
let session = loadSession();
let dayWindowStart = startOfToday();
let visibleDays = 4;
let calendarCursor = new Date();
let editingTaskId = null;
let sidebarCollapsed = false;

function startOfToday(){ const d = new Date(); d.setHours(0,0,0,0); return d; }
function iso(d){ return d.toISOString().slice(0,10); }
function addDays(d, n){ const r = new Date(d); r.setDate(r.getDate()+n); return r; }
