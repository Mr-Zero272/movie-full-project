package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.dto.UserUpdateDto;
import com.thuongmoon.movieservice.services.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
public class JsonKafkaConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(JsonKafkaConsumer.class);
    @Autowired
    private ReviewService reviewService;

//    private final KafkaTemplate<String, GenerateSeatStatusRequest> kafkaTemplate;
//    private final SeatStatusService seatStatusService;
//
//    public JsonKafkaConsumer(SeatStatusService seatStatusService) {
//        this.seatStatusService = seatStatusService;
//    }
//
    @KafkaListener(topics = "review", groupId = "movie_booking_project")
    public void consume(@Payload ReviewDto request) {
        // call service to save it to database
        reviewService.addNewReview(request);
        LOGGER.info("Receive request add comment -> " + request.toString());
    }

    @KafkaListener(topics = "user_update", groupId = "movie_booking_project")
    public void consumeUserUpdate(@Payload UserUpdateDto request) {
        // call service to save it to database
        reviewService.updateReviewUserInfo(request);
        LOGGER.info("Receive request add comment -> " + request.toString());
    }

//    @KafkaListener(topics = "seat", groupId = "myGroup")
//    public void changeStatusSeat(@Payload Long id) {
//        Optional<Seat> seat = seatDao.findById(id);
//        if(seat.isPresent()) {
//            if(seat.get().getStatus().equals("available")) {
//                seat.get().setStatus("choosing");
//                seatDao.save(seat.get());
//            } else {
//                seat.get().setStatus("available");
//                seatDao.save(seat.get());
//            }
//        } else {
//            LOGGER.info("ERROR FIND EDIT SEAT STATUS");
//        }
//    }
}
