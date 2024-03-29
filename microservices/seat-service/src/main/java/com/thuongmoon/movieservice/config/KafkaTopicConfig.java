package com.thuongmoon.movieservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic choosingSeatTopic() {
        return TopicBuilder.name("choosing_seat")
                .build();
    }

    @Bean
    public NewTopic seatTopic() {
        return TopicBuilder.name("seat_status")
                .build();
    }

    @Bean
    public NewTopic cartTopic() {
        return TopicBuilder.name("cart_reply")
                .build();
    }

}
