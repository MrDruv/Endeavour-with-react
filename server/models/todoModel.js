const pool = require("../db");

const getAllTodos = async () => {
  const result = await pool.query("SELECT * FROM todo ORDER BY id");
  return result.rows;
};

const createTodo = async ({
  text,
  completed = false,
  due_date = null,
  notes = "",
}) => {
  const result = await pool.query(
    "INSERT INTO todo (text, completed, due_date, notes) VALUES ($1, $2, $3, $4) RETURNING *",
    [text, completed, due_date || null, notes]
  );
  return result.rows[0];
};

const updateTodo = async (id, { text, completed, due_date = null, notes }) => {
  const result = await pool.query(
    "UPDATE todo SET text = $1, completed = $2, due_date = $3, notes = $4 WHERE id = $5 RETURNING *",
    [text, completed, due_date || null, notes, id]
  );
  return result.rows;
};

const deleteTodo = async (id) => {
  await pool.query("DELETE FROM todo WHERE id = $1", [id]);
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
