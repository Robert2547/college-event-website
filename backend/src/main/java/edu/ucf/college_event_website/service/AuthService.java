package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.AuthResponse;
import edu.ucf.college_event_website.dto.LoginRequest;
import edu.ucf.college_event_website.dto.SignupRequest;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.UserRepository;
import edu.ucf.college_event_website.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service handling authentication operations (signup, login, token validation)
 */
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    // Registers a new user in the system
    public AuthResponse registerUser(SignupRequest signupRequest) {
        // Check if the user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create new user object
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        // Encrypt the password before storing
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole());

        // Save user to database
        User savedUser = userRepository.save(user);

        // Create UserDetails object for token generation
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + savedUser.getRole().name()
                        )
                )
        );

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Return authentication response
        return new AuthResponse(token, savedUser.getEmail(), savedUser.getId());
    }

    // Authenticates a user and generates a JWT token
    public AuthResponse loginUser(LoginRequest loginRequest) {
        // Perform authentication using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Find the user in the database
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        // Return authentication response
        return new AuthResponse(token, user.getEmail(), user.getId());
    }

    // Validates a JWT token
    public boolean validateToken(String token) {
        try {
            // Extract username from token
            String username = jwtUtil.extractUsername(token);

            // Find user in database and create UserDetails
            UserDetails userDetails = userRepository.findByEmail(username)
                    .map(user -> new org.springframework.security.core.userdetails.User(
                            user.getEmail(),
                            user.getPassword(),
                            java.util.Collections.singletonList(
                                    new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                            "ROLE_" + user.getRole().name()
                                    )
                            )
                    ))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate token against user details
            return jwtUtil.validateToken(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
}