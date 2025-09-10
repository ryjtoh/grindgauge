import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const t = await getTasks();
    setTasks(t);
  }

  async function handleCreate() {
    await createTask({ title, type: "OTHER", status: "TODO", dueDate: null });
    setTitle("");
    refresh();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    refresh();
  }

  async function toggleDone(task) {
    const updated = {
      ...task,
      status: task.status === "DONE" ? "TODO" : "DONE",
    };
    await updateTask(task.id, updated);
    refresh();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>GrindGauge — Tasks</h1>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> — {t.type} — {t.status}
            <button onClick={() => toggleDone(t)} style={{ marginLeft: 8 }}>
              toggle done
            </button>
            <button
              onClick={() => handleDelete(t.id)}
              style={{ marginLeft: 8 }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
