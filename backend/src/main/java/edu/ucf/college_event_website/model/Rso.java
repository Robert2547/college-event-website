package edu.ucf.college_event_website.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rsos")
@Getter
@Setter
public class Rso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rso_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    @JsonManagedReference(value = "rso-college")
    private College college;

    @Enumerated(EnumType.STRING)
    @Column
    private RsoStatus status = RsoStatus.ACTIVE;
}