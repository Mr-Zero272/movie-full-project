package com.thuongmoon.movieservice.kafka;

import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import com.thuongmoon.movieservice.request.ListSeatRequest;
import com.thuongmoon.movieservice.response.ListSeatResponse;
import com.thuongmoon.movieservice.response.PaymentStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
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
    @Autowired
    private KafkaTemplate<String, PaymentStatusResponse> kafkaTemplate;

    public List<SeatStatus> getListSeat(List<String> listSeatIds) throws ExecutionException, InterruptedException {
        ListSeatRequest listSeatRequest = new ListSeatRequest();
        listSeatRequest.setSeatIds(listSeatIds);
        Message<ListSeatRequest> message = MessageBuilder.withPayload(listSeatRequest).setHeader(KafkaHeaders.TOPIC, "cart_send").build();
        RequestReplyMessageFuture<String, ListSeatRequest> replyFuture =
                replyingKafkaTemplate.sendAndReceive(message);

        Message<ListSeatResponse> responseFromTopic = (Message<ListSeatResponse>) replyFuture.get();
        return responseFromTopic.getPayload().getSeats();
    }

    public void sendPaymentStatus(PaymentStatusResponse response) {
        Message<PaymentStatusResponse> message = MessageBuilder
                .withPayload(response)
                .setHeader(KafkaHeaders.TOPIC, "payment_status")
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
