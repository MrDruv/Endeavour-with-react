import { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/todos")
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
    fetch("http://localhost:5000/todos", {
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
    fetch(`http://localhost:5000/todos/${id}`, {
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

    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
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
                <input type="checkbox" defaultChecked={task.completed} />
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
                      e.stopPropagation(); // Prevent collapse on delete
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
