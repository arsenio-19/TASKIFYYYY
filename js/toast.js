/* ============================================================
   TOAST — notifikasi kecil di pojok layar
   ============================================================ */
let toastTimer;
function showToast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}
