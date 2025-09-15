export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res;
}

export async function getProgressStats() {
  const res = await fetch(`${API_BASE}/progress/stats`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch progress stats');
  return res.json();
}
