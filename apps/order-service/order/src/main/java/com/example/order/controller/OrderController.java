package com.example.order.controller;

import com.example.order.dto.ApiResponse;
import com.example.order.dto.CreateOrderRequest;
import com.example.order.dto.UpdateOrderStatusRequest;
import com.example.order.model.Order;
import com.example.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order createdOrder = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", createdOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByCustomerId(@PathVariable String customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved successfully", orders));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        Order updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updatedOrder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
    }
}