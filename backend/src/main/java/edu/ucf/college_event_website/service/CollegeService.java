package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.CollegeRequest;
import edu.ucf.college_event_website.dto.CollegeResponse;
import edu.ucf.college_event_website.model.College;
import edu.ucf.college_event_website.model.Role;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.CollegeRepository;
import edu.ucf.college_event_website.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public void deleteCollege(Long id) throws AccessDeniedException {
        /// Get user that is auth and super_admin
        User currentUser = getAuthenticatedAndSuperAdmin();

        // Find college
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        // Delete college
        collegeRepository.delete(college);
    }



}
