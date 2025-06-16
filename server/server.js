const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ✅ Use CORS middleware with specific origin
app.use(
  cors({
    origin: "https://mrdruv.github.io", // your GitHub Pages frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Your routes
app.use("/todos", todoRoutes);

// ✅ Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ Listen on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
console.log("🚀 Backend is starting...");
