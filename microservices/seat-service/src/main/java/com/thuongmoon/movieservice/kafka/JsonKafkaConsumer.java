package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import com.thuongmoon.movieservice.services.SeatStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class JsonKafkaConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(JsonKafkaConsumer.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendDataToWebSocket(String destination, Object data) {
        messagingTemplate.convertAndSend(destination, data);
    }
//    private final KafkaTemplate<String, GenerateSeatStatusRequest> kafkaTemplate;
    private final SeatStatusService seatStatusService;

    public JsonKafkaConsumer(SeatStatusService seatStatusService) {
        this.seatStatusService = seatStatusService;
    }

    @KafkaListener(topics = "seat_status", groupId = "movie_booking_project")
    public void consume(@Payload GenerateSeatStatusRequest request) {
        // call service to save it to database
        seatStatusService.generateSSByScreeningId(request);
        LOGGER.info("Receive request generate -> " + request.toString());
    }

    @KafkaListener(topics = "choosing_seat",  groupId = "movie_booking_project")
    public void consumeSeat(@Payload ChoosingSeatRequest seatStatus) {
        LOGGER.info(String.format("Received: -> %s", seatStatus.toString()));
        seatStatusService.updateSeatStatus(seatStatus);
        sendDataToWebSocket("/topic/seat-state", seatStatus);
    }
}
