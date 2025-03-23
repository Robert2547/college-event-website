package edu.ucf.college_event_website.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RsoMembershipKey implements Serializable {
    // Used to generate unique key (user_id, rso_id)

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "rso_id")
    private Long rsoId;
}