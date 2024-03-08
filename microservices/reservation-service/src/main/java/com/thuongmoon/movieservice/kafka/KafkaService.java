package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.ListSeatRequest;
import com.thuongmoon.movieservice.response.ListSeatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyMessageFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class KafkaService {
    private final ReplyingKafkaTemplate<String, ListSeatRequest, ListSeatResponse> replyingKafkaTemplate;

    public List<SeatStatus> getListSeat(List<String> listSeatIds) throws ExecutionException, InterruptedException {
        ListSeatRequest listSeatRequest = new ListSeatRequest();
        listSeatRequest.setSeatIds(listSeatIds);
        Message<ListSeatRequest> message = MessageBuilder.withPayload(listSeatRequest).setHeader(KafkaHeaders.TOPIC, "cart_send").build();
        RequestReplyMessageFuture<String, ListSeatRequest> replyFuture =
                replyingKafkaTemplate.sendAndReceive(message);

        Message<ListSeatResponse> responseFromTopic = (Message<ListSeatResponse>) replyFuture.get();
        return responseFromTopic.getPayload().getSeats();
    }
}
