import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ProgressDashboard from "./components/ProgressDashboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="App">
      <header className="app-header">
        <h1>GrindGauge</h1>
      </header>
      <main className="app-main">
        <nav className="app-nav">
          <button
            className={`nav-button ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            My Tasks
          </button>
          <button
            className={`nav-button ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            Progress Dashboard
          </button>
        </nav>
        {activeTab === "tasks" && (
          <>
            <TaskForm />
            <TaskList />
          </>
        )}
        {activeTab === "progress" && <ProgressDashboard />}
      </main>
    </div>
  );
}

export default App;
