package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.CommentRequest;
import edu.ucf.college_event_website.dto.CommentResponse;
import edu.ucf.college_event_website.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get all comments for an event
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getEventComments(@PathVariable Long eventId) {
        return ResponseEntity.ok(commentService.getCommentsByEventId(eventId));
    }

    // Add a comment to an event
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long eventId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(eventId, request));
    }

    // Update a comment (if user is owner)
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long eventId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request));
    }

    // Delete a comment (if user is owner)
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long eventId,
            @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}