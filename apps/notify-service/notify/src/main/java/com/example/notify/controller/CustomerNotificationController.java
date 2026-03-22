package com.example.notify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.notify.model.Notification;
import com.example.notify.service.CustomerNotificationService;

@RestController
@RequestMapping("/api/v1/notifications/customer")
public class CustomerNotificationController {

    private final CustomerNotificationService notificationService;

    @Autowired
    public CustomerNotificationController(CustomerNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    //Order Confirmed
    @PostMapping("/order-confirmed")
    public ResponseEntity<Notification> sendOrderConfirmationNotification(@RequestBody Notification notification){
        Notification savedNotification = notificationService.sendOrderConfirmNotification(notification);
        return ResponseEntity.ok(savedNotification);
    }

    //Order Delivered 
    @PostMapping("/order-finished")
    public ResponseEntity<Notification> sendOrderFinishedNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationService.sendOrderFinishedNotification(notification);
        return ResponseEntity.ok(savedNotification); 
    }

    //Payment Successful
    @PostMapping("/payment-success")
    public ResponseEntity<Notification> sendPaymentSuccessNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationService.sendPaymentSuccessNotification(notification);
        return ResponseEntity.ok(savedNotification); 
    }

}
