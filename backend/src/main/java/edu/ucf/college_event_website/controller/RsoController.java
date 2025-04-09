package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.RsoResponse;
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
    public ResponseEntity<List<RsoResponse>> getAllRsos() {
        List<Rso> rawRsos = rsoService.getAllRsos();
        List<RsoResponse> responses = rawRsos.stream().map(this::toDto).toList();
        return ResponseEntity.ok(responses);
    }

    // Get RSOs administered by current user
    @GetMapping("/admin/rsos")
    public ResponseEntity<List<RsoResponse>> getMyRsos() {
        List<Rso> rawRsos = rsoService.getRsosByCurrentAdmin();
        List<RsoResponse> responses = rawRsos.stream().map(this::toDto).toList();
        return ResponseEntity.ok(responses);
    }

    // Get RSO by ID
    @GetMapping("/rsos/{id}")
    public ResponseEntity<RsoResponse> getRsoById(@PathVariable Long id) {
        Rso rso = rsoService.getRsoById(id);
        return ResponseEntity.ok(toDto(rso));
    }

    // Create new RSO (Admin only)
    @PostMapping("/admin/rsos")
    public ResponseEntity<RsoResponse> createRso(@RequestBody Rso rso) {
        Rso created = rsoService.createRso(rso);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(created));
    }

    // Update RSO (Admin only)
    @PutMapping("/admin/rsos/{id}")
    public ResponseEntity<RsoResponse> updateRso(
            @PathVariable Long id,
            @RequestBody Rso rso
    ) {
        Rso updated = rsoService.updateRso(id, rso);
        return ResponseEntity.ok(toDto(updated));
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

    private RsoResponse toDto(Rso rso) {
        RsoResponse dto = new RsoResponse();
        dto.setId(rso.getId());
        dto.setName(rso.getName());
        dto.setDescription(rso.getDescription());

        if (rso.getCollege() != null) {
            dto.setCollegeId(rso.getCollege().getId());
            dto.setCollegeName(rso.getCollege().getName());
        }

        if (rso.getAdmin() != null) {
            dto.setAdminId(rso.getAdmin().getId());
            dto.setAdminName(rso.getAdmin().getFirstName() + " " + rso.getAdmin().getLastName());
        }

        return dto;
    }
}
