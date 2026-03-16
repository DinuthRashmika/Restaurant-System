package com.example.menu.controller;

import com.example.menu.dto.ApiResponse;
import com.example.menu.dto.MenuItemRequest;
import com.example.menu.dto.UpdateMenuItemRequest;
import com.example.menu.model.MenuItem;
import com.example.menu.service.MenuService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam Boolean available,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        MenuItemRequest request = new MenuItemRequest();
        request.setName(name);
        request.setDescription(description);
        request.setCategory(category);
        request.setPrice(price);
        request.setAvailable(available);

        MenuItem saved = menuService.createMenuItem(request, image);
        return ResponseEntity.ok(ApiResponse.success("Menu item created successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAllMenuItems() {
        return ResponseEntity.ok(
                ApiResponse.success("Menu items retrieved successfully", menuService.getAllMenuItems())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> getMenuItemById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Menu item retrieved successfully", menuService.getMenuItemById(id))
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(
                ApiResponse.success("Menu items by category retrieved successfully", menuService.getMenuItemsByCategory(category))
        );
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAvailableItems() {
        return ResponseEntity.ok(
                ApiResponse.success("Available menu items retrieved successfully", menuService.getAvailableMenuItems())
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double price,
            @RequestParam Boolean available,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        UpdateMenuItemRequest request = new UpdateMenuItemRequest();
        request.setName(name);
        request.setDescription(description);
        request.setCategory(category);
        request.setPrice(price);
        request.setAvailable(available);

        MenuItem updated = menuService.updateMenuItem(id, request, image);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteMenuItem(@PathVariable String id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }
}