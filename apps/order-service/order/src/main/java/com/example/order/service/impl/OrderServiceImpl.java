package com.example.order.service.impl;

import com.example.order.dto.CreateOrderRequest;
import com.example.order.dto.OrderItemRequest;
import com.example.order.exception.ResourceNotFoundException;
import com.example.order.model.Order;
import com.example.order.model.OrderItem;
import com.example.order.model.OrderStatus;
import com.example.order.repository.OrderRepository;
import com.example.order.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(CreateOrderRequest request) {
        List<OrderItem> items = request.getItems()
                .stream()
                .map(this::mapToOrderItem)
                .collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(OrderItem::getSubTotal)
                .sum();

        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setItems(items);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setNotes(request.getNotes());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByCustomerId(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public Order updateOrderStatus(String id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(String id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    private OrderItem mapToOrderItem(OrderItemRequest request) {
        return new OrderItem(
                request.getMenuItemId(),
                request.getItemName(),
                request.getUnitPrice(),
                request.getQuantity()
        );
    }
}