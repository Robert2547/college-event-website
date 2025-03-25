package edu.ucf.college_event_website.dto;

import edu.ucf.college_event_website.model.EventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private LocalTime time;
    private LocalDate date;
    private LocationDto location;
    private String createdBy;
    private String college;
    private EventType eventType;
    private String contactPhone;
    private String contactEmail;
    private Double averageRating;
    private Integer commentCount;
    private Boolean approved;     // For public events

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDto {
        private Long id;
        private String name;
        private String address;
        private Double latitude;
        private Double longitude;
    }
}
