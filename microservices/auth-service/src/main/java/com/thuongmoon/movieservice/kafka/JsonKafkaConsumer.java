package com.thuongmoon.movieservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class JsonKafkaConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(JsonKafkaConsumer.class);

//    private final KafkaTemplate<String, GenerateSeatStatusRequest> kafkaTemplate;
//    private final SeatStatusService seatStatusService;
//
//    public JsonKafkaConsumer(SeatStatusService seatStatusService) {
//        this.seatStatusService = seatStatusService;
//    }
//
//    @KafkaListener(topics = "seat_status", groupId = "myGroup")
//    public void consume(@Payload GenerateSeatStatusRequest request) {
//        // call service to save it to database
//        seatStatusService.generateSSByScreeningId(request);
//        LOGGER.info("Receive request generate -> " + request.toString());
//    }

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
