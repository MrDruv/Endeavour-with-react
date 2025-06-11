const todoModel = require("../models/todoModel");
const pool = require("../db");

function handleGetTodos(res) {
  todoModel.getAllTodos((err, result) => {
    res.statusCode = err ? 500 : 200;
    res.end(JSON.stringify(err ? { error: err.message } : result.rows));
  });
}

function handlePostTodos(req, res) {
  let postBody = "";
  req.on("data", (chunk) => (postBody += chunk.toString()));
  req.on("end", () => {
    try {
      const {
        text,
        completed = false,
        due_date = "",
        notes = "",
      } = JSON.parse(postBody);
      const formattedDueDate = due_date === "" ? null : due_date;

      todoModel.addTodo(
        { text, completed, due_date: formattedDueDate, notes },
        (err, result) => {
          res.statusCode = err ? 500 : 201;
          res.end(
            JSON.stringify(err ? { error: err.message } : result.rows[0])
          );
        }
      );
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  });
}

function handleUpdateTodo(req, res, id) {
  let putBody = "";
  req.on("data", (chunk) => (putBody += chunk.toString()));
  req.on("end", () => {
    try {
      const { text, completed, due_date, notes } = JSON.parse(putBody);
      const formattedDueDate = due_date === "" ? null : due_date;

      todoModel.updateTodo(
        id,
        { text, completed, due_date: formattedDueDate, notes },
        (err, result) => {
          res.statusCode = err ? 500 : result.rows.length ? 200 : 404;
          res.end(
            JSON.stringify(
              err
                ? { error: err.message }
                : result.rows.length
                ? result.rows[0]
                : { error: "Todo Not Found" }
            )
          );
        }
      );
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  });
}

function handleDeleteTodo(res, id) {
  todoModel.deleteTodo(id, (err) => {
    res.statusCode = err ? 500 : 204;
    res.end(err ? JSON.stringify({ error: err.message }) : "");
  });
}

module.exports = {
  handleGetTodos,
  handlePostTodos,
  handleUpdateTodo,
  handleDeleteTodo,
};
