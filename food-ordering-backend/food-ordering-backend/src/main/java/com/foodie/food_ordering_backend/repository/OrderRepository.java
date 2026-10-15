package com.foodie.food_ordering_backend.repository;

import com.foodie.food_ordering_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}