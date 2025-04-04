package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.EventCreateRequest;
import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.model.EventType;
import edu.ucf.college_event_website.service.EventService;
import edu.ucf.college_event_website.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsos/{rsoId}/events")
public class RsoEventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private SecurityUtils securityUtils;

    // Get all events for a specific RSO
    @GetMapping
    public ResponseEntity<List<EventResponse>> getRsoEvents(@PathVariable Long rsoId) {
        return ResponseEntity.ok(eventService.getEventsByRso(rsoId));
    }

    // Create a new RSO event (Admin only)
    @PostMapping
    public ResponseEntity<EventResponse> createRsoEvent(
            @PathVariable Long rsoId,
            @RequestBody EventCreateRequest request) {
        // Check if user is an admin or super admin
        if (!securityUtils.hasRole("ADMIN") && !securityUtils.hasRole("SUPER_ADMIN")) {
            throw new AccessDeniedException("Only administrators can create RSO events");
        }

        // Ensure the event type is RSO
        request.setEventType(EventType.RSO);
        request.setRsoId(rsoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }
}