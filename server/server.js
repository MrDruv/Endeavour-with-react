const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body

// Routes
app.use("/todos", todoRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
