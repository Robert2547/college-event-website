package edu.ucf.college_event_website.dto;

import edu.ucf.college_event_website.model.Role;
import lombok.Getter;

@Getter
public class SignupRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private Role role;
}
