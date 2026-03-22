package com.example.user.service.impl;

import com.example.user.dto.UpdateUserRequest;
import com.example.user.exception.ResourceNotFoundException;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(String id, UpdateUserRequest request) {
        User user = getUserById(id);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}