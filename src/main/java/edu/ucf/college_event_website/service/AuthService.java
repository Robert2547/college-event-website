package edu.ucf.college_event_website.service;

import edu.ucf.college_event_website.dto.AuthResponse;
import edu.ucf.college_event_website.dto.LoginRequest;
import edu.ucf.college_event_website.dto.SignupRequest;
import edu.ucf.college_event_website.model.Role;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse registerUser(SignupRequest signupRequest) {
        // Check if the user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole());



        // Save user to database
        User savedUser = userRepository.save(user);

        return new AuthResponse("dummy-token", savedUser.getEmail(), savedUser.getId());
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        // Perform authentication
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Set user authentication in SecurityContextHolder
        SecurityContextHolder.getContext().setAuthentication(authentication);

        //Find the user in the database
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse("dummy-token", user.getEmail(), user.getId());
    }
}
