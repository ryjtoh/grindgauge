package com.grindgauge.server.repository;

import com.grindgauge.server.model.Task;
import com.grindgauge.server.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByType(TaskType type);
}
