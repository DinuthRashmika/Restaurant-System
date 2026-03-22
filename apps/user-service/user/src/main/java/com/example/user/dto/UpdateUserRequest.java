package com.example.user.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateUserRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}