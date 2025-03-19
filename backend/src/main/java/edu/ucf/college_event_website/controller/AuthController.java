package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.AuthResponse;
import edu.ucf.college_event_website.dto.LoginRequest;
import edu.ucf.college_event_website.dto.SignupRequest;
import edu.ucf.college_event_website.dto.TokenVerificationRequest;
import edu.ucf.college_event_website.model.User;
import edu.ucf.college_event_website.repository.UserRepository;
import edu.ucf.college_event_website.service.AuthService;
import edu.ucf.college_event_website.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// Handles user registration, login, and token verification
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        AuthResponse authResponse = authService.registerUser(signupRequest);
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.loginUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody TokenVerificationRequest request) {
        String token = request.getToken();

        // Check if token is valid
        if (authService.validateToken(token)) {
            // Extract user email from token
            String email = jwtUtil.extractUsername(token);

            // Get user details from database
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create response with user details
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        }

        // Return unauthorized if token is invalid
        return ResponseEntity.status(401).body("Invalid or expired token");
    }
}