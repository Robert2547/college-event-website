package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.EventCreateRequest;
import edu.ucf.college_event_website.dto.EventResponse;
import edu.ucf.college_event_website.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    // Create a new Event
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request));
    }

    // TODO: Get all events accessible to the current user
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllAccessibleEvents() {
        return ResponseEntity.ok(eventService)
    }

    // TODO: Get events by college

    // TODO: Update an event

    // TODO: Delete an event

    // TODO: Add a comment to an event

    // TODO: Get all comments to an event

    // TODO: Rate an event
}
