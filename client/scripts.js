const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const API_URL = "http://localhost:5000/todos";

let todos = []; // Will fetch from backend

async function fetchTodosFromServer() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch todos");
    todos = await res.json();
    render(todos, taskList);
  } catch (err) {
    console.error(err);
    alert("Failed to load todos from server");
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const escapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return escapeChars[match];
  });
}

function render(todos, taskList) {
  taskList.innerHTML = "";

  todos.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="task-header">
                <label>
                <input type="checkbox">
                <span>${escapeHTML(task.text)}</span>
                
                </label>
            </div>
            <div class="task-details">
            <div class="task-meta">
              Added on: ${new Date(task.createat).toLocaleDateString()} <br />
              <label>Due-Date</label>
              <input class="due-date" type="date" value="${task.due_date}"><br />
              <label>Notes</label>
              <textarea class="notesInput">${escapeHTML(task.notes)}</textarea><br>
            </div>
            <button class="btn-delete" data-id="${task.id}">Delete</button>
            </div>
        `;

    const taskHeader = li.querySelector(".task-header");
    const details = li.querySelector(".task-details");
    taskHeader.addEventListener("click", () => {
      details.classList.toggle("show");
    });

    const checkbox = li.querySelector('input[type="checkbox"]');
    const dueDateInput = li.querySelector(".due-date");
    const notesInput = li.querySelector(".notesInput");

    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      task.completed = checkbox.checked;
      await updateTask(task);
    });

    dueDateInput.addEventListener("change", async () => {
      task.due_date = dueDateInput.value;
      await updateTask(task);
    });

    notesInput.addEventListener("input", async () => {
      task.notes = notesInput.value;
      await updateTask(task);
    });

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

async function updateTask(task) {
  try {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to update todo");
  } catch (err) {
    console.error(err);
    alert("Failed to update task on server");
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    fetchTodosFromServer();
  } catch (err) {
    console.error(err);
    alert("Failed to delete task on server");
  }
}

async function addTask(text) {
  const newTask = {
    text,
    created_at: new Date().toISOString(),
    completed: false,
    due_date: "",
    notes: "",
  };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const responseData = await res.json();
    console.log("Response from server:", responseData); // Log response
    if (!res.ok)
      throw new Error(`Server Error: ${responseData.error || res.status}`);
    fetchTodosFromServer();
  } catch (err) {
    console.error("Add Task Error:", err);
    alert("Failed to add task to server");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTodosFromServer();

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = taskInput.value.trim();
      if (!text) return alert("Please enter the task");
      addTask(text);
      taskInput.value = "";
    }
  });
});
