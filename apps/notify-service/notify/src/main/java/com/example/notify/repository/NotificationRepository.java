package com.example.notify.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.notify.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String>{

    // Add custom queries if needed (e.g., find by recipientId)

    
}
