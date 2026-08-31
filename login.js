const authForm = document.getElementById("authForm");
const togglePw = document.getElementById("togglePw");
const passwordInput = document.getElementById("authPassword");

const switchAuthLink = document.getElementById("switchAuthLink");
const continueGuest = document.getElementById("continueGuest");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const switchText = document.getElementById("switchText");
const nameField = document.getElementById("nameField");
const submitBtn = document.getElementById("submitBtn");

let isSignUp = false;

// ==============================
// SHOW / HIDE PASSWORD
// ==============================

togglePw.addEventListener("click", () => {

if (passwordInput.type === "password") {

```
passwordInput.type = "text";
togglePw.textContent = "🙈";
```

} else {

```
passwordInput.type = "password";
togglePw.textContent = "👁";
```

}

});

// ==============================
// LOGIN <-> SIGN UP
// ==============================

switchAuthLink.addEventListener("click", (e) => {

e.preventDefault();

isSignUp = !isSignUp;

if (isSignUp) {

```
authTitle.textContent = "Create Account";

authSubtitle.textContent =
  "Create your Taskify account";

switchText.textContent =
  "Already have an account?";

switchAuthLink.textContent =
  "Log In";

submitBtn.textContent =
  "Sign Up";

nameField.classList.remove("hidden");
```

} else {

```
authTitle.textContent = "Welcome Back!";

authSubtitle.textContent =
  "Enter your details below";

switchText.textContent =
  "Don't have an account?";

switchAuthLink.textContent =
  "Sign Up";

submitBtn.textContent =
  "Log in";

nameField.classList.add("hidden");
```

}

});

// ==============================
// FORM SUBMIT
// ==============================

authForm.addEventListener("submit", (e) => {

e.preventDefault();

const name =
document.getElementById("authName").value.trim();

const email =
document.getElementById("authEmail").value.trim();

const password =
passwordInput.value;

if (password.length < 3) {

```
alert("Password minimal 3 karakter.");

return;
```

}

if (isSignUp) {

```
if (!name) {

  alert("Nama wajib diisi.");

  return;

}

localStorage.setItem("taskifyUser", JSON.stringify({
  name: name,
  email: email
}));

alert("Akun berhasil dibuat!");
```

} else {

```
localStorage.setItem("taskifyUser", JSON.stringify({
  name: email.split("@")[0],
  email: email
}));

alert("Login berhasil!");
```

}

window.location.href = "index.html";

});

// ==============================
// CONTINUE AS GUEST
// ==============================

continueGuest.addEventListener("click", () => {

window.location.href = "index.html";

});
