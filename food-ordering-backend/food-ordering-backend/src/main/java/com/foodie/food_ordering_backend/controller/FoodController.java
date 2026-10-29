package com.foodie.food_ordering_backend.controller;

import com.foodie.food_ordering_backend.model.FoodItem;
import com.foodie.food_ordering_backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*") // Hya mukhya change mule Vercel chya requests allow hotil!
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    // 1. POST: Navin food item add karne
    @PostMapping
    public FoodItem createFood(@RequestBody FoodItem foodItem) {
        return foodRepository.save(foodItem);
    }

    // 2. GET: Sagle food items baghne
    @GetMapping
    public List<FoodItem> getAllFoods() {
        return foodRepository.findAll();
    }

    // 3. GET by ID: Eka specific item chi mahiti baghne
    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodById(@PathVariable Long id) {
        Optional<FoodItem> foodItem = foodRepository.findById(id);
        return foodItem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. PUT: Item update karne
    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFood(@PathVariable Long id, @RequestBody FoodItem foodDetails) {
        Optional<FoodItem> optionalFood = foodRepository.findById(id);
        if (optionalFood.isPresent()) {
            FoodItem food = optionalFood.get();
            food.setFoodName(foodDetails.getFoodName());
            food.setCategory(foodDetails.getCategory());
            food.setPrice(foodDetails.getPrice());
            food.setLocation(foodDetails.getLocation());
            food.setRestaurant(foodDetails.getRestaurant());
            food.setStatus(foodDetails.getStatus());
            return ResponseEntity.ok(foodRepository.save(food));
        }
        return ResponseEntity.notFound().build();
    }

    // 5. DELETE: Item delete karne
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        if (foodRepository.existsById(id)) {
            foodRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}