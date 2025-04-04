package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.Event;
import edu.ucf.college_event_website.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events by college ID
    List<Event> findByCollegeId(Long collegeId);

    // Find events by type
    List<Event> findByEventType(EventType eventType);

    // Find events by creators
    List<Event> findByCreatedById(Long createdById);

    // Find events by date range
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Query to find all events a user can access
    // This query assumes that the user has access to events based on their role and college memberships.
    @Query("SELECT e FROM Event e WHERE " +
            "e.eventType = edu.ucf.college_event_website.model.EventType.PUBLIC " +
            "OR (e.eventType = edu.ucf.college_event_website.model.EventType.PRIVATE AND e.college.id = :collegeId) " +
            "OR (e.eventType = edu.ucf.college_event_website.model.EventType.RSO AND e.id IN " +
            "    (SELECT re.event.id FROM RsoEvent re WHERE re.rso.id IN " +
            "        (SELECT rm.rso.id FROM RsoMembership rm WHERE rm.user.id = :userId)))")
    List<Event> findAccessibleEvents(@Param("userId") Long userId, @Param("collegeId") Long collegeId);

}
