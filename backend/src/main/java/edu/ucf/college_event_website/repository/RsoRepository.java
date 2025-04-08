package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.Rso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface RsoRepository extends JpaRepository<Rso, Long> {

    List<Rso> findByCollegeId(Long id);

    List<Rso> findByAdminId(Long id);
}
