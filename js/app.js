const $ = id => document.getElementById(id);

function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function load(k,d){return JSON.parse(localStorage.getItem(k))||d}

function updateTime(){
  const d=new Date();
  $("date").textContent=d.toLocaleDateString();
  $("time").textContent=d.toLocaleTimeString();
  $("month").textContent=d.toLocaleString("default",{month:"long"});
  $("year").textContent=d.getFullYear();
}
setInterval(updateTime,1000);
updateTime();

/* TODO */
let todos=load("todos",[]);
function renderTodos(){
  $("todoList").innerHTML="";
  todos.forEach((t,i)=>{
    const li=document.createElement("li");
    li.textContent=t;
    li.onclick=()=>{todos.splice(i,1);save("todos",todos);renderTodos()}
    $("todoList").appendChild(li);
  });
}
function addTodo(){
  todos.push($("todoInput").value);
  $("todoInput").value="";
  save("todos",todos);
  renderTodos();
}
renderTodos();

/* HABITS */
let habits=load("habits",[]);
function renderHabits(){
  $("habitList").innerHTML="";
  habits.forEach((h,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<input type="checkbox">${h}`;
    $("habitList").appendChild(li);
  });
}
function addHabit(){
  habits.push($("habitInput").value);
  $("habitInput").value="";
  save("habits",habits);
  renderHabits();
}
renderHabits();

/* STUDY */
let study=load("study",0);
function addStudy(h){
  study=Math.min(24,study+h);
  save("study",study);
  $("studyText").textContent=`${study} / 24 hrs`;
  $("studyProgress").textContent=`${study}/24`;
}
addStudy(0);

/* SCREEN */
let screen=load("screen",0);
function addScreen(h){
  screen=Math.min(24,screen+h);
  save("screen",screen);
  $("screenText").textContent=`${screen} / 24 hrs`;
  $("screenProgress").textContent=`${screen}/24`;
}
addScreen(0);

/* GOALS */
let monthly=load("monthly",[]);
let yearly=load("yearly",[]);
function renderGoals(){
  $("monthlyGoals").innerHTML=monthly.map(g=>`<li>${g}</li>`).join("");
  $("yearlyGoals").innerHTML=yearly.map(g=>`<li>${g}</li>`).join("");
}
function addMonthly(){monthly.push($("monthlyInput").value);save("monthly",monthly);renderGoals()}
function addYearly(){yearly.push($("yearlyInput").value);save("yearly",yearly);renderGoals()}
renderGoals();

/* EXAMS */
let exams=load("exams",[]);
function addExam(){
  exams.push({n:$("examName").value,d:$("examDate").value});
  save("exams",exams);
  renderExams();
}
function renderExams(){
  $("examList").innerHTML=exams.map(e=>`<li>${e.n} - ${e.d}</li>`).join("");
}
renderExams();
