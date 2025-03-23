package edu.ucf.college_event_website.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Embeddable composite key class for the Rating entity.
 * Combines userId and eventId to form a unique key that ensures
 * a user can only rate an event once.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingKey implements Serializable {

    // references the user
    @Column(name = "user_id")
    private Long userId;

    // references the event
    @Column(name = "event_id")
    private Long eventId;
}