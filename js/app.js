// ===============================
// Devil's Workspace — Step 6 Engine
// Completion • Reset • History
// ===============================

// ---------- DATE & TIME ----------
function updateDateTime() {
  const now = new Date();
  document.getElementById("date").textContent = now.toLocaleDateString("en-GB");
  document.getElementById("time").textContent = now.toLocaleTimeString("en-GB");
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ---------- STORAGE HELPERS ----------
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- DATE KEYS ----------
function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function yearKey(d = new Date()) {
  return String(d.getFullYear());
}

// ---------- DAILY HISTORY ----------
let dailyStats = load("dailyStats", {});
function ensureToday() {
  const t = todayKey();
  if (!dailyStats[t]) {
    dailyStats[t] = { habitsCompleted: 0, studyHours: 0, screenHours: 0 };
    save("dailyStats", dailyStats);
  }
}
ensureToday();

// ---------- MIDNIGHT RESET (HABITS) ----------
let lastSeenDay = load("lastSeenDay", todayKey());
function midnightCheck() {
  const nowDay = todayKey();
  if (nowDay !== lastSeenDay) {
    // Reset habit checkboxes
    habits.forEach(h => (h.checked = false));
    save("habits", habits);
    lastSeenDay = nowDay;
    save("lastSeenDay", lastSeenDay);
    ensureToday();
    renderHabits();
  }
}
setInterval(midnightCheck, 30 * 1000); // check every 30s
midnightCheck();

// ---------- MIGRATION HELPERS ----------
function migrateSimpleArray(arr) {
  // ["Task"] -> [{ text: "Task" }]
  return arr.map(v => (typeof v === "string" ? { text: v } : v));
}

// ---------- TO-DO (REMOVE ON COMPLETE) ----------
let todos = migrateSimpleArray(load("todos", []));
save("todos", todos);

function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.onchange = () => {
      todos.splice(i, 1); // remove permanently
      save("todos", todos);
      renderTodos();
    };
    li.appendChild(cb);
    li.appendChild(document.createTextNode(" " + t.text));
    list.appendChild(li);
  });
}
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value.trim()) return;
  todos.push({ text: input.value.trim() });
  input.value = "";
  save("todos", todos);
  renderTodos();
}
renderTodos();

// ---------- HABITS (DAILY RESET + COUNT) ----------
let habits = migrateSimpleArray(load("habits", []));
habits = habits.map(h => ({ text: h.text || h, checked: !!h.checked }));
save("habits", habits);

function renderHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  habits.forEach((h, i) => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = h.checked;
    cb.onchange = () => {
      h.checked = cb.checked;
      save("habits", habits);
      updateHabitCompletion();
    };
    li.appendChild(cb);
    li.appendChild(document.createTextNode(" " + h.text));
    list.appendChild(li);
  });
  updateHabitCompletion();
}
function addHabit() {
  const input = document.getElementById("habitInput");
  if (!input.value.trim()) return;
  habits.push({ text: input.value.trim(), checked: false });
  input.value = "";
  save("habits", habits);
  renderHabits();
}
function updateHabitCompletion() {
  ensureToday();
  const completed = habits.filter(h => h.checked).length;
  dailyStats[todayKey()].habitsCompleted = completed;
  save("dailyStats", dailyStats);
  const pct = habits.length ? Math.round((completed / habits.length) * 100) : 0;
  const el = document.getElementById("habitPercent");
  if (el) el.textContent = `${pct}%`;
}
renderHabits();

// ---------- STUDY ----------
let studyHours = load("studyHours", 0);
function addStudy() {
  if (studyHours < 24) studyHours++;
  save("studyHours", studyHours);
  ensureToday();
  dailyStats[todayKey()].studyHours = studyHours;
  save("dailyStats", dailyStats);
  updateStudy();
}
function updateStudy() {
  document.getElementById("studyCount").textContent = `${studyHours} / 24 hrs`;
  document.getElementById("studyValue").textContent = `${studyHours} / 24 hrs`;
  document.getElementById("studyBar").style.width = `${(studyHours / 24) * 100}%`;
}
updateStudy();

