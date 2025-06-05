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
import com.naturegrain.entity.Product;
import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateOrderDetailRequest;
import com.naturegrain.model.request.CreateOrderRequest;
import com.naturegrain.repository.OrderDetailRepository;
import com.naturegrain.repository.OrderRepository;
import com.naturegrain.repository.ProductRepository;
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
    private EntityManager entityManager;    @Autowired
    private ProductRepository productRepository;
      @Override
    @Transactional
    public Order placeOrder(CreateOrderRequest request) {
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
            
            // Link to the product entity
            if(rq.getProductId() != null) {
                Product product = productRepository.findById(rq.getProductId())
                    .orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + rq.getProductId()));
                orderDetail.setProduct(product);
            }
            
            totalPrice += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
        }
        
        // Update the total price and save the order again
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
        
        // Đảm bảo tất cả thay đổi được lưu và session được flush
        entityManager.flush();
        
        return order;
    }@Override
    @Transactional(readOnly = true)
    public List<Order> getList() {
        List<Order> orders = orderRepository.findAll(Sort.by("id").descending());
        
        // Ensure product relationships are loaded for all order details
        for (Order order : orders) {
            for (OrderDetail detail : order.getOrderDetails()) {
                if (detail.getProduct() != null) {
                    // Trigger loading of product data
                    detail.getProduct().getName();
                }
            }
        }
        
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

    @Override
    @Transactional
    public OrderDetail associateProductWithOrderDetail(Long orderDetailId, Long productId) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailId)
            .orElseThrow(() -> new NotFoundException("Not Found OrderDetail With ID: " + orderDetailId));
            
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new NotFoundException("Not Found Product With ID: " + productId));
            
        orderDetail.setProduct(product);
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    @Transactional
    public int updateOrderDetailsWithProductReferences() {
        int updatedCount = 0;
        
        // Get all order details without product associations
        List<OrderDetail> detailsWithoutProduct = orderDetailRepository.findAll()
            .stream()
            .filter(detail -> detail.getProduct() == null && detail.getName() != null && !detail.getName().isEmpty())
            .toList();
            
        for (OrderDetail detail : detailsWithoutProduct) {
            // Try to find matching product by name
            List<Product> matchingProducts = productRepository.searchProduct(detail.getName());
            if (!matchingProducts.isEmpty()) {
                // Use the first matching product
                detail.setProduct(matchingProducts.get(0));
                orderDetailRepository.save(detail);
                updatedCount++;
            }
        }
        
        return updatedCount;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new NotFoundException("Not Found Order With Id: " + orderId));
            
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
