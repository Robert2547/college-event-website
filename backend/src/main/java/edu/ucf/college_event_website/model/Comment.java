package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Entity representing a user's comment on an event.
 * Stores the comment text, timestamp, and relationships to the event and user.
 */
@Entity
@Table(name = "comments")
@Getter
@Setter
public class Comment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // When the comment was created, auto-populated if null
    @Column
    private LocalDateTime timestamp;

    // Many-to-one relationship with the event being commented on
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Many-to-one relationship with the user who created the comment
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Callback method that automatically sets timestamp to current time if not provided
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}