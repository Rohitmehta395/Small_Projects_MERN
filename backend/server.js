require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const { register, login } = require("./controllers/authController");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("./controllers/taskController");
const authMiddleware = require("./middlewares/authMiddleware");
const app = express();

const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Health Check");
});

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

//Task Routes
app.post("/api/tasks", authMiddleware, createTask);
app.get("/api/tasks", authMiddleware, getTasks);
app.put("/api/tasks/:id", authMiddleware, updateTask);
app.delete("/api/tasks/:id", authMiddleware, deleteTask);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
