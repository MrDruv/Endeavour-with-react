//App.js
import useStore from "./store";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./styles.css";
const API_URL = "https://endeavour-with-react-production.up.railway.app";

function App() {
  const queryClient = useQueryClient();
  const {
    task,
    setTask,
    setTasks,
    expandedTaskId,
    setExpandedTaskId,
    editFields,
    setEditFields,
    token,
    setToken,
  } = useStore();

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, [setToken]);

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  };

  const {
    data: tasksData,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTasks,
    enabled: !!token,
    onSuccess: (data) => {
      setTasks(data);
      const fieldState = {};
      data.forEach((task) => {
        fieldState[task.id] = {
          due_date: task.due_date?.slice(0, 10) || "",
          notes: task.notes || "",
        };
      });
      setEditFields(fieldState);
    },
  });

  const Tasks = tasksData || [];
  const toggleDetails = (id) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  const { mutate: addTask } = useMutation({
    mutationFn: async (newText) => {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newText }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTask("");
    },
  });

  const handleAddTask = () => {
    if (!task.trim()) return;
    addTask(task);
  };

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (id) => {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const { mutate: updateField } = useMutation({
    mutationFn: async ({ id, field, value }) => {
      const finalValue =
        field === "due_date" && value ? new Date(value).toISOString() : value;

      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: finalValue }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleFieldBlur = (id, field, value) => {
    updateField({ id, field, value });
  };

  // New: Handle completed checkbox toggle
  const { mutate: updateCompleted } = useMutation({
    mutationFn: async ({ id, completed }) => {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handleCompletedChange = (id, completed) => {
    updateCompleted({ id, completed });
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
        {Tasks.map((task) => (
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
