package edu.ucf.college_event_website.dto;

import lombok.Data;

@Data
public class CollegeResponse {
    private Long id;
    private String name;
    private String location;
    private String description;
    private String createdBy; // Combine firstName + lastName
}
