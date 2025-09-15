package com.grindgauge.server.dto;

import com.grindgauge.server.model.TaskType;

public class ProgressStats {
    private TaskType taskType;
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Double completionRate;

    public ProgressStats() {}

    public ProgressStats(TaskType taskType, Long totalTasks, Long completedTasks, Long inProgressTasks) {
        this.taskType = taskType;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.completionRate = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0;
    }

    public TaskType getTaskType() { return taskType; }
    public void setTaskType(TaskType taskType) { this.taskType = taskType; }

    public Long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }

    public Long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Long completedTasks) { this.completedTasks = completedTasks; }

    public Long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(Long inProgressTasks) { this.inProgressTasks = inProgressTasks; }

    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
}
