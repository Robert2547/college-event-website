package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.CommentRequest;
import edu.ucf.college_event_website.dto.CommentResponse;
import edu.ucf.college_event_website.model.Comment;
import edu.ucf.college_event_website.model.Event;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.CommentRepository;
import edu.ucf.college_event_website.repository.EventRepository;
import edu.ucf.college_event_website.util.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SecurityUtils securityUtils;

    // Convert Comment to CommentResponse
    private CommentResponse convertToDTO(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getTimestamp().toLocalDate(),
                comment.getTimestamp().toLocalTime(),
                comment.getUser().getFirstName() + " " + comment.getUser().getLastName()
        );
    }

    // Add a comment to an event
    public CommentResponse addComment(Long eventId, CommentRequest request) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Create new comment
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setEvent(event);
        comment.setUser(currentUser);
        comment.setTimestamp(LocalDateTime.now());

        // Save comment
        Comment savedComment = commentRepository.save(comment);

        // Convert to DTO and return
        return convertToDTO(savedComment);
    }

    // Get all comments for an event
    public List<CommentResponse> getCommentsByEventId(Long eventId) {
        // Find comments
        List<Comment> comments = commentRepository.findByEventIdOrderByTimestampDesc(eventId);

        // Convert to DTOs and return
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update a comment
    public CommentResponse updateComment(Long commentId, CommentRequest request) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // Check if user owns the comment or is an admin
        if (!comment.getUser().getId().equals(currentUser.getId()) &&
                !securityUtils.isSuperAdmin()) {
            throw new AccessDeniedException("You do not have permission to update this comment");
        }

        // Update comment content
        comment.setContent(request.getContent());

        // Save updated comment
        Comment updatedComment = commentRepository.save(comment);

        // Convert to DTO and return
        return convertToDTO(updatedComment);
    }

    // Delete a comment
    public void deleteComment(Long commentId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // Check if user owns the comment or is an admin
        if (!comment.getUser().getId().equals(currentUser.getId()) &&
                !securityUtils.isSuperAdmin()) {
            throw new AccessDeniedException("You do not have permission to delete this comment");
        }

        // Delete comment
        commentRepository.delete(comment);
    }
}