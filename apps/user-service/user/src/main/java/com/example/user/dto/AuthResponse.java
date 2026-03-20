package com.example.user.dto;

import com.example.user.model.Role;

public class AuthResponse {
    private String token;
    private String userId;
    private String fullName;
    private String email;
    private Role role;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String fullName, String email, Role role) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}