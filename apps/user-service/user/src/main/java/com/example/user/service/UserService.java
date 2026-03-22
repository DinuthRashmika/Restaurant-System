package com.example.user.service;

import com.example.user.dto.UpdateUserRequest;
import com.example.user.model.User;

import java.util.List;

public interface UserService {
    User getUserById(String id);
    List<User> getAllUsers();
    User updateUser(String id, UpdateUserRequest request);
}