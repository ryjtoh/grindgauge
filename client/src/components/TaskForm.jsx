import React, { useState } from "react";
import { createTask } from "../services/api";
import "./TaskForm.css";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("LEETCODE");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newTask = {
      title,
      type,
      status,
      dueDate: dueDate || null
    };

    try {
      const savedTask = await createTask(newTask);
      if (onTaskCreated) onTaskCreated(savedTask);
      setTitle("");
      setType("LEETCODE");
      setStatus("TODO");
      setDueDate("");
      window.location.reload(); // Refresh to show new task
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Task title (e.g., Two Sum, Design Twitter)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            className="task-input"
          />
        </div>

        <div className="form-row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
            className="task-select"
          >
            <option value="LEETCODE">💻 LeetCode</option>
            <option value="SYSTEM_DESIGN">🏗️ System Design</option>
            <option value="PROJECT">🚀 Project</option>
            <option value="APPLYING">📧 Applying</option>
            <option value="OTHER">📋 Other</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
            className="task-select"
          >
            <option value="TODO">📌 To Do</option>
            <option value="IN_PROGRESS">⚡ In Progress</option>
            <option value="DONE">✅ Done</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            className="task-input date-input"
          />

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
