package com.naturegrain.controller;

import java.time.LocalDate;
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
@RequestMapping("/api/advanced-analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Advanced Analytics APIs", description = "Endpoint cho các phân tích dữ liệu nâng cao")
public class AdvancedAnalyticsController {

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

    @GetMapping("/rfm-analysis")
    @Operation(summary = "Phân tích RFM (Recency, Frequency, Monetary) cho khách hàng")
    public ResponseEntity<?> getRfmAnalysis() {
        List<Order> allOrders = orderRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        
        Map<Long, List<Order>> ordersByUser = allOrders.stream()
            .filter(o -> o.getUser() != null)
            .collect(Collectors.groupingBy(o -> o.getUser().getId()));
        
        List<Map<String, Object>> rfmData = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        
        for (User user : allUsers) {
            List<Order> userOrders = ordersByUser.get(user.getId());
            if (userOrders == null || userOrders.isEmpty()) {
                continue; // Skip users with no orders
            }
            
            // Sort orders by creation date (latest first)
            userOrders.sort(Comparator.comparing(Order::getCreateAt).reversed());
            
            // Calculate RFM
            long recencyDays = ChronoUnit.DAYS.between(
                userOrders.get(0).getCreateAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), 
                currentDate
            );
            int frequency = userOrders.size();
            long monetaryValue = userOrders.stream()
                .mapToLong(Order::getTotalPrice)
                .sum();
            
            // Determine RFM segments
            String recencySegment = recencyDays <= 30 ? "High" : recencyDays <= 90 ? "Medium" : "Low";
            String frequencySegment = frequency >= 4 ? "High" : frequency >= 2 ? "Medium" : "Low";
            String monetarySegment = monetaryValue >= 2000000 ? "High" : monetaryValue >= 500000 ? "Medium" : "Low";
            
            // Overall segment
            String segment;
            if (recencySegment.equals("High") && frequencySegment.equals("High") && monetarySegment.equals("High")) {
                segment = "VIP";
            } else if (recencySegment.equals("High") && frequencySegment.equals("High")) {
                segment = "Loyal";
            } else if (recencySegment.equals("High")) {
                segment = "Recent";
            } else if (frequencySegment.equals("High") && monetarySegment.equals("High")) {
                segment = "Big Spender";
            } else if (recencySegment.equals("Low") && frequencySegment.equals("Low")) {
                segment = "At Risk";
            } else {
                segment = "Regular";
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("recencyDays", recencyDays);
            userData.put("frequency", frequency);
            userData.put("monetaryValue", monetaryValue);
            userData.put("recencySegment", recencySegment);
            userData.put("frequencySegment", frequencySegment);
            userData.put("monetarySegment", monetarySegment);
            userData.put("segment", segment);
            
            rfmData.add(userData);
        }
        
        // Add summary stats
        Map<String, Long> segmentCounts = rfmData.stream()
            .collect(Collectors.groupingBy(
                m -> (String)m.get("segment"),
                Collectors.counting()
            ));
        
        Map<String, Object> result = new HashMap<>();
        result.put("customers", rfmData);
        result.put("segmentCounts", segmentCounts);
        
        // Calculate average values
        double avgRecency = rfmData.stream().mapToLong(m -> ((Number)m.get("recencyDays")).longValue()).average().orElse(0);
        double avgFrequency = rfmData.stream().mapToInt(m -> ((Number)m.get("frequency")).intValue()).average().orElse(0);
        double avgMonetaryValue = rfmData.stream().mapToLong(m -> ((Number)m.get("monetaryValue")).longValue()).average().orElse(0);
        
        result.put("averages", Map.of(
            "avgRecencyDays", Math.round(avgRecency * 10) / 10.0,
            "avgFrequency", Math.round(avgFrequency * 10) / 10.0, 
            "avgMonetaryValue", Math.round(avgMonetaryValue)
        ));
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/basket-analysis")
    @Operation(summary = "Phân tích giỏ hàng - Sản phẩm thường được mua cùng nhau")
    public ResponseEntity<?> getBasketAnalysis(@RequestParam(defaultValue = "20") int limit) {
        List<Object[]> productRelationships = orderDetailRepository.findProductCrossSellRelationships(limit);
          List<Map<String, Object>> formattedData = new ArrayList<>();
        for (Object[] row : productRelationships) {
            // Skip rows with null values in critical fields
            if (row[0] == null || row[2] == null || row[4] == null) {
                continue;
            }
            
            Map<String, Object> pair = new HashMap<>();
            pair.put("product1Id", row[0]);
            pair.put("product1Name", row[1] != null ? row[1] : "Unknown");
            pair.put("product2Id", row[2]);
            pair.put("product2Name", row[3] != null ? row[3] : "Unknown");
            pair.put("frequency", row[4]);
            
            formattedData.add(pair);
        }
        
        return ResponseEntity.ok(formattedData);
    }
    
    @GetMapping("/funnel-analysis")
    @Operation(summary = "Phân tích chuyển đổi theo phễu")
    public ResponseEntity<?> getFunnelAnalysis() {
        // Count total registered users
        long totalUsers = userRepository.count();
          // Count users who placed at least one order, handling null users
        long usersWithOrders = orderRepository.findAll().stream()
            .filter(order -> order.getUser() != null)
            .map(order -> order.getUser().getId())
            .distinct()
            .count();
        
        // Count users with completed orders, handling null users
        long usersWithCompletedOrders = orderRepository.findAll().stream()
            .filter(order -> "COMPLETED".equals(order.getStatus()) && order.getUser() != null)
            .map(order -> order.getUser().getId())
            .distinct()
            .count();
        
        // Build funnel stages
        List<Map<String, Object>> funnel = new ArrayList<>();
        
        Map<String, Object> registrationStage = new HashMap<>();
        registrationStage.put("stage", "Đăng ký tài khoản");
        registrationStage.put("count", totalUsers);
        registrationStage.put("percentage", 100.0);
        funnel.add(registrationStage);
        
        Map<String, Object> orderStage = new HashMap<>();
        orderStage.put("stage", "Đặt hàng");
        orderStage.put("count", usersWithOrders);
        orderStage.put("percentage", totalUsers > 0 ? (usersWithOrders * 100.0 / totalUsers) : 0);
        funnel.add(orderStage);
        
        Map<String, Object> completionStage = new HashMap<>();
        completionStage.put("stage", "Hoàn thành đơn hàng");
        completionStage.put("count", usersWithCompletedOrders);
        completionStage.put("percentage", totalUsers > 0 ? (usersWithCompletedOrders * 100.0 / totalUsers) : 0);
        funnel.add(completionStage);
        
        return ResponseEntity.ok(funnel);
    }
    
    @GetMapping("/user-cohort-analysis")
    @Operation(summary = "Phân tích đoàn hệ (Cohort Analysis) - theo thời điểm người dùng đăng ký")
    public ResponseEntity<?> getUserCohortAnalysis() {
        List<User> allUsers = userRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();
        
        // Group users by registration month
        Map<String, List<User>> usersByMonth = allUsers.stream()
            .filter(u -> u.getCreateAt() != null)
            .collect(Collectors.groupingBy(u -> {
                LocalDate date = u.getCreateAt().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
                return date.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            }));
        
        // Sort months chronologically
        List<String> sortedMonths = usersByMonth.keySet().stream()
            .sorted()
            .collect(Collectors.toList());
        
        // For each cohort (registration month), calculate retention in subsequent months
        List<Map<String, Object>> cohortData = new ArrayList<>();
        
        for (String registrationMonth : sortedMonths) {
            List<User> cohort = usersByMonth.get(registrationMonth);
            
            // Get user IDs in this cohort
            Set<Long> cohortUserIds = cohort.stream()
                .map(User::getId)
                .collect(Collectors.toSet());
            
            Map<String, Object> cohortInfo = new HashMap<>();
            cohortInfo.put("cohort", registrationMonth);
            cohortInfo.put("size", cohort.size());
            
            // Calculate activity (orders) for each month after registration
            Map<String, Object> retentionData = new HashMap<>();
            
            // For each month, count distinct users in the cohort who placed an order
            for (String month : sortedMonths) {
                if (month.compareTo(registrationMonth) < 0) {
                    continue; // Skip months before registration
                }
                
                // Count users from this cohort who ordered in this month
                final String targetMonth = month;                long activeUsers = allOrders.stream()                    .filter(o -> o.getCreateAt() != null &&
                           o.getUser() != null && 
                           cohortUserIds.contains(o.getUser().getId()) &&
                           targetMonth.equals(o.getCreateAt().toInstant()
                               .atZone(ZoneId.systemDefault())
                               .format(DateTimeFormatter.ofPattern("yyyy-MM"))))
                    .map(o -> o.getUser().getId())
                    .distinct()
                    .count();
                
                // Calculate retention rate
                double retentionRate = cohort.size() > 0 ? (activeUsers * 100.0 / cohort.size()) : 0;
                
                // Month index (0 = registration month, 1 = next month, etc.)
                int monthDiff = getMonthDifference(registrationMonth, month);
                retentionData.put("M" + monthDiff, Map.of(
                    "count", activeUsers,
                    "rate", Math.round(retentionRate * 10) / 10.0
                ));
            }
            
            cohortInfo.put("retention", retentionData);
            cohortData.add(cohortInfo);
        }
        
        return ResponseEntity.ok(cohortData);
    }
    
    @GetMapping("/customer-lifetime-value")
    @Operation(summary = "Phân tích giá trị vòng đời khách hàng (Customer Lifetime Value)")
    public ResponseEntity<?> getCustomerLifetimeValue() {
        List<Order> allOrders = orderRepository.findAll();
        // Group orders by user, making sure both order and user are not null
        Map<Long, List<Order>> ordersByUser = allOrders.stream()
            .filter(o -> o != null && o.getUser() != null)
            .collect(Collectors.groupingBy(o -> o.getUser().getId()));
        
        List<Map<String, Object>> customerData = new ArrayList<>(); 
        
        for (Map.Entry<Long, List<Order>> entry : ordersByUser.entrySet()) {
            Long userId = entry.getKey();
            List<Order> userOrders = entry.getValue();
            
            // Get user info
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) continue;
            
            // Calculate metrics
            long totalSpent = userOrders.stream()
                .mapToLong(Order::getTotalPrice)
                .sum();
                
            double avgOrderValue = userOrders.size() > 0 ? 
                (double) totalSpent / userOrders.size() : 0;
                
            // Calculate time as customer (in days)
            long daysSinceFirstOrder = 0;
            if (!userOrders.isEmpty()) {
                // Find first order date
                Date firstOrderDate = userOrders.stream()
                    .min(Comparator.comparing(Order::getCreateAt))
                    .get().getCreateAt();
                
                daysSinceFirstOrder = ChronoUnit.DAYS.between(
                    firstOrderDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                    LocalDate.now()
                );
            }
            
            // Calculate CLV (simple approach - total spent so far)
            // For more advanced CLV, you would incorporate predicted future value
            double clv = totalSpent;
            
            // If customer has been around for a while, calculate monthly value
            double monthlyValue = daysSinceFirstOrder > 30 ? 
                (totalSpent * 30.0 / daysSinceFirstOrder) : totalSpent;
            
            Map<String, Object> customerInfo = new HashMap<>();
            customerInfo.put("userId", userId);
            customerInfo.put("username", user.getUsername());
            customerInfo.put("email", user.getEmail());
            customerInfo.put("orderCount", userOrders.size());
            customerInfo.put("totalSpent", totalSpent);
            customerInfo.put("avgOrderValue", Math.round(avgOrderValue));
            customerInfo.put("daysSinceFirstOrder", daysSinceFirstOrder);
            customerInfo.put("clv", Math.round(clv));
            customerInfo.put("monthlyValue", Math.round(monthlyValue));
            
            customerData.add(customerInfo);
        }
        
        // Sort by CLV (highest first)
        customerData.sort((a, b) -> 
            Double.compare(
                ((Number) b.get("clv")).doubleValue(),
                ((Number) a.get("clv")).doubleValue()
            )
        );
        
        // Calculate summary stats
        double avgClv = customerData.stream()
            .mapToDouble(m -> ((Number) m.get("clv")).doubleValue())
            .average()
            .orElse(0);
            
        double avgMonthlyValue = customerData.stream()
            .mapToDouble(m -> ((Number) m.get("monthlyValue")).doubleValue())
            .average()
            .orElse(0);
        
        Map<String, Object> result = new HashMap<>();
        result.put("customers", customerData);
        result.put("summary", Map.of(
            "totalCustomers", customerData.size(),
            "avgClv", Math.round(avgClv),
            "avgMonthlyValue", Math.round(avgMonthlyValue)
        ));
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/seasonal-trends")
    @Operation(summary = "Phân tích xu hướng theo mùa")
    public ResponseEntity<?> getSeasonalTrends(
            @RequestParam(defaultValue = "2") int years) {
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusYears(years);
        
        // Convert to Date
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDateAsDate = Date.from(endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        List<Order> orders = orderRepository.findByCreateAtBetween(startDateAsDate, endDateAsDate);
        
        // Group by quarter
        Map<String, List<Order>> ordersByQuarter = orders.stream()
            .collect(Collectors.groupingBy(o -> {
                LocalDate date = o.getCreateAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                return date.getYear() + "-Q" + (date.getMonthValue() - 1) / 3 + 1;
            }));
        
        // Calculate metrics for each quarter
        List<Map<String, Object>> quarterlyData = new ArrayList<>();
        
        for (Map.Entry<String, List<Order>> entry : ordersByQuarter.entrySet()) {
            String quarter = entry.getKey();
            List<Order> quarterOrders = entry.getValue();
            
            long totalRevenue = quarterOrders.stream()
                .mapToLong(Order::getTotalPrice)
                .sum();
                
            int orderCount = quarterOrders.size();
              // Filter out null user orders before counting unique customers
            long uniqueCustomers = quarterOrders.stream()
                .filter(o -> o.getUser() != null)
                .map(o -> o.getUser().getId())
                .distinct()
                .count();
                
            double avgOrderValue = orderCount > 0 ? 
                (double) totalRevenue / orderCount : 0;
                
            Map<String, Object> quarterData = new HashMap<>();
            quarterData.put("period", quarter);
            quarterData.put("revenue", totalRevenue);
            quarterData.put("orders", orderCount);
            quarterData.put("customers", uniqueCustomers);
            quarterData.put("avgOrderValue", Math.round(avgOrderValue));
            
            quarterlyData.add(quarterData);
        }
        
        // Sort by quarter
        quarterlyData.sort(Comparator.comparing(m -> (String) m.get("period")));
        
        return ResponseEntity.ok(quarterlyData);
    }
    
    @GetMapping("/category-performance")
    @Operation(summary = "Phân tích hiệu suất danh mục sản phẩm")
    public ResponseEntity<?> getCategoryPerformance(
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
        
        List<Object[]> categoryData = orderDetailRepository.findRevenueByCategory(startDate, endDate);
          List<Map<String, Object>> formattedData = new ArrayList<>();
        for (Object[] row : categoryData) {
            // Skip rows with null values in critical fields
            if (row[0] == null) {
                continue;
            }
            
            Map<String, Object> category = new HashMap<>();
            category.put("category", row[0]);
            category.put("revenue", row[1] != null ? row[1] : 0);
            category.put("orderCount", row[2] != null ? row[2] : 0);
            
            formattedData.add(category);
        }
        
        return ResponseEntity.ok(formattedData);
    }
    
    @GetMapping("/day-hour-heatmap")
    @Operation(summary = "Phân tích doanh số theo ngày và giờ (heatmap)")
    public ResponseEntity<?> getDayHourHeatmap(
            @RequestParam(defaultValue = "30") int days) {
            
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        // Convert to Date
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        List<Order> orders = orderRepository.findByCreateAtAfter(startDateAsDate);
        
        // Create 2D array [day of week][hour of day] for heatmap
        int[][] heatmapData = new int[7][24];
        
        for (Order order : orders) {
            Date createAt = order.getCreateAt();
            if (createAt != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(createAt);
                
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - 1; // 0 = Sunday
                int hourOfDay = cal.get(Calendar.HOUR_OF_DAY);
                
                heatmapData[dayOfWeek][hourOfDay]++;
            }
        }
        
        // Format for response
        List<Map<String, Object>> result = new ArrayList<>();
        
        String[] daysOfWeek = {"Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"};
        
        for (int day = 0; day < 7; day++) {
            for (int hour = 0; hour < 24; hour++) {
                Map<String, Object> cell = new HashMap<>();
                cell.put("day", day);
                cell.put("dayName", daysOfWeek[day]);
                cell.put("hour", hour);
                cell.put("value", heatmapData[day][hour]);
                
                result.add(cell);
            }
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/order-completion-rate")
    @Operation(summary = "Phân tích tỷ lệ hoàn thành đơn hàng")
    public ResponseEntity<?> getOrderCompletionRate(
            @RequestParam(defaultValue = "30") int days) {
            
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        // Convert to Date
        Date startDateAsDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDateAsDate = Date.from(endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        List<Order> orders = orderRepository.findByCreateAtBetween(startDateAsDate, endDateAsDate);
          // Group by day
        Map<String, List<Order>> ordersByDay = orders.stream()
            .filter(o -> o.getCreateAt() != null) // Filter out orders with null createAt
            .collect(Collectors.groupingBy(o -> {
                LocalDate date = o.getCreateAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                return date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }));
            
        // Calculate completion rates by day
        List<Map<String, Object>> completionData = new ArrayList<>();
        
        for (Map.Entry<String, List<Order>> entry : ordersByDay.entrySet()) {
            String day = entry.getKey();
            List<Order> dayOrders = entry.getValue();
            
            long totalOrders = dayOrders.size();
            long completedOrders = dayOrders.stream()
                .filter(o -> "COMPLETED".equals(o.getStatus()))
                .count();
                
            long cancelledOrders = dayOrders.stream()
                .filter(o -> "CANCELED".equals(o.getStatus()))
                .count();
                
            double completionRate = totalOrders > 0 ? 
                (completedOrders * 100.0 / totalOrders) : 0;
                
            double cancellationRate = totalOrders > 0 ? 
                (cancelledOrders * 100.0 / totalOrders) : 0;
                
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", day);
            dayData.put("totalOrders", totalOrders);
            dayData.put("completedOrders", completedOrders);
            dayData.put("cancelledOrders", cancelledOrders);
            dayData.put("completionRate", Math.round(completionRate * 10) / 10.0);
            dayData.put("cancellationRate", Math.round(cancellationRate * 10) / 10.0);
            
            completionData.add(dayData);
        }
        
        // Sort by date
        completionData.sort(Comparator.comparing(m -> (String) m.get("date")));
        
        return ResponseEntity.ok(completionData);
    }
    
    // Helper method to calculate month difference between two yyyy-MM strings
    private int getMonthDifference(String month1, String month2) {
        int year1 = Integer.parseInt(month1.substring(0, 4));
        int monthValue1 = Integer.parseInt(month1.substring(5, 7));
        
        int year2 = Integer.parseInt(month2.substring(0, 4));
        int monthValue2 = Integer.parseInt(month2.substring(5, 7));
        
        return (year2 - year1) * 12 + (monthValue2 - monthValue1);
    }
}
