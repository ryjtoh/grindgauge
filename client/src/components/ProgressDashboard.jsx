import React, { useEffect, useState } from 'react';
import { getProgressStats } from '../services/api';
import './ProgressDashboard.css';

const ProgressDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getProgressStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load progress stats');
    } finally {
      setLoading(false);
    }
  };

  const getFocusAreaName = (type) => {
    const names = {
      LEETCODE: 'LeetCode Problems',
      SYSTEM_DESIGN: 'System Design',
      PROJECT: 'Projects',
    };
    return names[type] || type;
  };

  const getFocusAreaIcon = (type) => {
    const icons = {
      LEETCODE: '💻',
      SYSTEM_DESIGN: '🏗️',
      PROJECT: '🚀',
    };
    return icons[type] || '📋';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading progress stats...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="progress-dashboard">
      <h2>Your Interview Prep Progress</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.taskType} className="stat-card">
            <div className="stat-icon">{getFocusAreaIcon(stat.taskType)}</div>
            <h3>{getFocusAreaName(stat.taskType)}</h3>
            <div className="stat-numbers">
              <div className="stat-item">
                <span className="stat-value">{stat.completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stat.inProgressTasks}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stat.totalTasks}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stat.completionRate}%` }}
              />
            </div>
            <div className="completion-rate">
              {stat.completionRate.toFixed(1)}% Complete
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDashboard;
