package edu.ucf.college_event_website.dto;

import edu.ucf.college_event_website.model.College;
import edu.ucf.college_event_website.model.User;
import lombok.Getter;

@Getter
public class AuthResponse {
    private final String token;
    private final UserDto user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDto(user);
    }

    @Getter
    public static class UserDto {
        private final Long id;
        private final String email;
        private final String firstName;
        private final String lastName;
        private final String role;
        private final College college;

        public UserDto(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.role = user.getRole().name();
            this.college = user.getCollege(); // 👈 this is what you need!
        }
    }
}
