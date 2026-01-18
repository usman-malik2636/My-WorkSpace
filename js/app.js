// ===============================
// Devil's Workspace — FINAL DASHBOARD LOGIC
// ===============================

// ---------- DATE & TIME ----------
function updateDateTime() {
  const now = new Date();
  document.getElementById("date").textContent =
    now.toLocaleDateString("en-GB");
  document.getElementById("time").textContent =
    now.toLocaleTimeString("en-GB");
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ---------- STORAGE HELPERS ----------
function load(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- TO-DO ----------
let todos = load("todos", []);

function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  todos.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.onclick = () => {
      todos.splice(i, 1);
      save("todos", todos);
      renderTodos();
    };
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value.trim()) return;
  todos.push(input.value.trim());
  input.value = "";
  save("todos", todos);
  renderTodos();
}

renderTodos();

// ---------- HABITS ----------
let habits = load("habits", []);

function renderHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  habits.forEach((habit, i) => {
    const li = document.createElement("li");
    li.textContent = habit;
    li.onclick = () => {
      habits.splice(i, 1);
      save("habits", habits);
      renderHabits();
    };
    list.appendChild(li);
  });
}

function addHabit() {
  const input = document.getElementById("habitInput");
  if (!input.value.trim()) return;
  habits.push(input.value.trim());
  input.value = "";
  save("habits", habits);
  renderHabits();
}

renderHabits();

// ---------- STUDY ----------
let studyHours = load("studyHours", 0);

function addStudy() {
  if (studyHours < 24) studyHours++;
  save("studyHours", studyHours);
  updateStudy();
}

function updateStudy() {
  document.getElementById("studyCount").textContent =
    `${studyHours} / 24 hrs`;
  document.getElementById("studyValue").textContent =
    `${studyHours} / 24 hrs`;
  document.getElementById("studyBar").style.width =
    `${(studyHours / 24) * 100}%`;
}

updateStudy();

// ---------- SCREEN ----------
let screenHours = load("screenHours", 0);

function addScreen() {
  if (screenHours < 24) screenHours++;
  save("screenHours", screenHours);
  updateScreen();
}

function updateScreen() {
  document.getElementById("screenCount").textContent =
    `${screenHours} / 24 hrs`;
  document.getElementById("screenValue").textContent =
    `${screenHours} / 24 hrs`;
  document.getElementById("screenBar").style.width =
    `${(screenHours / 24) * 100}%`;
}

updateScreen();

// ---------- MONTH / YEAR ----------
const now = new Date();
document.getElementById("currentMonth").textContent =
  now.toLocaleString("default", { month: "long" });
document.getElementById("currentYear").textContent =
  now.getFullYear();

// ---------- GOALS ----------
let monthlyGoals = load("monthlyGoals", []);
let yearlyGoals = load("yearlyGoals", []);

function renderGoals(list, elementId, key) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  list.forEach((goal, i) => {
    const li = document.createElement("li");
    li.textContent = goal;
    li.onclick = () => {
      list.splice(i, 1);
      save(key, list);
      renderGoals(list, elementId, key);
    };
    el.appendChild(li);
  });
}

function addMonthlyGoal() {
  const input = document.getElementById("monthlyGoalInput");
  if (!input.value.trim()) return;
  monthlyGoals.push(input.value.trim());
  input.value = "";
  save("monthlyGoals", monthlyGoals);
  renderGoals(monthlyGoals, "monthlyGoals", "monthlyGoals");
}

function addYearlyGoal() {
  const input = document.getElementById("yearlyGoalInput");
  if (!input.value.trim()) return;
  yearlyGoals.push(input.value.trim());
  input.value = "";
  save("yearlyGoals", yearlyGoals);
  renderGoals(yearlyGoals, "yearlyGoals", "yearlyGoals");
}

renderGoals(monthlyGoals, "monthlyGoals", "monthlyGoals");
renderGoals(yearlyGoals, "yearlyGoals", "yearlyGoals");

// ---------- EXAMS ----------
let exams = load("exams", []);

function renderExams() {
  const list = document.getElementById("examList");
  list.innerHTML = "";
  exams.forEach((exam, i) => {
    const li = document.createElement("li");
    li.textContent = `${exam.name} – ${exam.date}`;
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
