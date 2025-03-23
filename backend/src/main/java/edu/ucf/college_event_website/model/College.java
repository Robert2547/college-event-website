package edu.ucf.college_event_website.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "colleges")
public class College {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "college_id")
    private Long id;

    @Column(nullable = false, length = 45)
    private String name;

    @Column(nullable = false, length = 45)
    private String location;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    // Many colleges can be created by one user
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
