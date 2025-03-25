package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.Event;
import edu.ucf.college_event_website.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
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

    // TODO: query to find all events a user can access

}
