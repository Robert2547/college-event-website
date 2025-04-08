package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.model.Rso;
import edu.ucf.college_event_website.model.RsoMembership;
import edu.ucf.college_event_website.service.RsoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RsoController {

    @Autowired
    private RsoService rsoService;

    // Get all RSOs
    @GetMapping("/rsos")
    public ResponseEntity<List<Rso>> getAllRsos() {
        return ResponseEntity.ok(rsoService.getAllRsos());
    }

    // Get RSOs administered by current user
    @GetMapping("/admin/rsos")
    public ResponseEntity<List<Rso>> getMyRsos() {
        return ResponseEntity.ok(rsoService.getRsosByCurrentAdmin());
    }

    // Get RSO by ID
    @GetMapping("/rsos/{id}")
    public ResponseEntity<Rso> getRsoById(@PathVariable Long id) {
        return ResponseEntity.ok(rsoService.getRsoById(id));
    }

    // Create new RSO (Admin only)
    @PostMapping("/admin/rsos")
    public ResponseEntity<Rso> createRso(@RequestBody Rso rso) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rsoService.createRso(rso));
    }

    // Update RSO (Admin only)
    @PutMapping("/admin/rsos/{id}")
    public ResponseEntity<Rso> updateRso(
            @PathVariable Long id,
            @RequestBody Rso rso
    ) {
        return ResponseEntity.ok(rsoService.updateRso(id, rso));
    }

    // Delete RSO (Admin only)
    @DeleteMapping("/admin/rsos/{id}")
    public ResponseEntity<Void> deleteRso(@PathVariable Long id) {
        rsoService.deleteRso(id);
        return ResponseEntity.noContent().build();
    }

    // Get RSO members
    @GetMapping("/rsos/{id}/members")
    public ResponseEntity<List<RsoMembership>> getRsoMembers(@PathVariable Long id) {
        return ResponseEntity.ok(rsoService.getRsoMembers(id));
    }

    // Join RSO
    @PostMapping("/rsos/{id}/join")
    public ResponseEntity<Void> joinRso(@PathVariable Long id) {
        rsoService.joinRso(id);
        return ResponseEntity.ok().build();
    }

    // Leave RSO
    @DeleteMapping("/rsos/{id}/leave")
    public ResponseEntity<Void> leaveRso(@PathVariable Long id) {
        rsoService.leaveRso(id);
        return ResponseEntity.ok().build();
    }
}