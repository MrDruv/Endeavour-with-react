const { Pool } = require("pg");

const pool = new Pool({
  user: "druva",
  host: "localhost",
  database: "todo_db",
  password: "8055",
  port: 5432,
});

module.exports = pool;
