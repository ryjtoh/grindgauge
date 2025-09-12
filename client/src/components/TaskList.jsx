import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
}

export default TaskList;
