package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a rating (1-5 stars) that a user gives to an event.
 * Uses a composite primary key to ensure a user can only rate an event once.
 */
@Entity
@Table(name = "ratings")
@Getter
@Setter
public class Rating {

    // Composite primary key using the embeddable RatingKey class
    @EmbeddedId
    private RatingKey id;

    // Many-to-one relationship with User, mapped to userId in the composite key
    @ManyToOne
    @MapsId("userId") // Maps this relationship to the userId field in RatingKey
    @JoinColumn(name = "user_id")
    private User user;

    // Many-to-one relationship with Event, mapped to eventId in the composite key
    @ManyToOne
    @MapsId("eventId") // Maps this relationship to the eventId field in RatingKey
    @JoinColumn(name = "event_id")
    private Event event;

    // The actual rating value (1-5 stars)
    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;
}