// ---------- SCREEN ----------
let screenHours = load("screenHours", 0);
function addScreen() {
  if (screenHours < 24) screenHours++;
  save("screenHours", screenHours);
  ensureToday();
  dailyStats[todayKey()].screenHours = screenHours;
  save("dailyStats", dailyStats);
  updateScreen();
}
function updateScreen() {
  document.getElementById("screenCount").textContent = `${screenHours} / 24 hrs`;
  document.getElementById("screenValue").textContent = `${screenHours} / 24 hrs`;
  document.getElementById("screenBar").style.width = `${(screenHours / 24) * 100}%`;
}
updateScreen();

// ---------- MONTH & YEAR LABELS ----------
const now = new Date();
document.getElementById("currentMonth").textContent =
  now.toLocaleString("default", { month: "long" });
document.getElementById("currentYear").textContent = now.getFullYear();

// ---------- GOALS (ACTIVE → ACCOMPLISHED) ----------
let goals = load("goals", {
  monthKey: monthKey(),
  yearKey: yearKey(),
  monthly: [],
  monthlyDone: [],
  yearly: [],
  yearlyDone: []
});

// Reset on month/year change
if (goals.monthKey !== monthKey()) {
  goals.monthKey = monthKey();
  goals.monthly = [];
}
if (goals.yearKey !== yearKey()) {
  goals.yearKey = yearKey();
  goals.yearly = [];
}
save("goals", goals);

function renderGoalLists() {
  const m = document.getElementById("monthlyGoals");
  const y = document.getElementById("yearlyGoals");
  m.innerHTML = "";
  y.innerHTML = "";

  goals.monthly.forEach((g, i) => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.onchange = () => {
      goals.monthly.splice(i, 1);
      goals.monthlyDone.push(g);
      save("goals", goals);
      renderGoalLists();
    };
    li.appendChild(cb);
    li.appendChild(document.createTextNode(" " + g));
    m.appendChild(li);
  });

  goals.yearly.forEach((g, i) => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.onchange = () => {
      goals.yearly.splice(i, 1);
      goals.yearlyDone.push(g);
      save("goals", goals);
      renderGoalLists();
    };
    li.appendChild(cb);
    li.appendChild(document.createTextNode(" " + g));
    y.appendChild(li);
  });

  // Append accomplished (crossed-out)
  goals.monthlyDone.forEach(g => {
    const li = document.createElement("li");
    li.style.textDecoration = "line-through";
    li.textContent = g;
    m.appendChild(li);
  });
  goals.yearlyDone.forEach(g => {
    const li = document.createElement("li");
    li.style.textDecoration = "line-through";
    li.textContent = g;
    y.appendChild(li);
  });
}

function addMonthlyGoal() {
  const input = document.getElementById("monthlyGoalInput");
  if (!input.value.trim()) return;
  goals.monthly.push(input.value.trim());
  input.value = "";
  save("goals", goals);
  renderGoalLists();
}
function addYearlyGoal() {
  const input = document.getElementById("yearlyGoalInput");
  if (!input.value.trim()) return;
  goals.yearly.push(input.value.trim());
  input.value = "";
  save("goals", goals);
  renderGoalLists();
}
renderGoalLists();

// ---------- EXAMS ----------
let exams = load("exams", []);
function renderExams() {
  const list = document.getElementById("examList");
  list.innerHTML = "";
  exams.forEach((e, i) => {
    const li = document.createElement("li");
    li.textContent = `${e.name} – ${e.date}`;
    li.onclick = () => {
      exams.splice(i, 1);
      save("exams", exams);
      renderExams();
    };
    list.appendChild(li);
  });
}
function addExam() {
  const name = document.getElementById("examName").value.trim();
  const date = document.getElementById("examDate").value;
  if (!name || !date) return;
  exams.push({ name, date });
  save("exams", exams);
  document.getElementById("examName").value = "";
  document.getElementById("examDate").value = "";
  renderExams();
}
renderExams();
