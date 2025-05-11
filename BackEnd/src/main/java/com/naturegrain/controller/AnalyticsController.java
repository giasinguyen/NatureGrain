package com.naturegrain.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
import com.naturegrain.entity.OrderDetail;
import com.naturegrain.entity.Product;
import com.naturegrain.entity.User;
import com.naturegrain.repository.CategoryRepository;
import com.naturegrain.repository.OrderDetailRepository;
import com.naturegrain.repository.OrderRepository;
import com.naturegrain.repository.ProductRepository;
import com.naturegrain.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Analytics APIs", description = "Endpoint cho phân tích dữ liệu kinh doanh")
public class AnalyticsController {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/sales-trends")
    @Operation(summary = "Lấy xu hướng bán hàng theo thời gian (ngày, tuần, tháng)")
    public ResponseEntity<?> getSalesTrends(
            @RequestParam(defaultValue = "daily") String timeframe,
            @RequestParam(defaultValue = "30") int timespan) {
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        
        // Xác định thời gian bắt đầu dựa trên timeframe và timespan
        switch (timeframe) {
            case "weekly":
                startDate = endDate.minusWeeks(timespan);
                break;
            case "monthly":
                startDate = endDate.minusMonths(timespan);
                break;
            case "daily":
            default:
                startDate = endDate.minusDays(timespan);
                break;
        }
        
        // Convert LocalDate to Date
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        // Get orders in date range
        List<Order> orders = orderRepository.findByCreateAtAfter(startDateAsDate);
        
        // Format for result
        DateTimeFormatter formatter;
        if (timeframe.equals("monthly")) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        } else if (timeframe.equals("weekly")) {
            formatter = DateTimeFormatter.ofPattern("yyyy-'W'ww"); // ISO week format
        } else {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        }
        
        // Group by time period
        Map<String, Object> result = aggregateOrdersByTimePeriod(orders, timeframe, formatter);
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user-growth")
    @Operation(summary = "Lấy dữ liệu tăng trưởng người dùng theo thời gian")
    public ResponseEntity<?> getUserGrowth(@RequestParam(defaultValue = "30") int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        List<User> allUsers = userRepository.findAll();
        
        // Sort users by creation date
        allUsers.sort(Comparator.comparing(User::getCreateAt));
        
        // Group by day
        Map<String, Integer> dailyGrowth = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        // Initialize map with all days in range
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            dailyGrowth.put(date.format(formatter), 0);
        }
        
        // Count new users by day
        for (User user : allUsers) {
            if (user.getCreateAt() != null) {
                LocalDate registrationDate = user.getCreateAt().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
                
                if (!registrationDate.isBefore(startDate) && !registrationDate.isAfter(endDate)) {
                    String dateKey = registrationDate.format(formatter);
                    dailyGrowth.put(dateKey, dailyGrowth.getOrDefault(dateKey, 0) + 1);
                }
            }
        }
        
        // Calculate cumulative growth
        List<Map<String, Object>> result = new ArrayList<>();
        int cumulativeUsers = (int) allUsers.stream()
            .filter(u -> u.getCreateAt() != null && 
                   u.getCreateAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isBefore(startDate))
            .count();
            
