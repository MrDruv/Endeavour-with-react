const pool = require("../db");

function getAllTodos(callback) {
  pool.query("SELECT * FROM todo ORDER BY id", callback);
}

function addTodo({ text, completed, due_date, notes }, callback) {
  pool.query(
    "INSERT INTO todo (text, completed, due_date, notes) VALUES ($1, $2, $3, $4) RETURNING *",
    [text, completed, due_date, notes],
    callback
  );
}

function updateTodo(id, { text, completed, due_date, notes }, callback) {
  pool.query(
    "UPDATE todo SET text = $1, completed = $2, due_date = $3, notes = $4 WHERE id = $5 RETURNING *",
    [text, completed, due_date, notes, id],
    callback
  );
}

function deleteTodo(id, callback) {
  pool.query("DELETE FROM todo WHERE id = $1", [id], callback);
}

module.exports = {
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
