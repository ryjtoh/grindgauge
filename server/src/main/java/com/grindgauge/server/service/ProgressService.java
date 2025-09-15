package com.grindgauge.server.service;

import com.grindgauge.server.dto.ProgressStats;
import com.grindgauge.server.model.Task;
import com.grindgauge.server.model.TaskStatus;
import com.grindgauge.server.model.TaskType;
import com.grindgauge.server.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private TaskRepository taskRepository;

    public List<ProgressStats> getProgressStats() {
        // Get main interview prep categories
        List<TaskType> interviewTypes = Arrays.asList(
            TaskType.LEETCODE,
            TaskType.SYSTEM_DESIGN,
            TaskType.PROJECT
        );

        return interviewTypes.stream()
            .map(this::calculateStatsForType)
            .collect(Collectors.toList());
    }

    private ProgressStats calculateStatsForType(TaskType taskType) {
        List<Task> allTasks = taskRepository.findByType(taskType);

        long total = allTasks.size();
        long completed = allTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.DONE)
            .count();
        long inProgress = allTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
            .count();

        return new ProgressStats(taskType, total, completed, inProgress);
    }
}
