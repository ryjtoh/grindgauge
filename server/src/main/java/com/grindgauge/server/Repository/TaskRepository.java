package com.grindgauge.server.Repository;

import com.grindgauge.server.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
