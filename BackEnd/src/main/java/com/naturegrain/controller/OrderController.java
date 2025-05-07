package com.naturegrain.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.Order;
import com.naturegrain.model.request.CreateOrderRequest;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.OrderRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*",maxAge = 3600)
public class OrderController {
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    // Add this endpoint to handle direct requests to /api/order
    @GetMapping
    @Operation(summary="Lấy ra danh sách đặt hàng của người dùng đang đăng nhập")
    public ResponseEntity<List<Order>> getOrders(){
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<Order> list = orderService.getOrderByUser(userDetails.getUsername());
            return ResponseEntity.ok(list);
        }
        
        // Return empty list if not authenticated (will be handled by security)
        return ResponseEntity.ok(List.of());
    }

    // Existing endpoints with the trailing slash
    @GetMapping("/")
    @Operation(summary="Lấy ra danh sách đặt hàng")
    public ResponseEntity<List<Order>> getList(){
        List<Order> list = orderService.getList();
        return ResponseEntity.ok(list);
    }

    // Add endpoint to get order by ID
    @GetMapping("/{id}")
    @Operation(summary="Lấy thông tin chi tiết đơn hàng theo ID")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id){
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add endpoint to cancel an order
    @PutMapping("/{id}/cancel")
    @Operation(summary="Hủy đơn hàng")
    public ResponseEntity<?> cancelOrder(@PathVariable("id") Long id){
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            // Only allow cancellation if order is in PENDING state
            if ("PENDING".equals(order.getStatus())) {
                order.setStatus("CANCELLED");
                orderRepository.save(order);
                return ResponseEntity.ok(new MessageResponse("Order cancelled successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Cannot cancel order that is not in PENDING state"));
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user")
    @Operation(summary="Lấy ra danh sách đặt hàng của người dùng bằng username")
    public ResponseEntity<List<Order>> getListByUser(@RequestParam("username") String username){
        List<Order> list = orderService.getOrderByUser(username);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/create")
    @Operation(summary="Đặt hàng sản phẩm")
    public ResponseEntity<?> placeOrder(@RequestBody CreateOrderRequest request){
        orderService.placeOrder(request);
        return ResponseEntity.ok(new MessageResponse("Order Placed Successfully!"));
    }
}
