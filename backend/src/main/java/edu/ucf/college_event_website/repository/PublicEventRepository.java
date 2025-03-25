package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.PublicEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicEventRepository extends JpaRepository<PublicEvent, Long> {
    // Find pending approval events
    List<PublicEvent> findByApproved(Boolean approved);

    // Find events approved by a specific admin
    List<PublicEvent> findBySuperAdminId(Long adminId);
}
