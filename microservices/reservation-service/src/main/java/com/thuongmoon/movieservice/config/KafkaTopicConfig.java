package com.thuongmoon.movieservice.config;

import com.thuongmoon.movieservice.request.ListSeatRequest;
import com.thuongmoon.movieservice.response.ListSeatResponse;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;

@Configuration
public class KafkaTopicConfig {
    @Bean
    public NewTopic cartTopic() {
        return TopicBuilder.name("cart_send")
                .build();
    }
    @Bean
    public NewTopic paymentTopic() {
        return TopicBuilder.name("payment_status")
                .build();
    }


}
