package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.CollegeRequest;
import edu.ucf.college_event_website.dto.CollegeResponse;
import edu.ucf.college_event_website.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/superadmin/colleges")
public class SuperAdminCollegeController {

    @Autowired
    private CollegeService collegeService;

    // Create a new college (Super Admin Only)
    @PostMapping
    public ResponseEntity<CollegeResponse> createCollege(@RequestBody CollegeRequest collegeRequest) throws AccessDeniedException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collegeService.createCollege(collegeRequest));
    }

    // Update college (Super Admin ONLY)
    @PutMapping("/{id}")
    public ResponseEntity<CollegeResponse> updateCollege(@PathVariable Long id, @RequestBody CollegeRequest collegeRequest) throws AccessDeniedException {
        return ResponseEntity.ok(collegeService.updateCollege(id, collegeRequest));
    }

    // Delete college (Super Admin ONLY)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) throws AccessDeniedException {
        collegeService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }
}
