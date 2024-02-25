package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.MovieDao;
import com.thuongmoon.movieservice.dao.ReviewDao;
import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.dto.UserUpdateDto;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Review;
import com.thuongmoon.movieservice.request.ReportReviewRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewDao reviewDao;
    @Autowired
    private MovieDao movieDao;
    @Transactional
    public void addNewReview(ReviewDto request) {
        Optional<Movie> movie = movieDao.findById(request.getMovieId());
        if (movie.isPresent()) {
            Review newReview = Review.builder()
                    .author(request.getAuthor())
                    .avatar(request.getAvatar())
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .totalLoves(0)
                    .whoLoves(new ArrayList<>())
                    .publishAt(LocalDateTime.now())
                    .lastUpdated(LocalDateTime.now())
                    .build();
            Review reviewSaved = reviewDao.save(newReview);
            List<Review> reviews = movie.get().getReviews();
            reviews.add(reviewSaved);
            movieDao.save(movie.get());
        }
    }

    public ResponseEntity<ResponseMessage> fetchAllReviewByMovieId(String movieId) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Movie> movie = movieDao.findById(movieId);
        if(movie.isPresent()) {
            responseMessage.setMessage("Fetch all reviews successfully!");
            responseMessage.setData(movie.get().getReviews());
        } else {
            responseMessage.setMessage("Fetch all reviews failed!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> loveMovie(String username, String reviewId) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Review> review = reviewDao.findById(reviewId);
        if(review.isPresent()) {
            if (!review.get().getWhoLoves().contains(username)) {
                List<String> pLoved = review.get().getWhoLoves();
                pLoved.add(username);
                review.get().setWhoLoves(pLoved);
                review.get().setTotalLoves(review.get().getTotalLoves() + 1);
                review.get().setLastUpdated(LocalDateTime.now());
                Review reviewSaved = reviewDao.save(review.get());
                responseMessage.setMessage("This review is updated!!");
                responseMessage.setData(reviewSaved);
            } else {
                responseMessage.setState("error");
                responseMessage.setRspCode("500");
                responseMessage.setMessage("Update review error!");
            }
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("500");
            responseMessage.setMessage("Update review error!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> editReview(String username, String reviewId, ReviewDto reviewDto) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Review> review = reviewDao.findById(reviewId);
        if (review.isPresent() && review.get().getAuthor().equals(username)) {
            review.get().setRating(reviewDto.getRating());
            review.get().setComment(reviewDto.getComment());
            review.get().setLastUpdated(LocalDateTime.now());
            Review reviewSaved = reviewDao.save(review.get());
            responseMessage.setMessage("This review is updated!!");
            responseMessage.setData(reviewSaved);
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("500");
            responseMessage.setMessage("Update review error!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<ResponseMessage>  reportReview(String username, ReportReviewRequest request) {
        ResponseMessage responseMessage =  new ResponseMessage();
        Optional<Review> review = reviewDao.findById(request.getReviewId());
        if (review.isPresent() && !username.isEmpty()) {
            List<String> reports = review.get().getReports();
            if (reports == null) reports = new ArrayList<>();

            reports.add(request.getReportContent());
            review.get().setReports(reports);
            Review reviewSaved = reviewDao.save(review.get());
            responseMessage.setMessage("This review is updated!!");
            responseMessage.setData(reviewSaved);
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("500");
            responseMessage.setMessage("Update review error!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<Review> fetchReviewById(String reviewId) {
        return new ResponseEntity<>(reviewDao.findById(reviewId).get(), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> deleteReview(String username, String movieId, String reviewId) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Movie> movie = movieDao.findById(movieId);
        Optional<Review> review = reviewDao.findById(reviewId);
        if (movie.isPresent() && review.isPresent() && review.get().getAuthor().equals(username)) {
            List<Review> tempListReviews = movie.get().getReviews();
            tempListReviews.remove(review.get());
            movie.get().setReviews(tempListReviews);
            movieDao.save(movie.get());

            reviewDao.delete(review.get());

            responseMessage.setMessage("Delete review successfully!");
            responseMessage.setData(tempListReviews);
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("500");
            responseMessage.setMessage("Delete review error!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Transactional
    public void updateReviewUserInfo(UserUpdateDto request) {
        List<Review> reviews = reviewDao.findAllByAuthor(request.getUsername());
        reviews.forEach(review -> review.setAvatar(request.getAvatar()));
        reviewDao.saveAll(reviews);
    }
}













