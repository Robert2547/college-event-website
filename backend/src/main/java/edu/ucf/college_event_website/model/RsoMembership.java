package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rso_memberships")
@Getter
@Setter
public class RsoMembership {

    // Make a composite primary key (userId, rsoId)
    @EmbeddedId
    private RsoMembershipKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("rsoId")
    @JoinColumn(name = "rso_id")
    private Rso rso;
}