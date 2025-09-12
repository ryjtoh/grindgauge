import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks;
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // Handle delete
  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task " + err);
    }
  }

  if (loading) return <p>Loading tasks</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My GrindGauge Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one!</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.type}</td>
                <td>{task.status}</td>
                <td>{task.createdAt}</td>
                <td>{task.dueDate || "—"}</td>
                <td>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                  {/* We'll add Edit later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;
