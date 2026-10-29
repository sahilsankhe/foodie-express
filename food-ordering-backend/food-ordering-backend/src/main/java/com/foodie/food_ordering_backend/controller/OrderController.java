package com.foodie.food_ordering_backend.controller;

import com.foodie.food_ordering_backend.model.Order;
import com.foodie.food_ordering_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // 1. Place Order & Save to MySQL Database
    @PostMapping("/place")
    public Order placeOrder(@RequestBody Order order) {
        order.setStatus("Order Placed");
        return orderRepository.save(order);
    }

    // Standard POST endpoint support
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("Order Placed");
        return orderRepository.save(order);
    }

    // 2. Fetch All Orders (For Order History & Admin Panel)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 3. Update Live Order Status (For Tracking)
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // 4. Download Order Invoice / Bill as text file
    @GetMapping("/{id}/invoice")
    public ResponseEntity<String> downloadInvoice(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        StringBuilder sb = new StringBuilder();
        sb.append("========================================\n");
        sb.append("           FOODIE EXPRESS INVOICE       \n");
        sb.append("========================================\n");
        sb.append("Order ID: #").append(order.getId()).append("\n");
        sb.append("Customer: ").append(order.getCustomerName()).append("\n");
        sb.append("Date: ").append(order.getOrderDate()).append("\n");
        sb.append("Payment Method: ").append(order.getPaymentMethod()).append("\n");
        sb.append("Status: ").append(order.getStatus()).append("\n");
        sb.append("----------------------------------------\n");
        sb.append("Items Ordered:\n");
        
        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                sb.append("- ").append(item.getFoodName())
                  .append(" x ").append(item.getQuantity())
                  .append(" : ₹").append(item.getPrice() * item.getQuantity()).append("\n");
            }
        }
        
        sb.append("----------------------------------------\n");
        sb.append("TOTAL AMOUNT PAID: ₹").append(order.getTotalAmount()).append("\n");
        sb.append("========================================\n");
        sb.append("     Thank you for ordering with us!    \n");

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice_" + id + ".txt")
                .body(sb.toString());
    }
}