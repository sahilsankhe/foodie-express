package com.foodie.food_ordering_backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @PostMapping("/place")
    public Map<String, Object> placeOrder(@RequestBody Map<String, Object> orderData) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("status", "SUCCESS");
        response.put("message", "Order placed successfully!");
        response.put("orderId", "ORD-" + new Random().nextInt(10000));
        response.put("orderDetails", orderData);
        response.put("user", "Avani");

        return response;
    }
}