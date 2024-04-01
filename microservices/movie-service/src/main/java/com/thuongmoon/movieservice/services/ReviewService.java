package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.dto.UserUpdateDto;
import com.thuongmoon.movieservice.model.Review;
import com.thuongmoon.movieservice.request.ReportReviewRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.ResponseEntity;

public interface ReviewService {
    public void addNewReview(ReviewDto request);
    public ResponseEntity<ResponseMessage> fetchAllReviewByMovieId(String movieId);
    public ResponseEntity<ResponseMessage> loveMovie(String username, String reviewId);
    public ResponseEntity<ResponseMessage> editReview(String username, String reviewId, ReviewDto reviewDto);
    public ResponseEntity<ResponseMessage>  reportReview(String username, ReportReviewRequest request);
    public ResponseEntity<Review> fetchReviewById(String reviewId);
    public ResponseEntity<ResponseMessage> deleteReview(String username, String movieId, String reviewId);
    public void updateReviewUserInfo(UserUpdateDto request);
}
