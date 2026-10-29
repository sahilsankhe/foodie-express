package com.foodie.food_ordering_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName = "Guest Customer";
    private Double totalAmount;
    private String status = "Order Placed";
    private String paymentMethod = "Razorpay Online";

    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    public Order() {}

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getCustomerName() { 
        return customerName; 
    }
    public void setCustomerName(String customerName) { 
        this.customerName = customerName; 
    }

    public Double getTotalAmount() { 
        return totalAmount; 
    }
    public void setTotalAmount(Double totalAmount) { 
        this.totalAmount = totalAmount; 
    }

    public String getStatus() { 
        return status; 
    }
    public void setStatus(String status) { 
        this.status = status; 
    }

    public String getPaymentMethod() { 
        return paymentMethod; 
    }
    public void setPaymentMethod(String paymentMethod) { 
        this.paymentMethod = paymentMethod; 
    }

    public LocalDateTime getOrderDate() { 
        return orderDate; 
    }
    public void setOrderDate(LocalDateTime orderDate) { 
        this.orderDate = orderDate; 
    }

    public List<OrderItem> getItems() { 
        return items; 
    }
    public void setItems(List<OrderItem> items) { 
        this.items = items; 
    }
}