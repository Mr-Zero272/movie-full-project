package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.model.Review;
import com.thuongmoon.movieservice.request.ReportReviewRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.Impl.ReviewServiceImpl;
import com.thuongmoon.movieservice.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/movie/review")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/all/{movieId}")
    public ResponseEntity<ResponseMessage> getAllReviewsByMovieId(@PathVariable("movieId") String movieId) {
        return reviewService.fetchAllReviewByMovieId(movieId);
    }

    @PostMapping("/love")
    public ResponseEntity<ResponseMessage> addLoveToTheMovie(@RequestHeader("username") String username, @RequestBody String reviewId) {
        return reviewService.loveMovie(username, reviewId);
    }

    @PostMapping("/report")
    public ResponseEntity<ResponseMessage> addReportToTheReview(@RequestHeader("username") String username, @RequestBody ReportReviewRequest request) {
        return reviewService.reportReview(username, request);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ResponseMessage> editReview(@RequestHeader("username") String username, @PathVariable("reviewId") String reviewId, @RequestBody ReviewDto reviewDto) {
        return reviewService.editReview(username, reviewId, reviewDto);
    }

    @DeleteMapping("/{movieId}/{reviewId}")
    public ResponseEntity<ResponseMessage> deleteReview(@RequestHeader("username") String username, @PathVariable("movieId") String movieId, @PathVariable("reviewId") String reviewId) {
        return reviewService.deleteReview(username, movieId, reviewId);
    }

    @GetMapping("/info/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable("reviewId") String reviewId) {
        return reviewService.fetchReviewById(reviewId);
    }
}
