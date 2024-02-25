package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewDao extends MongoRepository<Review, String> {
    List<Review> findAllByAuthor(String author);
}
