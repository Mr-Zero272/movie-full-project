package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.dao.CartDao;
import com.thuongmoon.movieservice.dto.CartDto;
import com.thuongmoon.movieservice.kafka.KafkaService;
import com.thuongmoon.movieservice.models.Cart;
import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.models.TicketInfo;
import com.thuongmoon.movieservice.request.AddToCartRequest;
import com.thuongmoon.movieservice.request.ListSeatRequest;
import com.thuongmoon.movieservice.response.ListSeatResponse;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.requestreply.RequestReplyMessageFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    @Autowired
    private CartDao cartDao;
    @Autowired
    private KafkaService kafkaService;

    private final ReplyingKafkaTemplate<String, ListSeatRequest, ListSeatResponse> replyingKafkaTemplate;
    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> addToCart(String username, AddToCartRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Cart> cartOptional = cartDao.findByUsernameAndActiveTrue(username);
        responseMessage.setMessage("Add " + request.getTicketInfos().size() + " tickets successfully!!");
        if (cartOptional.isEmpty()) {
            Cart newCart = Cart.builder()
                    .totalTicket(request.getTicketInfos().size())
                    .lastUpdate(LocalDateTime.now())
                    .active(true)
                    .username(username)
                    .listTickets(request.getTicketInfos())
                    .build();
            cartDao.save(newCart);
        } else {
            List<TicketInfo> listOldTickets = cartOptional.get().getListTickets();
            listOldTickets.addAll(request.getTicketInfos());
            cartOptional.get().setListTickets(listOldTickets);
            cartOptional.get().setTotalTicket(listOldTickets.size());
            cartDao.save(cartOptional.get());
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CartDto> getAllTicketsByUsername(String username) throws ExecutionException, InterruptedException {
        Optional<Cart> cartOptional = cartDao.findByUsernameAndActiveTrue(username);
        if (cartOptional.isPresent()) {
            List<String> seatIds = cartOptional.get().getListTickets().stream().map(TicketInfo::getSeatId).toList();
            ListSeatRequest listSeatRequest = new ListSeatRequest();
            listSeatRequest.setSeatIds(seatIds);
            Message<ListSeatRequest> message = MessageBuilder.withPayload(listSeatRequest).setHeader(KafkaHeaders.TOPIC, "cart_send").build();
            RequestReplyMessageFuture<String, ListSeatRequest> replyFuture =
                    replyingKafkaTemplate.sendAndReceive(message);

            Message<ListSeatResponse> responseFromTopic = (Message<ListSeatResponse>) replyFuture.get();

            List<SeatStatus> seatStatuses = responseFromTopic.getPayload().getSeats();
            for (int i = 0; i < cartOptional.get().getTotalTicket(); i++) {
                seatStatuses.get(i).setMovieTitle(cartOptional.get().getListTickets().get(i).getMovieTitle());
                seatStatuses.get(i).setScreeningStart(cartOptional.get().getListTickets().get(i).getScreeningStart());
            }

            CartDto cartDto = CartDto.builder()
                    .id(cartOptional.get().getId())
                    .totalTicket(cartOptional.get().getTotalTicket())
                    .lastUpdate(cartOptional.get().getLastUpdate())
                    .listTickets(seatStatuses)
                    .active(cartOptional.get().isActive()).build();
            return new ResponseEntity<>(cartDto, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> deleteTicketInCart(String username, String ticketId) throws ExecutionException, InterruptedException {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Cart> cartOptional = cartDao.findByUsernameAndActiveTrue(username);
        if (cartOptional.isPresent()) {
            List<TicketInfo> listOldTickets = cartOptional.get().getListTickets();
            List<TicketInfo> listNewTickets = listOldTickets.stream().filter(ticket -> !ticket.getSeatId().equals(ticketId)).toList();
            cartOptional.get().setListTickets(listNewTickets);
            cartOptional.get().setTotalTicket(cartOptional.get().getTotalTicket() - 1);
            cartOptional.get().setLastUpdate(LocalDateTime.now());
            Cart cartSaved = cartDao.save(cartOptional.get());
            List<String> seatIds = cartOptional.get().getListTickets().stream().map(TicketInfo::getSeatId).toList();
            List<SeatStatus> seatStatuses = kafkaService.getListSeat(seatIds);
            for (int i = 0; i < listNewTickets.size(); i++) {
                seatStatuses.get(i).setMovieTitle(listOldTickets.get(i).getMovieTitle());
            }
            CartDto cartDto = CartDto.builder()
                    .id(cartOptional.get().getId())
                    .totalTicket(cartSaved.getTotalTicket())
                    .lastUpdate(cartSaved.getLastUpdate())
                    .listTickets(seatStatuses)
                    .active(cartSaved.isActive()).build();
            responseMessage.setMessage("Delete ticket successfully!!!");
            responseMessage.setData(cartDto);
        } else {
            responseMessage.setMessage("This user has no cart!!");
            responseMessage.setState("error");
            responseMessage.setRspCode("400");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Integer> getTicketQuantity(String username) {
        Optional<Cart> cartOptional = cartDao.findByUsernameAndActiveTrue(username);
        int quantity = 0;
        quantity = cartOptional.map(Cart::getTotalTicket).orElse(0);
        return new ResponseEntity<>(quantity, HttpStatus.OK);
    }
}
