const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

module.exports = pool;

const getAllTodos = async () => {
  const res = await pool.query("SELECT * FROM todo ORDER BY id");
  return res.rows;
};

const getTodoById = async (id) => {
  const res = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
  return res.rows[0];
};

const createTodo = async ({ text, completed, due_date, notes }) => {
  const formattedDueDate = due_date === "" ? null : due_date;
  const res = await pool.query(
    `INSERT INTO todo (text, completed, due_date, notes) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [text, completed, formattedDueDate, notes]
  );
  return res.rows[0];
};

const updateTodo = async (id, { text, completed, due_date, notes }) => {
  const formattedDueDate = due_date === "" ? null : due_date;
  const res = await pool.query(
    `UPDATE todo SET text = $1, completed = $2, due_date = $3, notes = $4 
     WHERE id = $5 RETURNING *`,
    [text, completed, formattedDueDate, notes, id]
  );
  return res.rows[0];
};

const deleteTodo = async (id) => {
  await pool.query("DELETE FROM todo WHERE id = $1", [id]);
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
