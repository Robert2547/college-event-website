package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.service.PublicEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/public-events")
public class PublicEventController {

    @Autowired
    private PublicEventService publicEventService;

    // Get all pending public events (Super Admin only)
    @GetMapping("/pending")
    public ResponseEntity<List<EventResponse>> getPendingPublicEvents() {
        return ResponseEntity.ok(publicEventService.getPendingPublicEvents());
    }

    // Approve a public event (Super Admin only)
    @PutMapping("/{eventId}/approve")
    public ResponseEntity<EventResponse> approvePublicEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(publicEventService.approvePublicEvent(eventId));
    }

    // Reject a public event (Super Admin only)
    @DeleteMapping("/{eventId}/reject")
    public ResponseEntity<Void> rejectPublicEvent(@PathVariable Long eventId) {
        publicEventService.rejectPublicEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}