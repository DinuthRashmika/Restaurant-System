package com.example.menu.service.impl;

import com.example.menu.dto.MenuItemRequest;
import com.example.menu.dto.UpdateMenuItemRequest;
import com.example.menu.exception.ResourceNotFoundException;
import com.example.menu.model.MenuItem;
import com.example.menu.repository.MenuRepository;
import com.example.menu.service.FileStorageService;
import com.example.menu.service.MenuService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final FileStorageService fileStorageService;

    public MenuServiceImpl(MenuRepository menuRepository, FileStorageService fileStorageService) {
        this.menuRepository = menuRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public MenuItem createMenuItem(MenuItemRequest request, MultipartFile image) {
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setAvailable(request.getAvailable());
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            item.setImageName(fileName);
            item.setImageUrl("/menu-images/" + fileName);
        }

        return menuRepository.save(item);
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
    }

    @Override
    public MenuItem getMenuItemById(String id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + id));
    }

    @Override
    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<MenuItem> getAvailableMenuItems() {
        return menuRepository.findByAvailableTrue();
    }

    @Override
    public MenuItem updateMenuItem(String id, UpdateMenuItemRequest request, MultipartFile image) {
        MenuItem item = getMenuItemById(id);

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setAvailable(request.getAvailable());
        item.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            item.setImageName(fileName);
            item.setImageUrl("/menu-images/" + fileName);
        }

        return menuRepository.save(item);
    }

    @Override
    public void deleteMenuItem(String id) {
        MenuItem item = getMenuItemById(id);
        menuRepository.delete(item);
    }
}