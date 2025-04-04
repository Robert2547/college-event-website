package edu.ucf.college_event_website.repository;

import edu.ucf.college_event_website.model.RsoMembership;
import edu.ucf.college_event_website.model.RsoMembershipKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RsoMembershipRepository extends JpaRepository<RsoMembership, RsoMembershipKey> {

    // Find all RSO memberships for a user
    List<RsoMembership> findByUserId(Long userId);

    // Find all members of an RSO
    List<RsoMembership> findByRsoId(Long rsoId);

    // Check if a user is a member of an RSO
    boolean existsByUserIdAndRsoId(Long userId, Long rsoId);

    // Count members in an RSO
    @Query("SELECT COUNT(rm) FROM RsoMembership rm WHERE rm.rso.id = :rsoId")
    int countMembersByRsoId(@Param("rsoId") Long rsoId);

    // Delete all memberships for an RSO
    void deleteByRsoId(Long rsoId);

    // Delete a specific membership
    void deleteByUserIdAndRsoId(Long userId, Long rsoId);
}