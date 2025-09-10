export const API_BASE = "http://localhost:8080";

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteTask(id) {
  return fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
}
