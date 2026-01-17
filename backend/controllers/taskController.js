const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required." });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({ message: "Task created successfully.", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: taskId, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({ message: "Title is required" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (completed !== undefined) {
      task.completed = completed;
    }
    await task.save();

    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
