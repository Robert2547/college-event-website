package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents an RSO event that is only visible to members of a specific RSO.
 * This is a subtype of Event
 */
@Entity
@Table(name = "rso_events")
@Getter
@Setter
public class RsoEvent {

    // Primary key that matches the parent event's ID
    @Id
    @Column(name = "event_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "event_id")
    private Event event;

    // RSO that hosts this event
    @ManyToOne
    @JoinColumn(name = "rso_id", nullable = false)
    private Rso rso;
}