package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find comments for a specific event
    List<Comment> findByEventIdOrderByTimestampDesc(Long eventId);
}
