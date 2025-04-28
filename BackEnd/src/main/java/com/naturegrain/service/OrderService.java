package com.naturegrain.service;

import java.util.List;

import com.naturegrain.entity.Order;
import com.naturegrain.model.request.CreateOrderRequest;

public interface OrderService {
    
    void placeOrder(CreateOrderRequest request);

    List<Order> getList();
    
    List<Order> getOrderByUser(String username);
}
