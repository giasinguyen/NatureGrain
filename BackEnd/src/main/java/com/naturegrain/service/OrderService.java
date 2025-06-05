package com.naturegrain.service;

import java.util.List;

import com.naturegrain.entity.Order;
import com.naturegrain.entity.OrderDetail;
import com.naturegrain.model.request.CreateOrderRequest;

public interface OrderService {
    
    Order placeOrder(CreateOrderRequest request);

    List<Order> getList();
    
    List<Order> getOrderByUser(String username);
    
    /**
     * Adds a product association to an existing OrderDetail
     * 
     * @param orderDetailId The ID of the OrderDetail to update
     * @param productId The ID of the Product to associate
     * @return The updated OrderDetail
     */
    OrderDetail associateProductWithOrderDetail(Long orderDetailId, Long productId);
    
    /**
     * Updates all OrderDetail entries that have a product name matching a Product entity
     * but don't have a Product reference yet
     * 
     * @return The number of updated OrderDetail records
     */
    int updateOrderDetailsWithProductReferences();
    
    /**
     * Updates the status of an order
     * 
     * @param orderId The ID of the order to update
     * @param status The new status for the order
     * @return The updated Order
     */
    Order updateOrderStatus(Long orderId, String status);
}
