import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";
import TaskList from "./components/TaskList";

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
    <>
      <TaskList />
    </>
  );
}

export default App;
