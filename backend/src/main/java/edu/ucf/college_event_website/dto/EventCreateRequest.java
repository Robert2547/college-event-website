package edu.ucf.college_event_website.dto;

import edu.ucf.college_event_website.model.EventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;


@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@SuperBuilder
public class EventCreateRequest extends EventUpdateRequest {
    private Long collegeId;
    private EventType eventType;

    // Fields for specific event types
    private Long rsoId;          // For RSO events
    private Long superAdminId;   // For public events
    private Long adminId;        // For private events
}