// ---------------------------
// Devil's Workspace Dashboard JS
// ---------------------------

// ======== DOM ELEMENTS ========
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");

// To-Do
const todoInput = document.getElementById("todo-input");
const todoAddBtn = document.getElementById("todo-add");
const todoListEl = document.getElementById("todo-list");

// Habits
const habitInput = document.getElementById("habit-input");
const habitAddBtn = document.getElementById("habit-add");
const habitListEl = document.getElementById("habit-list");

// Study Tracker
const studyAddBtn = document.getElementById("study-add");
const studyCountEl = document.getElementById("study-count");

// Screen Time Tracker
const screenAddBtn = document.getElementById("screen-add");
const screenCountEl = document.getElementById("screen-count");

// Goals
const monthlyInput = document.getElementById("monthly-input");
const monthlyAddBtn = document.getElementById("monthly-add");
const monthlyListEl = document.getElementById("monthly-list");

const yearlyInput = document.getElementById("yearly-input");
const yearlyAddBtn = document.getElementById("yearly-add");
const yearlyListEl = document.getElementById("yearly-list");

// Exams
const examInput = document.getElementById("exam-input");
const examAddBtn = document.getElementById("exam-add");
const examListEl = document.getElementById("exam-list");

// ======== INITIALIZATION ========

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let studyHours = parseInt(localStorage.getItem("studyHours")) || 0;
let screenHours = parseInt(localStorage.getItem("screenHours")) || 0;
let monthlyGoals = JSON.parse(localStorage.getItem("monthlyGoals")) || [];
let yearlyGoals = JSON.parse(localStorage.getItem("yearlyGoals")) || [];
let exams = JSON.parse(localStorage.getItem("exams")) || [];

// ======== UTILITY FUNCTIONS ========

// Format date
function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");
  dateEl.textContent = date;
  timeEl.textContent = time;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Save all data
function saveData() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("studyHours", studyHours);
  localStorage.setItem("screenHours", screenHours);
  localStorage.setItem("monthlyGoals", JSON.stringify(monthlyGoals));
  localStorage.setItem("yearlyGoals", JSON.stringify(yearlyGoals));
  localStorage.setItem("exams", JSON.stringify(exams));
}

// ======== RENDER FUNCTIONS ========

function renderTodos() {
  todoListEl.innerHTML = "";
  todos.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("dashboard-item");
    li.addEventListener("click", () => {
      todos.splice(index, 1);
      saveData();
      renderTodos();
    });
    todoListEl.appendChild(li);
  });
}

function renderHabits() {
  habitListEl.innerHTML = "";
  habits.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("dashboard-item");
    li.addEventListener("click", () => {
      habits.splice(index, 1);
      saveData();
      renderHabits();
    });
    habitListEl.appendChild(li);
  });
}

function renderStudy() {
  studyCountEl.textContent = `${studyHours} / 24 hrs`;
}

function renderScreen() {
  screenCountEl.textContent = `${screenHours} / 24 hrs`;
}

function renderMonthlyGoals() {
  monthlyListEl.innerHTML = "";
  monthlyGoals.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("dashboard-item");
    li.addEventListener("click", () => {
      monthlyGoals.splice(index, 1);
      saveData();
      renderMonthlyGoals();
    });
    monthlyListEl.appendChild(li);
  });
}

function renderYearlyGoals() {
  yearlyListEl.innerHTML = "";
  yearlyGoals.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("dashboard-item");
    li.addEventListener("click", () => {
      yearlyGoals.splice(index, 1);
      saveData();
      renderYearlyGoals();
    });
    yearlyListEl.appendChild(li);
  });
}

function renderExams() {
  examListEl.innerHTML = "";
  exams.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("dashboard-item");
    li.addEventListener("click", () => {
      exams.splice(index, 1);
      saveData();
      renderExams();
    });
    examListEl.appendChild(li);
  });
}

// ======== EVENT LISTENERS ========

// To-Do
todoAddBtn.addEventListener("click", () => {
  const value = todoInput.value.trim();
  if (value) {
    todos.push(value);
    todoInput.value = "";
    saveData();
    renderTodos();
  }
});

// Habits
habitAddBtn.addEventListener("click", () => {
  const value = habitInput.value.trim();
  if (value) {
    habits.push(value);
    habitInput.value = "";
    saveData();
    renderHabits();
  }
});

// Study Hours
studyAddBtn.addEventListener("click", () => {
  if (studyHours < 24) studyHours++;
  saveData();
  renderStudy();
});

// Screen Hours
screenAddBtn.addEventListener("click", () => {
  if (screenHours < 24) screenHours++;
  saveData();
  renderScreen();
});

// Monthly Goals
monthlyAddBtn.addEventListener("click", () => {
  const value = monthlyInput.value.trim();
  if (value) {
    monthlyGoals.push(value);
    monthlyInput.value = "";
    saveData();
    renderMonthlyGoals();
  }
});

// Yearly Goals
yearlyAddBtn.addEventListener("click", () => {
  const value = yearlyInput.value.trim();
  if (value) {
    yearlyGoals.push(value);
    yearlyInput.value = "";
    saveData();
    renderYearlyGoals();
  }
});

// Exams
examAddBtn.addEventListener("click", () => {
  const value = examInput.value.trim();
  if (value) {
    exams.push(value);
    examInput.value = "";
    saveData();
    renderExams();
  }
});

// ======== INITIAL RENDER ========
renderTodos();
renderHabits();
renderStudy();
renderScreen();
renderMonthlyGoals();
renderYearlyGoals();
renderExams();
