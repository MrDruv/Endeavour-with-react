// store.js
import { create } from "zustand";

const useStore = create((set) => ({
  // Auth state
  email: "",
  password: "",
  error: "",
  token: localStorage.getItem("token"),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setToken: (token) => set({ token }),

  // Task state
  task: "",
  tasks: [],
  expandedTaskId: null,
  editFields: {},
  setTask: (task) => set({ task }),
  setTasks: (tasks) => set({ tasks }),
  setExpandedTaskId: (id) => set({ expandedTaskId: id }),
  setEditFields: (fields) => set({ editFields: fields }),
}));

export default useStore;
