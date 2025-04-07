package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.model.*;
import edu.ucf.college_event_website.repository.*;
import edu.ucf.college_event_website.util.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RsoService {

    @Autowired
    private RsoRepository rsoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private RsoMembershipRepository rsoMembershipRepository;

    @Autowired
    private SecurityUtils securityUtils;

    // Get all RSOs
    public List<Rso> getAllRsos() {
        return rsoRepository.findAll();
    }

    // Get RSOs administered by current user
    public List<Rso> getRsosByCurrentAdmin() {
        User currentUser = securityUtils.getCurrentUser();

        return rsoRepository.findByAdminId(currentUser.getId());
    }

    // Get RSO by ID
    public Rso getRsoById(Long id) {
        return rsoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));
    }

    // Create new RSO (Admin only)
    @Transactional
    public Rso createRso(Rso rso) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Verify user is an admin
        if (!securityUtils.isAdmin()) {
            throw new AccessDeniedException("Only administrators can create RSOs");
        }

        // Find college - THIS IS THE MISSING STEP
        Long collegeId = rso.getCollege() != null ? rso.getCollege().getId() : null;
        if (collegeId == null) {
            throw new IllegalArgumentException("College ID is required");
        }

        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        // Set admin and college properly
        rso.setAdmin(currentUser);
        rso.setCollege(college); // Set the full college object
        rso.setStatus(RsoStatus.ACTIVE);

        // Save RSO
        Rso savedRso = rsoRepository.save(rso);

        // Add admin as a member
        RsoMembership membership = new RsoMembership();
        RsoMembershipKey membershipKey = new RsoMembershipKey(currentUser.getId(), savedRso.getId());
        membership.setId(membershipKey);
        membership.setUser(currentUser);
        membership.setRso(savedRso);

        rsoMembershipRepository.save(membership);

        return savedRso;
    }

    // Update RSO (Admin only)
    @Transactional
    public Rso updateRso(Long id, Rso updatedRso) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find RSO
        Rso existingRso = rsoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        // Check if current user is the admin of the RSO
        if (!existingRso.getAdmin().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only the RSO admin can update this RSO");
        }

        // Update RSO fields
        existingRso.setName(updatedRso.getName());
        existingRso.setDescription(updatedRso.getDescription());

        // If college is changed, update it
        if (updatedRso.getCollege() != null) {
            College college = collegeRepository.findById(updatedRso.getCollege().getId())
                    .orElseThrow(() -> new EntityNotFoundException("College not found"));
            existingRso.setCollege(college);
        }

        // Save updated RSO
        return rsoRepository.save(existingRso);
    }

    // Delete RSO (Admin only)
    @Transactional
    public void deleteRso(Long id) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find RSO
        Rso rso = rsoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        // Check if current user is the admin of the RSO
        if (!rso.getAdmin().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only the RSO admin can delete this RSO");
        }

        // Delete all memberships first
        rsoMembershipRepository.deleteByRsoId(id);

        // Delete the RSO
        rsoRepository.delete(rso);
    }

    // Get RSO members
    public List<RsoMembership> getRsoMembers(Long rsoId) {
        // Check if RSO exists
        Rso rso = rsoRepository.findById(rsoId)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        // Get RSO members
        return rsoMembershipRepository.findByRsoId(rsoId);
    }

    // Join RSO
    @Transactional
    public void joinRso(Long rsoId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find RSO
        Rso rso = rsoRepository.findById(rsoId)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        // Check if user is already a member
        if (rsoMembershipRepository.existsByUserIdAndRsoId(currentUser.getId(), rsoId)) {
            throw new RuntimeException("You are already a member of this RSO");
        }

        // Create new membership
        RsoMembership membership = new RsoMembership();
        RsoMembershipKey membershipKey = new RsoMembershipKey(currentUser.getId(), rsoId);
        membership.setId(membershipKey);
        membership.setUser(currentUser);
        membership.setRso(rso);

        // Save membership
        rsoMembershipRepository.save(membership);
    }

    // Leave RSO
    @Transactional
    public void leaveRso(Long rsoId) {
        // Get authenticated user
        User currentUser = securityUtils.getCurrentUser();

        // Find RSO
        Rso rso = rsoRepository.findById(rsoId)
                .orElseThrow(() -> new EntityNotFoundException("RSO not found"));

        // Check if user is a member
        if (!rsoMembershipRepository.existsByUserIdAndRsoId(currentUser.getId(), rsoId)) {
            throw new RuntimeException("You are not a member of this RSO");
        }

        // Check if user is the admin
        if (rso.getAdmin().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("RSO admin cannot leave their own RSO");
        }

        // Remove membership
        rsoMembershipRepository.deleteByUserIdAndRsoId(currentUser.getId(), rsoId);
    }
}