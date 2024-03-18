package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JsonKafkaProducer {
    private static Logger LOGGER = LoggerFactory.getLogger(JsonKafkaProducer.class);

    private final KafkaTemplate<String, List<Seat>> kafkaTemplate;

    public JsonKafkaProducer(KafkaTemplate<String, List<Seat>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(List<Seat> data) {

        LOGGER.info(String.format("Message sent -> %s", data.toString()));

        Message<List<Seat>> message = MessageBuilder
                .withPayload(data)
                .setHeader(KafkaHeaders.TOPIC, "seat_status")
                .build();

        kafkaTemplate.send(message);
    }

    public void sendSeatStatusInfo(ChoosingSeatRequest request) {
        Message<ChoosingSeatRequest> message = MessageBuilder
                .withPayload(request)
                .setHeader(KafkaHeaders.TOPIC, "choosing_seat")
                .build();
        kafkaTemplate.send(message);
    }
}
