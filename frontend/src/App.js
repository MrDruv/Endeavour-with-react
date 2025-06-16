import { useState, useEffect } from "react";
import "./styles.css";
const API_URL =
  "https://8dda-2409-408c-be82-fb0c-9c95-a0e9-6c18-b33c.ngrok-free.app/todos";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetch(
      "https://8dda-2409-408c-be82-fb0c-9c95-a0e9-6c18-b33c.ngrok-free.app/todos"
    )
      .then((res) => {
        console.log("Response content-type:", res.headers.get("content-type"));
        return res.text(); // Read raw response body as text
      })
      .then((text) => {
        console.log("Raw response body:", text);
        const json = JSON.parse(text); // Try parsing JSON here
        console.log("Parsed JSON:", json);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        const fieldState = {};
        data.forEach((task) => {
          fieldState[task.id] = {
            due_date: task.due_date ? task.due_date.slice(0, 10) : "",
            notes: task.notes || "",
          };
        });
        setEditFields(fieldState);
      });
  }, []);

  const handleAddTask = () => {
    if (!task.trim()) return;
    fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask]);
        setEditFields((prev) => ({
          ...prev,
          [newTask.id]: { due_date: "", notes: "" },
        }));
        setTask("");
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setEditFields((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });
  };

  const handleFieldBlur = (id, field, value) => {
    const updated = {
      ...tasks.find((t) => t.id === id),
      ...editFields[id],
      [field]: value,
    };

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
    });
  };

  // New: Handle completed checkbox toggle
  const handleCompletedChange = (id, completed) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      completed,
    };

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      })
      .catch((err) => {
        console.error("Failed to update completed status:", err);
      });
  };

  const toggleDetails = (id) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="app-container">
      <input
        id="taskInput"
        type="text"
        placeholder="New Item..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-header" onClick={() => toggleDetails(task.id)}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) =>
                    handleCompletedChange(task.id, e.target.checked)
                  }
                />
                <span>{task.text}</span>
              </label>
            </div>

            {expandedTaskId === task.id && (
              <div className="task-details show">
                <div className="task-meta">
                  Added on:{" "}
                  {new Date(
                    task.createat || task.createdat
                  ).toLocaleDateString()}
                  <br />
                  <label>Due-Date</label>
                  <input
                    className="due-date"
                    type="date"
                    value={editFields[task.id]?.due_date || ""}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        [task.id]: {
                          ...prev[task.id],
                          due_date: e.target.value,
                        },
                      }))
                    }
                    onBlur={(e) =>
                      handleFieldBlur(task.id, "due_date", e.target.value)
                    }
                  />
                  <br />
                  <label>Notes</label>
                  <textarea
                    className="notesInput"
                    value={editFields[task.id]?.notes || ""}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        [task.id]: {
                          ...prev[task.id],
                          notes: e.target.value,
                        },
                      }))
                    }
                    onBlur={(e) =>
                      handleFieldBlur(task.id, "notes", e.target.value)
                    }
                  />
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
