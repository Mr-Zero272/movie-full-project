package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.services.Impl.IntermediaryServiceImpl;
import com.thuongmoon.movieservice.services.IntermediaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth/intermediary")
@RequiredArgsConstructor
public class IntermediaryController {
    @Autowired
    private IntermediaryService intermediaryService;

    @PostMapping("/review")
    public ResponseEntity<String> addNewReviewToMovie(@RequestHeader("username") String username, @RequestBody ReviewDto reviewDto) {
        return intermediaryService.addNewReview(username, reviewDto);
    }
}
