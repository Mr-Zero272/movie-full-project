package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDao extends MongoRepository<Order, String> {
    List<Order> findByUsername(String username);
}
