package com.grindgauge.server.controller;

import com.grindgauge.server.dto.ProgressStats;
import com.grindgauge.server.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = {"http://localhost:3000", "https://ryjtoh.github.io"})
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/stats")
    public ResponseEntity<List<ProgressStats>> getProgressStats() {
        List<ProgressStats> stats = progressService.getProgressStats();
        return ResponseEntity.ok(stats);
    }
}
