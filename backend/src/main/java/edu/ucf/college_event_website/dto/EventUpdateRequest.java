package edu.ucf.college_event_website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EventUpdateRequest {
    private String name;
    private String description;
    private LocalTime time;
    private LocalDate date;
    private Long locationId;
    private String contactPhone;
    private String contactEmail;
}
