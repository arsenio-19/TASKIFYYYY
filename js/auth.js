/* ============================================================
   AUTH VIEW — login, signup, logout (mock auth via localStorage)
   ============================================================ */
let authMode = 'login'; // 'login' | 'signup'

function renderAuthMode(){
  const isSignup = authMode === 'signup';
  $('#authTitle').textContent = isSignup ? 'Create your account' : 'Welcome Back!';
  $('#authSubtitle').textContent = isSignup ? 'Start planning with Taskify' : 'Enter your details below';
  $('#nameField').classList.toggle('hidden', !isSignup);
  $('#authName').required = isSignup;
  $('#authForm button[type="submit"]').textContent = isSignup ? 'Sign up' : 'Log in';
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
      showToast('No matching account found. Try the demo account or sign up.');
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
  $('#appView').classList.add('flex');
  updateAuthUI();
  renderAll();
}

function showLogin(mode){
  authMode = mode || 'login';
  renderAuthMode();
  $('#appView').classList.add('hidden');
  $('#appView').classList.remove('flex');
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
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs uppercase">${initials}</div>
        <span class="font-semibold text-sm text-slate-900">${escapeHtml(session.name)}</span>
        <a href="#" id="topLogoutBtn" class="text-xs font-semibold text-slate-400 hover:text-sky-600">Log out</a>
      </div>`;
    $('#topLogoutBtn').addEventListener('click', (e) => { e.preventDefault(); logOut(); });
  } else {
    topbarAuth.innerHTML = `<button id="topLoginBtn" class="border border-sky-200 text-sky-700 bg-white font-semibold text-sm rounded-full px-4 py-2 hover:bg-sky-50">Log in</button>`;
    $('#topLoginBtn').addEventListener('click', () => showLogin('login'));
  }
}
