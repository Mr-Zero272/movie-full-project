package com.thuongmoon.movieservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

//    @Bean
//    public NewTopic mrzeroTopic() {
//        return TopicBuilder.name("mrzero")
//                .build();
//    }

    @Bean
    public NewTopic seatTopic() {
        return TopicBuilder.name("seat_status")
                .build();
    }

}
