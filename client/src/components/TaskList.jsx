import React, { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load tasks. Please login again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  }

  async function handleStatusChange(task, newStatus) {
    try {
      const updated = { ...task, status: newStatus };
      await updateTask(task.id, updated);
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      alert("Failed to update task status");
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      TODO: { emoji: "📌", label: "To Do", class: "todo" },
      IN_PROGRESS: { emoji: "⚡", label: "In Progress", class: "in-progress" },
      DONE: { emoji: "✅", label: "Done", class: "done" },
    };
    return badges[status] || badges.TODO;
  };

  const getTypeBadge = (type) => {
    const badges = {
      LEETCODE: { emoji: "💻", label: "LeetCode" },
      SYSTEM_DESIGN: { emoji: "🏗️", label: "System Design" },
      PROJECT: { emoji: "🚀", label: "Project" },
      APPLYING: { emoji: "📧", label: "Applying" },
      OTHER: { emoji: "📋", label: "Other" },
    };
    return badges[type] || badges.OTHER;
  };

  const filteredTasks = filter === "ALL"
    ? tasks
    : tasks.filter(task => task.type === filter);

  if (loading) return <div className="loading-message">Loading tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <div className="filter-buttons">
          <button
            className={filter === "ALL" ? "active" : ""}
            onClick={() => setFilter("ALL")}
          >
            All
          </button>
          <button
            className={filter === "LEETCODE" ? "active" : ""}
            onClick={() => setFilter("LEETCODE")}
          >
            💻 LeetCode
          </button>
          <button
            className={filter === "SYSTEM_DESIGN" ? "active" : ""}
            onClick={() => setFilter("SYSTEM_DESIGN")}
          >
            🏗️ Sys Design
          </button>
          <button
            className={filter === "PROJECT" ? "active" : ""}
            onClick={() => setFilter("PROJECT")}
          >
            🚀 Projects
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Add your first task above!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            const typeBadge = getTypeBadge(task.type);

            return (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <span className="task-type-badge">
                    {typeBadge.emoji} {typeBadge.label}
                  </span>
                  <span className={`task-status-badge ${statusBadge.class}`}>
                    {statusBadge.emoji} {statusBadge.label}
                  </span>
                </div>
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="task-due-date">📅 Due: {task.dueDate}</span>
                  )}
                  {task.createdAt && (
                    <span className="task-created">Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="status-select"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button onClick={() => handleDelete(task.id)} className="delete-button">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskList;
