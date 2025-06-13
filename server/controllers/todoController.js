const todoModel = require("../models/todoModel");

const getTodos = async (req, res) => {
  try {
    const todos = await todoModel.getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { text, completed = false, due_date = "", notes = "" } = req.body;
    if (!text) return res.status(400).json({ error: "Task text is required" });

    const newTodo = await todoModel.createTodo({
      text,
      completed,
      due_date,
      notes,
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid Todo ID" });

    const { text, completed, due_date, notes } = req.body;
    const updatedTodo = await todoModel.updateTodo(id, {
      text,
      completed,
      due_date,
      notes,
    });

    if (!updatedTodo) return res.status(404).json({ error: "Todo Not Found" });

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid Todo ID" });

    await todoModel.deleteTodo(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
