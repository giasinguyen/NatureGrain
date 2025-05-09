package com.naturegrain.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.naturegrain.entity.Order;
import com.naturegrain.entity.OrderDetail;
import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateOrderDetailRequest;
import com.naturegrain.model.request.CreateOrderRequest;
import com.naturegrain.repository.OrderDetailRepository;
import com.naturegrain.repository.OrderRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void placeOrder(CreateOrderRequest request) {
        // Create the order
        Order order = new Order();
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new NotFoundException("Not Found User With Username:" + request.getUsername()));
        
        // Set basic order information
        order.setFirstname(request.getFirstname());
        order.setLastname(request.getLastname());
        order.setCountry(request.getCountry());
        order.setAddress(request.getAddress());
        order.setTown(request.getTown());
        order.setState(request.getState());
        order.setPostCode(request.getPostCode());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote());
        order.setUser(user);
        order.setStatus("PENDING");
        
        // Save the order first to generate an ID
        orderRepository.save(order);
        
        // Process order details
        long totalPrice = 0;
        for(CreateOrderDetailRequest rq: request.getOrderDetails()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setName(rq.getName());
            orderDetail.setPrice(rq.getPrice());
            orderDetail.setQuantity(rq.getQuantity());
            orderDetail.setSubTotal(rq.getPrice() * rq.getQuantity());
            orderDetail.setOrder(order);
            totalPrice += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
        }
        
        // Update the total price and save the order again
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
        
        // Đảm bảo tất cả thay đổi được lưu và session được flush
        entityManager.flush();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getList() {
        List<Order> orders = orderRepository.findAll(Sort.by("id").descending());
        
        // Khởi tạo lazy collections để tránh Hibernate collection warnings và tránh lỗi LazyInitializationException
        for (Order order : orders) {
            Hibernate.initialize(order.getOrderDetails());
            Hibernate.initialize(order.getUser());
        }
        
        return orders;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrderByUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NotFoundException("Not Found User With Username:" + username));

        List<Order> orders = orderRepository.getOrderByUser(user.getId());
        
        // Khởi tạo lazy collections để tránh Hibernate collection warnings
        for (Order order : orders) {
            Hibernate.initialize(order.getOrderDetails());
        }
        
        return orders;  
    }
}
