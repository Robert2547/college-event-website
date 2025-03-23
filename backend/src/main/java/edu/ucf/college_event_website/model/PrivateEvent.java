package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a private event that is only visible to students at the host university.
 * This is a subtype of Event
 */
@Entity
@Table(name = "private_events")
@Getter
@Setter
public class PrivateEvent {

    // Primary key that matches the parent event's ID
    @Id
    @Column(name = "event_id")
    private Long id;

    // One-to-one relationship with parent Event, sharing the same ID
    @OneToOne
    @MapsId
    @JoinColumn(name = "event_id")
    private Event event;

    // Admin who created this private event
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;
}