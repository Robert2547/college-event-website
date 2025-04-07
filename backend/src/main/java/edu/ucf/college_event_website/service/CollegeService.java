package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.CollegeRequest;
import edu.ucf.college_event_website.dto.CollegeResponse;
import edu.ucf.college_event_website.model.*;
import edu.ucf.college_event_website.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RsoRepository rsoRepository;

    @Autowired
    private RsoEventRepository rsoEventRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PublicEventRepository publicEventRepository;

    @Autowired
    private PrivateEventRepository privateEventRepository;

    @Autowired
    private RsoMembershipRepository rsoMembershipRepository;


    // Helper methods to convert College entity to DTO
    private CollegeResponse convertToDTO(College college) {
        CollegeResponse collegeResponse = new CollegeResponse();
        collegeResponse.setId(college.getId());
        collegeResponse.setName(college.getName());
        collegeResponse.setLocation(college.getLocation());
        collegeResponse.setDescription(college.getDescription());
        collegeResponse.setCreatedBy(college.getCreatedBy().getFirstName() + " " +college.getCreatedBy().getLastName());
        return collegeResponse;
    }

    // Helper method to check if user is authenticated & Super Admin
    private User getAuthenticatedAndSuperAdmin() throws AccessDeniedException {
        // Get authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByEmail(email);

        // Check if user exists
        if(currentUserOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = currentUserOptional.get();

        // Check if user is a super admin
        if(!user.getRole().equals(Role.SUPER_ADMIN))
        {
            throw new AccessDeniedException("Only Super Admins can create colleges");
        }

        return user;
    }

    // Create a new college (Super Admin ONLY)
    public CollegeResponse createCollege(CollegeRequest collegeRequest) throws AccessDeniedException {
        // Get user that is auth and super_admin
        User currentUser = getAuthenticatedAndSuperAdmin();

        // Create new college
        College college = new College();
        college.setName(collegeRequest.getName());
        college.setLocation(collegeRequest.getLocation());
        college.setDescription(collegeRequest.getDescription());
        college.setCreatedBy(currentUser);

        // Save college to database
        College savedCollege = collegeRepository.save(college);

        // Convert to DTO and return
        return convertToDTO(savedCollege);


    };

    // Get all colleges
    public List<CollegeResponse> getAllColleges() {
        return collegeRepository.findAll().stream()
                .map(this::convertToDTO) // Loop and convert each item
                .collect(Collectors.toList()); // Get a new list
    }

    // Get college by ID
    public CollegeResponse getCollegeById(Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        return convertToDTO(college);
    }

    // Update college (Super Admin ONLY)
    public CollegeResponse updateCollege(Long id, CollegeRequest collegeRequest) throws AccessDeniedException {
        // Get user that is auth and super_admin
        User currentUser = getAuthenticatedAndSuperAdmin();

        // Find college
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        // Update fields
        college.setName(collegeRequest.getName());
        college.setLocation(collegeRequest.getLocation());
        college.setDescription(collegeRequest.getDescription());

        // Save to database
        College updatedCollege = collegeRepository.save(college);

        // Convert to DTO and return
        return convertToDTO(updatedCollege);
    }

    // Delete college (Super Admin ONLY)
    @Transactional
    public void deleteCollege(Long id) throws AccessDeniedException {
        // Get authenticated user
        User currentUser = getAuthenticatedAndSuperAdmin();

        // Find college
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        // 1. First handle RSO events since they depend on RSOs
        List<Rso> rsos = rsoRepository.findByCollegeId(id);
        for (Rso rso : rsos) {
            // Get all RSO events
            List<RsoEvent> rsoEvents = rsoEventRepository.findByRsoId(rso.getId());
            for (RsoEvent rsoEvent : rsoEvents) {
                // Delete comments for this event
                commentRepository.deleteByEventId(rsoEvent.getEvent().getId());

                // Delete ratings for this event
                ratingRepository.deleteByEventId(rsoEvent.getEvent().getId());

                // Delete RSO event
                rsoEventRepository.deleteById(rsoEvent.getId());

                // Delete base event
                eventRepository.deleteById(rsoEvent.getEvent().getId());
            }

            // Delete RSO memberships
            rsoMembershipRepository.deleteByRsoId(rso.getId());

            // Delete RSO
            rsoRepository.delete(rso);
        }

        // 2. Handle all other events (public and private)
        List<Event> events = eventRepository.findByCollegeId(id);
        for (Event event : events) {
            // Skip RSO events (already handled)
            if (event.getEventType() == EventType.RSO) {
                continue;
            }

            // Delete comments
            commentRepository.deleteByEventId(event.getId());

            // Delete ratings
            ratingRepository.deleteByEventId(event.getId());

            // Delete specific event type
            if (event.getEventType() == EventType.PUBLIC) {
                publicEventRepository.deleteById(event.getId());
            } else if (event.getEventType() == EventType.PRIVATE) {
                privateEventRepository.deleteById(event.getId());
            }

            // Delete base event
            eventRepository.delete(event);
        }

        // 3. Handle users (set college to null if needed)
        List<User> users = userRepository.findByCollegeId(id);
        for (User user : users) {
            // Set college to null instead of deleting users
            user.setCollege(null);
            userRepository.save(user);
        }

        // 4. Finally delete the college
        collegeRepository.delete(college);
    }



}
