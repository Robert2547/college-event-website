package edu.ucf.college_event_website.dto;

import lombok.Data;

@Data
public class RsoResponse {
    private Long id;
    private String name;
    private String description;
    private Long collegeId;
    private String collegeName;
    private Long adminId;
    private String adminName;
}
