package com.example.order.repository;

import com.example.order.model.Order;
import com.example.order.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByCustomerId(String customerId);

    List<Order> findByStatus(OrderStatus status);
}