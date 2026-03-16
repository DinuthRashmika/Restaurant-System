package com.example.menu.service;

import com.example.menu.dto.MenuItemRequest;
import com.example.menu.dto.UpdateMenuItemRequest;
import com.example.menu.model.MenuItem;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuService {

    MenuItem createMenuItem(MenuItemRequest request, MultipartFile image);

    List<MenuItem> getAllMenuItems();

    MenuItem getMenuItemById(String id);

    List<MenuItem> getMenuItemsByCategory(String category);

    List<MenuItem> getAvailableMenuItems();

    MenuItem updateMenuItem(String id, UpdateMenuItemRequest request, MultipartFile image);

    void deleteMenuItem(String id);
}