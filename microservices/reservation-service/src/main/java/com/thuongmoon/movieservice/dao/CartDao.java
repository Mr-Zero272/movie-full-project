package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartDao extends MongoRepository<Cart, String> {
    Optional<Cart> findByUsernameAndActiveTrue(String username);
}
