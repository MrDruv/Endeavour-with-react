const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = 5000;

// CORS options to allow only your GitHub Pages frontend
const corsOptions = {
  origin: "https://mrdruv.github.io",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // For legacy browsers
};

app.use(cors(corsOptions));
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
