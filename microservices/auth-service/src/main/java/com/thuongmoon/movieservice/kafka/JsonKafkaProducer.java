package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.dto.ReviewDto;
import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.dto.UserUpdateDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class JsonKafkaProducer {
    private static Logger LOGGER = LoggerFactory.getLogger(JsonKafkaProducer.class);

    private KafkaTemplate<String, Object> kafkaTemplate;

    public JsonKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void addNewReview(ReviewDto data) {

        LOGGER.info(String.format("Message sent -> %s", data.toString()));

        Message<ReviewDto> message = MessageBuilder
                .withPayload(data)
                .setHeader(KafkaHeaders.TOPIC, "review")
                .build();

        kafkaTemplate.send(message);
    }

    public void updateUser(UserUpdateDto data) {

        LOGGER.info(String.format("Message sent -> %s", data.toString()));

        Message<UserUpdateDto> message = MessageBuilder
                .withPayload(data)
                .setHeader(KafkaHeaders.TOPIC, "user_update")
                .build();

        kafkaTemplate.send(message);
    }
}