        for (Map.Entry<String, Integer> entry : dailyGrowth.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", entry.getKey());
            point.put("newUsers", entry.getValue());
            
            cumulativeUsers += entry.getValue();
            point.put("totalUsers", cumulativeUsers);
            
            result.add(point);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/customer-retention")
    @Operation(summary = "Phân tích khách hàng quay lại mua hàng")
    public ResponseEntity<?> getCustomerRetention() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Group orders by user
        Map<Long, List<Order>> ordersByUser = allOrders.stream()
            .filter(o -> o.getUser() != null)
            .collect(Collectors.groupingBy(o -> o.getUser().getId()));
        
        int totalCustomers = ordersByUser.size();
        int repeatCustomers = 0;
        int oneTimeCustomers = 0;
        
        Map<String, Object> retentionStats = new HashMap<>();
        Map<String, Integer> purchaseFrequency = new HashMap<>();
        
        for (Map.Entry<Long, List<Order>> entry : ordersByUser.entrySet()) {
            int orderCount = entry.getValue().size();
            
            // Count one-time vs repeat customers
            if (orderCount > 1) {
                repeatCustomers++;
            } else {
                oneTimeCustomers++;
            }
            
            // Track purchase frequency
            String key = orderCount > 5 ? "5+" : String.valueOf(orderCount);
            purchaseFrequency.put(key, purchaseFrequency.getOrDefault(key, 0) + 1);
        }
        
        // Calculate average orders per customer
        double avgOrdersPerCustomer = totalCustomers > 0 ? 
            (double) allOrders.size() / totalCustomers : 0;
            
        // Calculate retention rate
        double retentionRate = totalCustomers > 0 ? 
            (double) repeatCustomers / totalCustomers * 100 : 0;
            
        retentionStats.put("totalCustomers", totalCustomers);
        retentionStats.put("repeatCustomers", repeatCustomers);
        retentionStats.put("oneTimeCustomers", oneTimeCustomers);
        retentionStats.put("retentionRate", Math.round(retentionRate * 100) / 100.0);
        retentionStats.put("avgOrdersPerCustomer", Math.round(avgOrdersPerCustomer * 100) / 100.0);
        retentionStats.put("purchaseFrequency", purchaseFrequency);
        
        return ResponseEntity.ok(retentionStats);
    }    @GetMapping("/product-performance")
    @Operation(summary = "Phân tích hiệu suất sản phẩm")
    public ResponseEntity<?> getProductPerformance() {
        List<OrderDetail> allOrderDetails = orderDetailRepository.findAll();
        
        // Group by product name since we now have a product reference
        Map<String, List<OrderDetail>> detailsByProduct = allOrderDetails.stream()
            .filter(od -> od.getName() != null && !od.getName().isEmpty())
            .collect(Collectors.groupingBy(OrderDetail::getName));
            
        // Calculate metrics for each product
        List<Map<String, Object>> productPerformance = new ArrayList<>();
        
        for (Map.Entry<String, List<OrderDetail>> entry : detailsByProduct.entrySet()) {
            String productName = entry.getKey();
            List<OrderDetail> details = entry.getValue();
            
            int totalQuantitySold = details.stream().mapToInt(OrderDetail::getQuantity).sum();
            long totalRevenue = details.stream()
                .mapToLong(od -> od.getPrice() * od.getQuantity())
                .sum();
                
            // Count unique customers
            long uniqueCustomers = details.stream()
                .filter(od -> od.getOrder() != null && od.getOrder().getUser() != null)
                .map(od -> od.getOrder().getUser().getId())
                .distinct()
                .count();
                
            Map<String, Object> productData = new HashMap<>();
            productData.put("productName", productName);
            // Use the first product id if available, otherwise use name hash
            productData.put("productId", details.stream()
                .filter(od -> od.getProduct() != null)
                .map(od -> od.getProduct().getId())
                .findFirst()
                .orElse((long)productName.hashCode()));
            
            // Use the first product's category if available
            productData.put("category", details.stream()
                .filter(od -> od.getProduct() != null && od.getProduct().getCategory() != null)
                .map(od -> od.getProduct().getCategory().getName())
                .findFirst()
                .orElse("Uncategorized"));            productData.put("quantitySold", totalQuantitySold);
            productData.put("revenue", totalRevenue);
            productData.put("uniqueCustomers", uniqueCustomers);
            
            productPerformance.add(productData);
        }
        
        // Sort by revenue (highest first)
        productPerformance.sort((a, b) -> 
            Long.compare((Long) b.get("revenue"), (Long) a.get("revenue")));
            
        return ResponseEntity.ok(productPerformance);
    }
    @GetMapping("/order-status-distribution")
    @Operation(summary = "Phân bố trạng thái đơn hàng")
    public ResponseEntity<?> getOrderStatusDistribution() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Group by status, handling null values
        Map<String, Long> statusCounts = allOrders.stream()
            .collect(Collectors.groupingBy(
                order -> order.getStatus() != null ? order.getStatus() : "UNKNOWN",
                Collectors.counting()
            ));
            
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Map.Entry<String, Long> entry : statusCounts.entrySet()) {
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("status", entry.getKey());
            statusData.put("count", entry.getValue());
            statusData.put("percentage", Math.round((double) entry.getValue() / allOrders.size() * 100 * 10) / 10.0);
            result.add(statusData);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sales-by-hour")
    @Operation(summary = "Phân tích doanh số theo giờ trong ngày")
    public ResponseEntity<?> getSalesByHourOfDay() {
        List<Object[]> hourlyData = orderDetailRepository.findSalesByHourOfDay();
        
        List<Map<String, Object>> formattedData = new ArrayList<>();
        for (Object[] row : hourlyData) {
            Map<String, Object> hourData = new HashMap<>();
            hourData.put("hour", row[0]);
            hourData.put("orderCount", row[1]);
            hourData.put("revenue", row[2]);
            formattedData.add(hourData);
        }
        
        return ResponseEntity.ok(formattedData);
    }
    
    @GetMapping("/customer-insights")
    @Operation(summary = "Phân tích chi tiết về khách hàng")
    public ResponseEntity<?> getCustomerInsights() {
        List<Object[]> frequencyData = orderDetailRepository.findCustomerPurchaseFrequency();
        
        List<Map<String, Object>> customerInsights = new ArrayList<>();
        for (Object[] row : frequencyData) {
            Map<String, Object> customer = new HashMap<>();
            customer.put("userId", row[0]);
            customer.put("username", row[1]);
            customer.put("orderCount", row[2]);
            customer.put("totalSpent", row[3]);
            customerInsights.add(customer);
        }
        
        // Calculate average metrics
        long totalSpent = 0;
        int totalOrders = 0;
        for (Map<String, Object> customer : customerInsights) {
            totalSpent += ((Number) customer.get("totalSpent")).longValue();
            totalOrders += ((Number) customer.get("orderCount")).intValue();
        }
        
        double avgOrderValue = customerInsights.size() > 0 ? 
            (double) totalSpent / totalOrders : 0;
        double avgSpentPerCustomer = customerInsights.size() > 0 ? 
            (double) totalSpent / customerInsights.size() : 0;
        
        Map<String, Object> result = new HashMap<>();
        result.put("customers", customerInsights);
        result.put("metrics", Map.of(
            "totalCustomers", customerInsights.size(),
            "totalOrders", totalOrders,
            "totalRevenue", totalSpent,
            "avgOrderValue", avgOrderValue,
            "avgSpentPerCustomer", avgSpentPerCustomer
        ));
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/sales-by-date-range")
    @Operation(summary = "Phân tích doanh số theo khoảng thời gian")
    public ResponseEntity<?> getSalesByDateRange(
            @RequestParam(required = false) String startDateStr,
            @RequestParam(required = false) String endDateStr) {
            
        // Default to last 30 days if no dates are provided
        LocalDate now = LocalDate.now();
        LocalDate startLocalDate = startDateStr != null ? 
            LocalDate.parse(startDateStr) : now.minusDays(30);
        LocalDate endLocalDate = endDateStr != null ? 
            LocalDate.parse(endDateStr) : now;
        
        // Convert to Date
        Date startDate = Date.from(startLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endLocalDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        List<Object[]> salesData = orderDetailRepository.findSalesByDateRange(startDate, endDate);
        
        List<Map<String, Object>> formattedData = new ArrayList<>();
        for (Object[] row : salesData) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", row[0]);
            dataPoint.put("quantity", row[1]);
            dataPoint.put("revenue", row[2]);
            formattedData.add(dataPoint);
        }
        
        // Calculate summary metrics
        int totalQuantity = 0;
        long totalRevenue = 0;
        for (Map<String, Object> point : formattedData) {
            totalQuantity += ((Number) point.get("quantity")).intValue();
            totalRevenue += ((Number) point.get("revenue")).longValue();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", formattedData);
        result.put("summary", Map.of(
            "startDate", startLocalDate.toString(),
            "endDate", endLocalDate.toString(),
            "totalQuantity", totalQuantity,
            "totalRevenue", totalRevenue,
            "avgDailyRevenue", formattedData.size() > 0 ? (double) totalRevenue / formattedData.size() : 0
        ));
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/order-processing-time")
    @Operation(summary = "Phân tích thời gian xử lý đơn hàng")
    public ResponseEntity<?> getOrderProcessingTime() {
        Double avgProcessingHours = orderDetailRepository.findAverageOrderProcessingTime();
        
        if (avgProcessingHours == null) {
            avgProcessingHours = 0.0;
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("averageProcessingHours", avgProcessingHours);
        result.put("averageProcessingDays", avgProcessingHours / 24.0);
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/export-report")
    @Operation(summary = "Xuất báo cáo doanh số")
    public ResponseEntity<?> exportSalesReport(
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "csv") String format) {
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        // Convert to Date
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDateAsDate = Date.from(endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        List<Object[]> salesData = orderDetailRepository.findSalesByDateRange(startDateAsDate, endDateAsDate);
        
        // Format depends on the request
        if ("json".equalsIgnoreCase(format)) {
            List<Map<String, Object>> jsonData = new ArrayList<>();
            for (Object[] row : salesData) {
                jsonData.add(Map.of(
                    "date", row[0].toString(),
                    "quantity", row[1],
                    "revenue", row[2]
                ));
            }
            return ResponseEntity.ok(jsonData);
        } else {
            // Default CSV format
            StringBuilder csv = new StringBuilder();
            csv.append("Date,Quantity,Revenue\n");
            
            for (Object[] row : salesData) {
                csv.append(row[0]).append(",")
                   .append(row[1]).append(",")
                   .append(row[2]).append("\n");
            }
            
            return ResponseEntity
                .ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=\"sales_report.csv\"")
                .body(csv.toString());
        }
    }

    // Phương thức private giúp tổng hợp đơn hàng theo kỳ thời gian
    private Map<String, Object> aggregateOrdersByTimePeriod(List<Order> orders, String timeframe, DateTimeFormatter formatter) {
        // Initialize result maps
        Map<String, Long> salesByPeriod = new LinkedHashMap<>();
        Map<String, Integer> ordersByPeriod = new LinkedHashMap<>();
        
        // Process orders
        for (Order order : orders) {
            // Convert to LocalDate
            LocalDateTime orderDateTime = order.getCreateAt().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDateTime();
            
            String periodKey;
            
            // Format the period key according to timeframe
            if (timeframe.equals("weekly")) {
                // Get the first day of the week containing the order date
                LocalDate weekStart = orderDateTime.toLocalDate()
                    .minusDays(orderDateTime.getDayOfWeek().getValue() - 1);
                periodKey = weekStart.format(formatter);
            } else if (timeframe.equals("monthly")) {
                // Use year-month format
                periodKey = orderDateTime.format(formatter);
            } else {
                // Daily format
                periodKey = orderDateTime.format(formatter);
            }
            
            // Aggregate data
            salesByPeriod.put(periodKey, 
                salesByPeriod.getOrDefault(periodKey, 0L) + order.getTotalPrice());
            ordersByPeriod.put(periodKey, 
                ordersByPeriod.getOrDefault(periodKey, 0) + 1);
        }
        
        // Create result structure
        List<Map<String, Object>> timeSeriesData = new ArrayList<>();
        
        for (String period : salesByPeriod.keySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("period", period);
            point.put("sales", salesByPeriod.get(period));
            point.put("orders", ordersByPeriod.getOrDefault(period, 0));
            point.put("avgOrderValue", ordersByPeriod.get(period) > 0 ? 
                salesByPeriod.get(period) / ordersByPeriod.get(period) : 0);
            timeSeriesData.add(point);
        }
        
        // Wrap in result object with metadata
        Map<String, Object> result = new HashMap<>();
        result.put("timeframe", timeframe);
        result.put("data", timeSeriesData);
        
        // Calculate summary stats
        long totalSales = salesByPeriod.values().stream().mapToLong(Long::longValue).sum();
        int totalOrders = ordersByPeriod.values().stream().mapToInt(Integer::intValue).sum();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("totalOrders", totalOrders);
        summary.put("avgOrderValue", totalOrders > 0 ? (double) totalSales / totalOrders : 0);
        
        result.put("summary", summary);
        
        return result;
    }
}
