package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.UserDao;
import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.kafka.JsonKafkaProducer;
import com.thuongmoon.movieservice.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IntermediaryService {
    @Autowired
    private UserDao userDao;
    @Autowired
    private JsonKafkaProducer jsonKafkaProducer;

    public ResponseEntity<String> addNewReview(String username, ReviewDto reviewDto) {
        String message = "";
        Optional<User> user = userDao.findByUsername(username);
        if (user.isPresent()) {
            reviewDto.setAuthor(username);
            reviewDto.setAvatar(user.get().getAvatar());
            jsonKafkaProducer.addNewReview(reviewDto);
            message = "Add new review successfully!";
        } else {
            message = "Add new review failed!";
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
