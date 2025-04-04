package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.EventCreateRequest;
import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.dto.EventUpdateRequest;
import edu.ucf.college_event_website.model.EventType;
import edu.ucf.college_event_website.service.EventService;
import edu.ucf.college_event_website.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private SecurityUtils securityUtils;

    // Get all events accessible to the user
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllAccessibleEvents() {
        return ResponseEntity.ok(eventService.getEventsForCurrentUser());
    }

    // Get event by ID (if user has access)
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // Create a new event (Admin only)
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventCreateRequest request) {
        // Check if user is an admin or super admin
        if (!securityUtils.hasRole("ADMIN") && !securityUtils.hasRole("SUPER_ADMIN")) {
            throw new AccessDeniedException("Only administrators can create events");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }

    // Update event (if user is owner and admin)
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @RequestBody EventUpdateRequest request) {
        // Check if user is an admin or super admin
        if (!securityUtils.hasRole("ADMIN") && !securityUtils.hasRole("SUPER_ADMIN")) {
            throw new AccessDeniedException("Only administrators can update events");
        }
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    // Delete event (if user is owner and admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        // Check if user is an admin or super admin
        if (!securityUtils.hasRole("ADMIN") && !securityUtils.hasRole("SUPER_ADMIN")) {
            throw new AccessDeniedException("Only administrators can delete events");
        }
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // Filter events by type
    @GetMapping("/filter/type/{eventType}")
    public ResponseEntity<List<EventResponse>> getEventsByType(@PathVariable EventType eventType) {
        return ResponseEntity.ok(eventService.getEventsByType(eventType));
    }

    // Filter events by college
    @GetMapping("/filter/college/{collegeId}")
    public ResponseEntity<List<EventResponse>> getEventsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(eventService.getEventsByCollege(collegeId));
    }

    // Filter events by date range
    @GetMapping("/filter/date")
    public ResponseEntity<List<EventResponse>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(startDate, endDate));
    }
}