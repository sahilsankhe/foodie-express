package com.foodie.food_ordering_backend.controller;

import com.foodie.food_ordering_backend.model.Review;
import com.foodie.food_ordering_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/{foodId}")
    public List<Review> getReviewsByFood(@PathVariable Long foodId) {
        return reviewRepository.findByFoodId(foodId);
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }
}