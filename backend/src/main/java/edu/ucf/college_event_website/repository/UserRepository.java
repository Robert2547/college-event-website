package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.college WHERE u.email = :email")
    Optional<User> findByEmailWithCollege(@Param("email") String email);

    Boolean existsByEmail(String email);

    List<User> findByCollegeId(Long id);
}
