package com.example.user.service;

import com.example.user.dto.AuthResponse;
import com.example.user.dto.LoginRequest;
import com.example.user.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}