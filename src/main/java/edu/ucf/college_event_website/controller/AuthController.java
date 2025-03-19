package edu.ucf.college_event_website.controller;

import edu.ucf.college_event_website.dto.AuthResponse;
import edu.ucf.college_event_website.dto.LoginRequest;
import edu.ucf.college_event_website.dto.SignupRequest;
import edu.ucf.college_event_website.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest){
        AuthResponse authResponse = authService.registerUser(signupRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        AuthResponse authResponse = authService.loginUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
}
