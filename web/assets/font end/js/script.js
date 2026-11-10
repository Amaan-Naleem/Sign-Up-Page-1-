const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const success = document.getElementById("success");
const successTitle = document.getElementById("successTitle");
const resetBtn = document.getElementById("resetBtn");
const togglePw = document.getElementById("togglePw");
const strength = document.getElementById("strength");

const inputs = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  password: document.getElementById("password"),
};

const rules = {
  name: (v) =>
    v.trim().split(/\s+/).filter(Boolean).length >= 2
      ? ""
      : "Enter your first and last name.",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ""
      : "Enter a valid email, like name@example.com.",
  phone: (v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15
      ? ""
      : "Enter a valid phone number (7 to 15 digits).";
  },
  password: (v) =>
    v.length >= 8 && /[a-zA-Z]/.test(v) && /\d/.test(v)
      ? ""
      : "Use 8+ characters with a letter and a number.",
};

const touched = {};

function validate(key) {
  const input = inputs[key];
  const field = input.closest(".field");
  const error = rules[key](input.value);
  document.getElementById(key + "Msg").textContent = error;
  field.classList.toggle("invalid", !!error);
  field.classList.toggle("valid", !error && input.value !== "");
  return !error;
}

Object.keys(inputs).forEach((key) => {
  const input = inputs[key];

  input.addEventListener("blur", () => {
    touched[key] = true;
    validate(key);
  });

  input.addEventListener("input", () => {
    if (key === "phone") {
      input.value = input.value.replace(/[^\d+\s-]/g, "");
    }
    if (key === "password") updateStrength(input.value);
    if (touched[key]) validate(key);
  });
});

/* password visibility */
togglePw.addEventListener("click", () => {
  const show = inputs.password.type === "password";
  inputs.password.type = show ? "text" : "password";
  togglePw.classList.toggle("on", show);
  togglePw.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

/* password strength */
function updateStrength(v) {
  let level = 0;
  if (v.length >= 8) level++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) level++;
  if (/\d/.test(v)) level++;
  if (/[^A-Za-z0-9]/.test(v)) level++;
  if (!v) level = 0;
  strength.dataset.level = level;
}

/* submit (front end only, simulated delay) */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let firstInvalid = null;
  Object.keys(inputs).forEach((key) => {
    touched[key] = true;
    if (!validate(key) && !firstInvalid) firstInvalid = inputs[key];
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.classList.add("loading");

  setTimeout(() => {
    const first = inputs.name.value.trim().split(/\s+/)[0];
    successTitle.textContent = `You're in, ${first}.`;
    form.hidden = true;
    success.hidden = false;
    submitBtn.classList.remove("loading");
  }, 1400);
});

/* reset */
resetBtn.addEventListener("click", () => {
  form.reset();
  Object.keys(inputs).forEach((key) => {
    touched[key] = false;
    inputs[key].closest(".field").classList.remove("valid", "invalid");
  });
  inputs.password.type = "password";
  togglePw.classList.remove("on");
  updateStrength("");
  success.hidden = true;
  form.hidden = false;
});
