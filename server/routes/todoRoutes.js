const {
  handleGetTodos,
  handlePostTodos,
  handleUpdateTodo,
  handleDeleteTodo,
} = require("../controllers/todoController");

function routeHandler(req, res, path) {
  if (path === "/todos") {
    switch (req.method) {
      case "GET":
        handleGetTodos(res);
        break;
      case "POST":
        handlePostTodos(req, res);
        break;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  } else if (path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2]);
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid Todo ID" }));
      return;
    }

    switch (req.method) {
      case "PUT":
        handleUpdateTodo(req, res, id);
        break;
      case "DELETE":
        handleDeleteTodo(res, id);
        break;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
}

module.exports = routeHandler;
