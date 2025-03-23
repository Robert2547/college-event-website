package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a public event that is visible to everyone but requires super admin approval.
 * This is a subtype of Event
 */
@Entity
@Table(name = "public_events")
@Getter
@Setter
public class PublicEvent {

    // Primary key that matches the parent event's ID
    @Id
    @Column(name = "event_id")
    private Long id;

    // One-to-one relationship with parent Event, sharing the same ID
    @OneToOne
    @MapsId
    @JoinColumn(name = "event_id")
    private Event event;

    // Super admin who approves this public event
    @ManyToOne
    @JoinColumn(name = "super_admin_id", nullable = false)
    private User superAdmin;

    // Flag indicating whether the event has been approved
    @Column
    private Boolean approved = false;
}