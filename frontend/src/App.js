import { useState, useEffect } from "react";

import "./styles.css";
const API_URL = "https://endeavour-with-react-production.up.railway.app";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/todos`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const contentType = res.headers.get("content-type");
        console.log("Fetching from URL:", `${API_URL}/todos`);
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON response, got " + contentType);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched tasks:", data);
        setTasks(data);
        const fieldState = {};
        data.forEach((task) => {
          fieldState[task.id] = {
            due_date: task.due_date ? task.due_date.slice(0, 10) : "",
            notes: task.notes || "",
          };
        });
        setEditFields(fieldState);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handleAddTask = () => {
    if (!task.trim()) return;
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    let finalValue = value;

    if (field === "due_date" && value) {
      try {
        finalValue = new Date(value).toISOString();
      } catch (e) {
        console.error("Invalid date format:", value);
      }
    }

    // Only send the updated field
    const updated = {
      [field]: finalValue,
    };

    fetch(`${API_URL}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    }).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: finalValue } : t))
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

    fetch(`${API_URL}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      {token && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace(`#/login`);
            }}
            style={{
              margin: "1rem",
              padding: "0.5rem 1rem",
              background: "#ff5252",
              border: "none",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
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
