package edu.ucf.college_event_website.util;

import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserRepository userRepository;

    public SecurityUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Gets the currently authenticated user from the security context
     * return The authenticated user entity
     */
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Checks if the provided user ID matches the current authenticated user
     * return true if it matches, false otherwise
     */
    public boolean isCurrentUser(Long userId) {
        User currentUser = getCurrentUser();
        return currentUser.getId().equals(userId);
    }

    /**
     * Checks if the current user has the specified role
     * return true if the user has the role, false otherwise
     */
    public boolean hasRole(String role) {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }

    /**
     * Checks if the current user is an administrator (ADMIN or SUPER_ADMIN)
        return true if the user is an admin, false otherwise
     */
    public boolean isAdmin() {
        return hasRole("ADMIN") || hasRole("SUPER_ADMIN");
    }

    /**
     * Checks if the current user is a super administrator
        return true if the user is a super admin, false otherwise
     */
    public boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }
}