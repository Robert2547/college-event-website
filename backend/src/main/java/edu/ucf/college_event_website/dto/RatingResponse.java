package edu.ucf.college_event_website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long eventId;
    private Double averageRating;
    private Integer totalRatings;
}

