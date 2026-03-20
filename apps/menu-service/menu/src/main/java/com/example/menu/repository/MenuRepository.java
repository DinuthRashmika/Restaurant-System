package com.example.menu.repository;

import com.example.menu.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuRepository extends MongoRepository<MenuItem, String> {

    List<MenuItem> findByCategoryIgnoreCase(String category);

    List<MenuItem> findByAvailableTrue();
}