package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
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

    private KafkaTemplate<String, GenerateSeatStatusRequest> kafkaTemplate;

    public JsonKafkaProducer(KafkaTemplate<String, GenerateSeatStatusRequest> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSeatGenerateRequest(GenerateSeatStatusRequest data) {

        LOGGER.info(String.format("Message sent -> %s", data.toString()));

        Message<GenerateSeatStatusRequest> message = MessageBuilder
                .withPayload(data)
                .setHeader(KafkaHeaders.TOPIC, "seat_status")
                .build();

        kafkaTemplate.send(message);
    }
}
