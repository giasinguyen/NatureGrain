package com.naturegrain.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.Order;
import com.naturegrain.entity.Product;
import com.naturegrain.entity.User;
import com.naturegrain.repository.OrderRepository;
import com.naturegrain.repository.ProductRepository;
import com.naturegrain.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy số liệu thống kê tổng quan cho dashboard")
    public ResponseEntity<?> getDashboardStats() {
        // Get counts
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        
        // Calculate total revenue
        List<Order> orders = orderRepository.findAll();
        long totalRevenue = orders.stream().mapToLong(Order::getTotalPrice).sum();
        
        // Calculate month-over-month changes
        LocalDate today = LocalDate.now();
        LocalDate firstDayCurrentMonth = today.withDayOfMonth(1);
        LocalDate firstDayLastMonth = firstDayCurrentMonth.minusMonths(1);
        
        // Convert LocalDate to Date for JPA queries
        Date startCurrentMonth = Date.from(firstDayCurrentMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date startLastMonth = Date.from(firstDayLastMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        // Get current and previous month orders
        List<Order> currentMonthOrders = orderRepository.findByCreateAtAfter(startCurrentMonth);
        List<Order> lastMonthOrders = orderRepository.findByCreateAtBetween(startLastMonth, startCurrentMonth);
        
        // Calculate revenue for current and previous month
        long currentMonthRevenue = currentMonthOrders.stream().mapToLong(Order::getTotalPrice).sum();
        long lastMonthRevenue = lastMonthOrders.stream().mapToLong(Order::getTotalPrice).sum();
        
        // Calculate percentage changes
        int revenueChange = lastMonthRevenue > 0 ? (int)(((currentMonthRevenue - lastMonthRevenue) * 100.0) / lastMonthRevenue) : 0;
        int orderChange = lastMonthOrders.size() > 0 ? (int)(((currentMonthOrders.size() - lastMonthOrders.size()) * 100.0) / lastMonthOrders.size()) : 0;
        
        // Create response map
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("revenueChange", revenueChange);
        stats.put("orderChange", orderChange);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent-orders")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách đơn hàng gần đây")
    public ResponseEntity<?> getRecentOrders(
            @RequestParam(defaultValue = "5") int limit) {
        // Get the most recent orders
        List<Order> recentOrders = orderRepository.findTop5ByOrderByCreateAtDesc();
        
        // Đảm bảo lấy đúng thông tin sản phẩm cho mỗi chi tiết đơn hàng
        for (Order order : recentOrders) {
            order.getOrderDetails().forEach(detail -> {
                if (detail.getProduct() != null) {
                    // Trigger eager loading của product
                    detail.getProduct().getId();
                    
                    // Đảm bảo tải hình ảnh sản phẩm nếu có
                    if (detail.getProduct().getImages() != null) {
                        detail.getProduct().getImages().size();
                    }
                }
            });
        }

        return ResponseEntity.ok(recentOrders);
    }
    
    @GetMapping("/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách sản phẩm bán chạy")
    public ResponseEntity<List<Product>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit) {
        // For now, we'll just return the products with highest price
        // In a real system, this would be based on sales data
        List<Product> topProducts = productRepository.findTop5ByOrderByPriceDesc();
        return ResponseEntity.ok(topProducts);
    }
    
    @GetMapping("/sales-chart")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy dữ liệu biểu đồ doanh thu theo thời gian")
    public ResponseEntity<?> getSalesChartData(
            @RequestParam(defaultValue = "7") int days) {
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        
        // Initialize the result map with all dates in range
        Map<String, Long> dailySales = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        // Initialize with zero values for all days
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            dailySales.put(date.format(formatter), 0L);
        }
        
        // Get orders in date range
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Order> orders = orderRepository.findByCreateAtAfter(startDateAsDate);
        
        // Process orders to aggregate by day
        for (Order order : orders) {
            // Convert Date to LocalDate
            LocalDate orderDate = order.getCreateAt().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
            
            if (!orderDate.isBefore(startDate) && !orderDate.isAfter(endDate)) {
                String dateKey = orderDate.format(formatter);
                dailySales.put(dateKey, dailySales.getOrDefault(dateKey, 0L) + order.getTotalPrice());
            }
        }
        
        // Convert to array of objects for frontend
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : dailySales.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", entry.getKey());
            point.put("amount", entry.getValue());
            result.add(point);
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/category-breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy thống kê sản phẩm theo danh mục")
    public ResponseEntity<?> getCategoryBreakdown() {
        List<Product> products = productRepository.findAll();
        
        // Group products by category
        Map<String, Long> categoryCounts = products.stream()
            .filter(p -> p.getCategory() != null)
            .collect(Collectors.groupingBy(
                p -> p.getCategory().getName(),
                Collectors.counting()
            ));
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : categoryCounts.entrySet()) {
            Map<String, Object> category = new HashMap<>();
            category.put("name", entry.getKey());
            category.put("count", entry.getValue());
            result.add(category);
        }
        
        return ResponseEntity.ok(result);
    }
}
