const pool = require("../db");

// Get all todos
const getAllTodos = async () => {
  const result = await pool.query("SELECT * FROM todo ORDER BY id");
  return result.rows;
};

// Create a new todo
const createTodo = async (text, completed, due_date, notes) => {
  const result = await pool.query(
    "INSERT INTO todo (text, completed, due_date, notes) VALUES ($1, $2, $3, $4) RETURNING *",
    [text, completed, due_date, notes]
  );
  return result.rows[0];
};

// Update todo by ID
const updateTodoById = async (id, text, completed, due_date, notes) => {
  const result = await pool.query(
    "UPDATE todo SET text = $1, completed = $2, due_date = $3, notes = $4 WHERE id = $5 RETURNING *",
    [text, completed, due_date, notes, id]
  );
  return result.rows;
};

// Delete todo by ID
const deleteTodoById = async (id) => {
  return await pool.query("DELETE FROM todo WHERE id = $1", [id]);
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodoById,
  deleteTodoById,
};
