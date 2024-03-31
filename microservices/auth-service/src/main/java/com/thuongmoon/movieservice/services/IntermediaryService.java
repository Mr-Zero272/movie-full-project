package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.ReviewDto;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface IntermediaryService {
    public ResponseEntity<String> addNewReview(String username, ReviewDto reviewDto);
}
