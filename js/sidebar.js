/* ============================================================
   SIDEBAR — collapse/expand & mobile sidebar
   ============================================================ */
function applySidebarCollapsed(){
  const sidebar = $('#sidebar');
  const brand = $('#sidebarBrand');
  const brandName = $('#sidebarBrandName');
  const newPlanBtn = $('#newPlanBtn');
  const newPlanLabel = $('#newPlanLabel');
  const miniCal = $('#miniCalendarWrap');
  const calIcon = $('#calendarIconBtn');
  const userInfo = $('#userInfoText');
  const userChip = $('#userChip');

  if (sidebarCollapsed) {
    sidebar.classList.remove('w-64', 'p-4');
    sidebar.classList.add('w-[84px]', 'px-3', 'py-4', 'items-center');
    brand.classList.add('justify-center');
    brandName.classList.add('hidden');
    newPlanLabel.classList.add('hidden');
    newPlanBtn.classList.remove('py-3', 'w-full');
    newPlanBtn.classList.add('w-11', 'h-11', 'p-0', 'mx-auto', 'shrink-0');
    miniCal.classList.add('hidden');
    calIcon.classList.remove('hidden');
    userInfo.classList.add('hidden');
    userChip.classList.add('justify-center');
  } else {
    sidebar.classList.add('w-64', 'p-4');
    sidebar.classList.remove('w-[84px]', 'px-3', 'py-4', 'items-center');
    brand.classList.remove('justify-center');
    brandName.classList.remove('hidden');
    newPlanLabel.classList.remove('hidden');
    newPlanBtn.classList.add('py-3', 'w-full');
    newPlanBtn.classList.remove('w-11', 'h-11', 'p-0', 'mx-auto', 'shrink-0');
    miniCal.classList.remove('hidden');
    calIcon.classList.add('hidden');
    userInfo.classList.remove('hidden');
    userChip.classList.remove('justify-center');
  }
}

$('#sidebarToggle').addEventListener('click', () => {
  sidebarCollapsed = !sidebarCollapsed;
  applySidebarCollapsed();
});

$('#calendarIconBtn').addEventListener('click', () => {
  sidebarCollapsed = false;
  applySidebarCollapsed();
});

function openMobileSidebar(){
  $('#sidebar').classList.remove('-translate-x-full');
  $('#sidebar').classList.add('translate-x-0', 'shadow-2xl');
  $('#sidebarBackdrop').classList.remove('hidden');
}
function closeMobileSidebar(){
  $('#sidebar').classList.add('-translate-x-full');
  $('#sidebar').classList.remove('translate-x-0', 'shadow-2xl');
  $('#sidebarBackdrop').classList.add('hidden');
}
$('#mobileSidebarToggle').addEventListener('click', () => {
  const isOpen = $('#sidebar').classList.contains('translate-x-0');
  isOpen ? closeMobileSidebar() : openMobileSidebar();
});
$('#sidebarBackdrop').addEventListener('click', closeMobileSidebar);

$('#newPlanBtn').addEventListener('click', () => {
  if (!session) { showToast('Log in to create a new plan.'); showLogin('login'); return; }
  openTaskModal();
});
