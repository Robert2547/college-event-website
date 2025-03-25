package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.PrivateEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrivateEventRepository extends JpaRepository<PrivateEvent, Long> {
    // Find private events by admin
    List<PrivateEvent> findByAdminId(Long adminId);
}
