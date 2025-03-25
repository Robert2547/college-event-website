package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.Rating;
import edu.ucf.college_event_website.model.RatingKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, RatingKey> {
    // calculate the average rating
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.event.id = :eventId")
    Double calculateAverageRating(@Param("eventId") Long eventId);

    // Check if a user has already rated an event
    boolean existsByUserIdAndEventId(Long userId, Long eventId);


}
