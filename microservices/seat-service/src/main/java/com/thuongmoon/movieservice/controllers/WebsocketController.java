package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.kafka.JsonKafkaProducer;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebsocketController {
    @Autowired
    private JsonKafkaProducer jsonKafkaProducer;

    @MessageMapping("/choosing-seat-ws")
//    @SendTo("/topic/seat-state")
    public void testWebsocket(ChoosingSeatRequest request) {
        jsonKafkaProducer.sendSeatStatusInfo(request);
    }
}
