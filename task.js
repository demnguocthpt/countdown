document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("taskList");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const toggleTaskBtn = document.getElementById("toggleTaskPanel");
  const taskPanel = document.getElementById("taskPanel");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let isTaskVisible = false;

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "done" : ""} ${task.priority ? "priority" : ""}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="task-check">
        <span>${task.text}</span>
        <small class="deadline">${task.deadline || ""}</small>
        <button data-index="${index}" class="priorityBtn">⭐</button>
        <button data-index="${index}" class="deleteBtn">🗑️</button>
      `;
      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;
    if (!text) return alert("❗ Vui lòng nhập tên công việc!");
    tasks.push({ text, completed: false, priority: false, deadline });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    deadlineInput.value = "";
  });

  taskList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (!index) return;

    if (e.target.classList.contains("task-check")) {
      tasks[index].completed = e.target.checked;
    } else if (e.target.classList.contains("deleteBtn")) {
      tasks.splice(index, 1);
    } else if (e.target.classList.contains("priorityBtn")) {
      tasks[index].priority = !tasks[index].priority;
    }
    saveTasks();
    renderTasks();
  });

  toggleTaskBtn.addEventListener("click", () => {
    taskPanel.style.animation = "none";
    taskPanel.offsetHeight; // force reflow
    taskPanel.style.animation = "";
    taskPanel.classList.remove("slide-in", "slide-out");

    if (!isTaskVisible) {
      taskPanel.style.display = "block";
      taskPanel.classList.add("slide-in");
      isTaskVisible = true;
    } else {
      taskPanel.classList.add("slide-out");
      taskPanel.addEventListener("animationend", () => {
        taskPanel.classList.remove("slide-out");
        taskPanel.style.display = "none";
        isTaskVisible = false;
      }, { once: true });
    }
  });

  renderTasks();
});



