package com.foodie.food_ordering_backend;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if ("avani@foodordering.com".equals(email)) {
            return new User(
                "avani@foodordering.com",
                passwordEncoder.encode("123456"),
                new ArrayList<>()
            );
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }
}