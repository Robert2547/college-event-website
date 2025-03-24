package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByName(String name);

    List<College> findByLocation(String location);

    List<College> findByCreatedById(Long createdById);
}
