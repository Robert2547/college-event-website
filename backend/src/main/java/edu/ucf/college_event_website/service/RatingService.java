package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.RatingRequest;
import edu.ucf.college_event_website.dto.RatingResponse;
import edu.ucf.college_event_website.model.Event;
import edu.ucf.college_event_website.model.Rating;
import edu.ucf.college_event_website.model.RatingKey;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.EventRepository;
import edu.ucf.college_event_website.repository.RatingRepository;
import edu.ucf.college_event_website.util.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SecurityUtils securityUtils;

    // Rate an event
    public RatingResponse rateEvent(Long eventId, RatingRequest request) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Create or update rating
        Rating rating = new Rating();
        RatingKey ratingKey = new RatingKey(currentUser.getId(), eventId);
        rating.setId(ratingKey);
        rating.setUser(currentUser);
        rating.setEvent(event);
        rating.setRatingValue(request.getRating());

        // Save rating
        ratingRepository.save(rating);

        // Calculate average rating
        Double averageRating = ratingRepository.calculateAverageRating(eventId);
        if (averageRating == null) averageRating = 0.0;

        // Count total ratings
        long totalRatings = ratingRepository.count();

        // Return response
        return new RatingResponse(eventId, averageRating, (int) totalRatings);
    }

    // Get event rating
    public RatingResponse getEventRating(Long eventId) {
        // Calculate average rating
        Double averageRating = ratingRepository.calculateAverageRating(eventId);
        if (averageRating == null) averageRating = 0.0;

        // Count total ratings
        long totalRatings = ratingRepository.count();

        // Return response
        return new RatingResponse(eventId, averageRating, (int) totalRatings);
    }
}