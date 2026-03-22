package com.example.notify.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.notify.model.Notification;
import com.example.notify.repository.NotificationRepository;
import com.example.notify.service.notification_services.EmailService;
import com.example.notify.service.notification_services.SMSService;

@Service
public class CustomerNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerNotificationService.class); 
    public final NotificationRepository notificationRepository;
    private EmailService emailService;
    private SMSService smsService;

    @Autowired
    public CustomerNotificationService(NotificationRepository notificationRepository, EmailService emailService, SMSService smsService) {
        this.notificationRepository = notificationRepository;
        this.smsService = smsService;
        this.emailService = emailService;
    }

    //Order Confirmation notification - Customer
    public Notification sendOrderConfirmNotification(Notification notification){
        notification.setTitle("Order Confirmed in OrderID " + notification.getOrderId());
        notification.setMessage("Your order " + notification.getOrderId() +" has been confirmed successfully!!");
        notification.setNotificationType("ORDER_CONFIRMED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            //EMAIL
            if (notification.isSendEmail()) {  

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToCustomer(
                    notification.getRecipientEmail(),   //Recipient email
                    "Order Confirmed in OrderID " + notification.getOrderId(), //Real email - Subject
                    "Your order " + notification.getOrderId() +" has been confirmed successfully!", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            //SMS
            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Hello Customer!\nYour order is on the way!\nOrder " + notification.getOrderId() +  " has been confirmed successfully!\n\nUber Eats Team ");

                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send order confirm notifications", e);
        }

        return notificationRepository.save(notification);
    }


    //Order Finished notification - Customer
    public Notification sendOrderFinishedNotification(Notification notification){
        notification.setTitle("Order Finished - OrderID " + notification.getOrderId());
        notification.setMessage("Your order " + notification.getOrderId() + " has been finished successfully!!");
        notification.setNotificationType("ORDER_FINISHED");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending finished confirmation email to " + notification.getRecipientEmail());

                emailService.sendEmailToCustomer(
                    notification.getRecipientEmail(),   // Recipient email
                    "Order Finished - OrderID " + notification.getOrderId(), // Subject
                    "Your order " + notification.getOrderId() + " has been finished successfully!", // Body
                    notification.getOrderId() // Order ID
                );
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Your order " + notification.getOrderId() + " has been finished successfully! Our staff is waiting for you to pick up!");
                
            }

        } catch (Exception e) {
            System.out.println(e.getMessage()); 
            logger.error("Logger - Failed to send order finished notifications", e);
        }

        return notificationRepository.save(notification);
    }


    //Payment Success notification - Customer
    public Notification sendPaymentSuccessNotification(Notification notification) {
        notification.setTitle("Payment Successful for Order ID " + notification.getOrderId() + "!");
        notification.setMessage("We’ve received your payment successfully. Thank you for your purchase with Our Ordering App!");
        notification.setNotificationType("PAYMENT_SUCCESS");
        notification.setTimestamp(LocalDateTime.now());

        try {
            if (notification.isSendEmail()) {

                logger.info("Logger - Sending email to " + notification.getRecipientEmail() + " :loggers");
                emailService.sendEmailToCustomer(
                    notification.getRecipientEmail(),   //Recipient email
                    "Payment Successful for Order ID " + notification.getOrderId() + "!", //Real email - Subject
                    "We’ve received your payment successfully. Thank you for your purchase with Our Ordering App!", //Real email - Body
                    notification.getOrderId() //Order ID
                ); 
            }

            if(notification.isSendSMS()){  

                logger.info("Logger - Sending SMS to " + notification.getRecipientPhone() + " :loggers");
                smsService.sendSMS(
                    notification.getRecipientPhone(), 
                    "Hello Customer! We’ve received your payment successfully for OrderID - "+ notification.getOrderId() +" .Thank you for your purchase with Our Ordering App!");
                
            }

            
        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error("Logger - Failed to send payment successful customer email", e);
        }

        return notificationRepository.save(notification);
    }


}
