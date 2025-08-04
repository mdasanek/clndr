const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const clearTasksButton = document.getElementById("clearTasksButton");
const taskList = document.getElementById("taskList");
const completedTaskList = document.getElementById("completedTaskList");

// Array with task names for hints
const placeholderHints = [
  "Приготовить яичницу",
  "Постирать вещи",
  "Подготовить презентацию",
  "Позвонить другу",
  "Почитать книгу",
  "Сделать зарядку"
];

window.addEventListener("load", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    createTask(task.text, task.done, true);
  });
});

addTaskButton.addEventListener("click", () => {
  addTask();
});

taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

clearTasksButton.addEventListener("click", () => {
  clearCompletedTasks();
});

function getRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * placeholderHints.length);
  return placeholderHints[randomIndex];
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    createTask(taskText, false);
    taskInput.value = "";
  }
}

function createTask(text, done, isLoading = false) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task", "fade-in");

  const taskText = document.createElement("span");
  taskText.textContent = text;
  taskElement.appendChild(taskText);

  if (done) {
    taskElement.classList.add("done");
    completedTaskList.appendChild(taskElement);
  } else {
    taskList.appendChild(taskElement);
  }

  taskInput.placeholder = getRandomPlaceholder();

  taskElement.addEventListener("click", () => {
    taskElement.classList.toggle("done");
    if (taskElement.classList.contains("done")) {
      completedTaskList.appendChild(taskElement);
    } else {
      taskList.appendChild(taskElement);
    }
    reorderTasks();
    saveTasks();
  });

  taskElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", taskText.textContent);
    taskElement.classList.add("dragging");
  });

  taskElement.addEventListener("dragend", () => {
    taskElement.classList.remove("dragging");
  });

  taskElement.setAttribute("draggable", true);

  reorderTasks();
  saveTasks();
}

function reorderTasks() {
  const doneTasks = Array.from(completedTaskList.querySelectorAll(".task.done"));
  doneTasks.forEach(doneTask => {
    completedTaskList.removeChild(doneTask);
    completedTaskList.appendChild(doneTask);
  });
}

taskList.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = getDragAfterElement(taskList, event.clientY);
  const draggingElement = document.querySelector(".dragging");
  if (afterElement == null) {
    taskList.appendChild(draggingElement);
  } else {
    taskList.insertBefore(draggingElement, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    clearCompletedTasks();
  }
});

function clearCompletedTasks() {
  const doneTasks = completedTaskList.querySelectorAll(".task.done");
  doneTasks.forEach(task => task.remove());
  saveTasks();
}

function saveTasks() {
  const tasksToSave = Array.from(taskList.querySelectorAll(".task"), taskElement => {
    const taskText = taskElement.querySelector("span").textContent;
    return {
      text: taskText,
      done: taskElement.classList.contains("done")
    };
  });

  const completedTasksToSave = Array.from(completedTaskList.querySelectorAll(".task"), taskElement => {
    const taskText = taskElement.querySelector("span").textContent;
    return {
      text: taskText,
      done: true
    };
  });

  const allTasksToSave = tasksToSave.concat(completedTasksToSave);

  localStorage.setItem("tasks", JSON.stringify(allTasksToSave));
}

reorderTasks();
