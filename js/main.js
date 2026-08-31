/* ============================================================
   TASKIFY — front-end demo app
   All data is stored locally in the browser (localStorage).
   Login is a mock/demo auth flow — no real server involved.
   ============================================================
   INIT — entry point, dijalankan terakhir setelah semua modul
   lain (storage, state, auth, sidebar, calendar, board, modal,
   toast) sudah dimuat.
   ============================================================ */
function renderAll(){
  renderMiniCalendar();
  adjustVisibleDays();
  renderBoard();
}

(function init(){
  ensureDemoUser();
  seedIfEmpty();
  renderAuthMode();
  if (session) {
    showApp();
  } else {
    showLogin('login');
  }
})();
