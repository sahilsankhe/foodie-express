package com.foodie.food_ordering_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;
    private String category;
    private Double price;
    private String location;
    private String restaurant;
    private String status; // e.g., AVAILABLE, OUT_OF_STOCK
    
    @Column(length = 1000) // For storing image links securely
    private String imageUrl;

    // Default Constructor
    public FoodItem() {}

    // Parameterized Constructor
    public FoodItem(String foodName, String category, Double price, String location, String restaurant, String status, String imageUrl) {
        this.foodName = foodName;
        this.category = category;
        this.price = price;
        this.location = location;
        this.restaurant = restaurant;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getFoodName() { 
        return foodName; 
    }
    public void setFoodName(String foodName) { 
        this.foodName = foodName; 
    }

    public String getCategory() { 
        return category; 
    }
    public void setCategory(String category) { 
        this.category = category; 
    }

    public Double getPrice() { 
        return price; 
    }
    public void setPrice(Double price) { 
        this.price = price; 
    }

    public String getLocation() { 
        return location; 
    }
    public void setLocation(String location) { 
        this.location = location; 
    }

    public String getRestaurant() { 
        return restaurant; 
    }
    public void setRestaurant(String restaurant) { 
        this.restaurant = restaurant; 
    }

    public String getStatus() { 
        return status; 
    }
    public void setStatus(String status) { 
        this.status = status; 
    }

    public String getImageUrl() { 
        return imageUrl; 
    }
    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }
}