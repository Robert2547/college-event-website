package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.RsoEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RsoEventRepository extends JpaRepository<RsoEvent, Long> {


}
