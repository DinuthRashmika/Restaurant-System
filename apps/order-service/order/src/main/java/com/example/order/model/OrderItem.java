package com.example.order.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderItem {

    @NotBlank(message = "Menu item ID is required")
    private String menuItemId;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Double unitPrice;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public OrderItem() {
    }

    public OrderItem(String menuItemId, String itemName, Double unitPrice, Integer quantity) {
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public Double getSubTotal() {
        return unitPrice * quantity;
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}