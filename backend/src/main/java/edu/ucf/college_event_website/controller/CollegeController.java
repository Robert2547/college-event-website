package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.CollegeRequest;
import edu.ucf.college_event_website.dto.CollegeResponse;
import edu.ucf.college_event_website.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {
    @Autowired
    private CollegeService collegeService;

    // Get all colleges
    @GetMapping
    public ResponseEntity<List<CollegeResponse>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    // Get college by ID
    @GetMapping("/{id}")
    public ResponseEntity<CollegeResponse> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

}
