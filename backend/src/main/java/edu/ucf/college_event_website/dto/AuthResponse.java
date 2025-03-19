package edu.ucf.college_event_website.dto;

import lombok.Getter;

@Getter
public class AuthResponse {
    private String token;
    private String email;
    private Long userId;

    public AuthResponse(String token, String email, Long userId) {
        this.token = token;
        this.email = email;
        this.userId = userId;
    }
}
