package com.example.order.service;

import com.example.order.dto.CreateOrderRequest;
import com.example.order.model.Order;
import com.example.order.model.OrderStatus;

import java.util.List;

public interface OrderService {

    Order createOrder(CreateOrderRequest request);

    Order getOrderById(String id);

    List<Order> getAllOrders();

    List<Order> getOrdersByCustomerId(String customerId);

    Order updateOrderStatus(String id, OrderStatus status);

    void deleteOrder(String id);
}