package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.RatingRequest;
import edu.ucf.college_event_website.dto.RatingResponse;
import edu.ucf.college_event_website.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events/{eventId}/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // Rate an event
    @PostMapping
    public ResponseEntity<RatingResponse> rateEvent(
            @PathVariable Long eventId,
            @RequestBody RatingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.rateEvent(eventId, request));
    }

    // Get average rating for an event
    @GetMapping
    public ResponseEntity<RatingResponse> getEventRating(@PathVariable Long eventId) {
        return ResponseEntity.ok(ratingService.getEventRating(eventId));
    }
}