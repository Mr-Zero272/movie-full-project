package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.dao.CartDao;
import com.thuongmoon.movieservice.dao.OrderDao;
import com.thuongmoon.movieservice.dao.PaymentDetailDao;
import com.thuongmoon.movieservice.dto.CartDto;
import com.thuongmoon.movieservice.dto.OrderDto;
import com.thuongmoon.movieservice.kafka.KafkaService;
import com.thuongmoon.movieservice.models.*;
import com.thuongmoon.movieservice.request.*;
import com.thuongmoon.movieservice.response.ListSeatResponse;
import com.thuongmoon.movieservice.response.PaymentStatusResponse;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.OrderService;
import com.thuongmoon.movieservice.zalocrypto.HMACUtil;
import lombok.RequiredArgsConstructor;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyMessageFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private PaymentDetailDao paymentDetailDao;
    @Autowired
    private KafkaService kafkaService;
    @Autowired
    private CartDao cartDao;

    private final ReplyingKafkaTemplate<String, ListSeatRequest, ListSeatResponse> replyingKafkaTemplate;


    private static Map<String, String> config = new HashMap<String, String>() {{
        put("app_id", "2554");
        put("key1", "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn");
        put("key2", "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf");
        put("endpoint", "https://sb-openapi.zalopay.vn/v2/create");
    }};

    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> addNewPayment(String username, AddNewPaymentRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        PaymentDetail newPaymentDetail = PaymentDetail.builder()
                .amount(request.getAmount())
                .provider(request.getProvider())
                .invoiceId(request.getInvoiceId())
                .status(request.getStatus())
                .paidBy(username)
                .createAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
        PaymentDetail paymentDetailSaved = paymentDetailDao.save(newPaymentDetail);
        PaymentStatusResponse paymentStatusResponse = PaymentStatusResponse.builder()
                .invoiceId(request.getInvoiceId())
                .provider(request.getProvider())
                .status(request.getStatus())
                .build();
        kafkaService.sendPaymentStatus(paymentStatusResponse);
        responseMessage.setData(paymentDetailSaved.getId());
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> addnewOrder(String username, AddNewOrderRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<PaymentDetail> paymentDetail = paymentDetailDao.findByInvoiceId(request.getInvoiceId());
        Optional<Cart> cartOptional = cartDao.findByUsernameAndActiveTrue(username);
        Order newOrder = new Order();
        newOrder.setCreatedAt(LocalDateTime.now());
        newOrder.setTotalTickets(request.getTotalTickets());
        newOrder.setUsername(username);
        newOrder.setListTickets(request.getListTickets());
        if (paymentDetail.isPresent()) {
            newOrder.setTotal(paymentDetail.get().getAmount());
            newOrder.setServiceFree((long) (paymentDetail.get().getAmount() * 0.05));
            newOrder.setPaymentDetail(paymentDetail.get());
            responseMessage.setMessage("Thank for your order!!");
        } else {
            newOrder.setTotal(0L);
            newOrder.setServiceFree(0L);
            newOrder.setPaymentDetail(null);
            responseMessage.setMessage("This order is not payment yet!!");
            responseMessage.setState("warning");
            responseMessage.setRspCode("400");
        }
        request.getListTickets().forEach(ticket -> {
            ChoosingSeatRequest choosingSeatRequest = new ChoosingSeatRequest(ticket.getSeatId(), "booked");
            kafkaService.sendSeatStatusInfo(choosingSeatRequest);
        });
        orderDao.save(newOrder);
        // check if the user have cart or not
        if (cartOptional.isPresent()) {
            List<TicketInfo> listOldTicket = cartOptional.get().getListTickets();
            List<TicketInfo> listNewTicket = listOldTicket.stream().filter(ticketInfo ->
                    request.getListTickets().stream()
                            .noneMatch(obj2 -> obj2.getSeatId().equals(ticketInfo.getSeatId()))).toList();
            cartOptional.get().setListTickets(listNewTicket);
            cartDao.save(cartOptional.get());
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<PaymentDetail> getPaymentInfo(String paymentId) {
        Optional<PaymentDetail> paymentDetail = paymentDetailDao.findById(paymentId);
        return paymentDetail.map(detail -> new ResponseEntity<>(detail, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.OK));
    }

    @Override
    public ResponseEntity<ResponseMessage> zalopayNewOrder(CreateNewZalopayPaymentRequest request) throws IOException {
        ResponseMessage responseMessage = new ResponseMessage();
        Random rand = new Random();
        int random_id = rand.nextInt(1000000);
        final Map embed_data = new HashMap() {{
        }};
        embed_data.put("redirecturl", request.getRedirectUrl());

        Map<String, Object> order = new HashMap<String, Object>() {{
            put("app_id", config.get("app_id"));
            put("app_trans_id", request.getApp_trans_id()); // translation missing: en.docs.shared.sample_code.comments.app_trans_id
            put("app_time", System.currentTimeMillis()); // miliseconds
            put("app_user", "user123");
            put("amount", request.getAmount());
            put("description", request.getDescription());
            put("bank_code", "");
            put("item", "[{}]");
            put("embed_data", new JSONObject(embed_data).toString());
        }};

        // app_id +”|”+ app_trans_id +”|”+ appuser +”|”+ amount +"|" + app_time +”|”+ embed_data +"|" +item
        String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
                + "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");
        order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.get("key1"), data));

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(config.get("endpoint"));

        List<NameValuePair> params = new ArrayList<>();
        for (Map.Entry<String, Object> e : order.entrySet()) {
            params.add(new BasicNameValuePair(e.getKey(), e.getValue().toString()));
        }

        String paramsUrl = "";
        for (int i = 0; i < params.size(); i++) {
            paramsUrl += params.get(i).getName() + "=" + params.get(i).getValue() + "&";
        }

        // Content-Type: application/x-www-form-urlencoded
        post.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {
            resultJsonStr.append(line);
        }

        JSONObject result = new JSONObject(resultJsonStr.toString());
        Map<String, Object> objResult = new HashMap<>();
        for (String key : result.keySet()) {
            objResult.put(key, result.get(key));
        }

        responseMessage.setData(objResult);
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<OrderDto>> getAllOrders(String username) throws ExecutionException, InterruptedException {
        List<Order> orders = orderDao.findByUsername(username);
        List<OrderDto> orderDtos = new ArrayList<>();
        for (Order order: orders) {
            List<String> seatIds = order.getListTickets().stream().map(TicketInfo::getSeatId).toList();
            ListSeatRequest listSeatRequest = new ListSeatRequest();
            listSeatRequest.setSeatIds(seatIds);
            Message<ListSeatRequest> message = MessageBuilder.withPayload(listSeatRequest).setHeader(KafkaHeaders.TOPIC, "cart_send").build();
            RequestReplyMessageFuture<String, ListSeatRequest> replyFuture =
                    replyingKafkaTemplate.sendAndReceive(message);

            Message<ListSeatResponse> responseFromTopic = (Message<ListSeatResponse>) replyFuture.get();

            List<SeatStatus> seatStatuses = responseFromTopic.getPayload().getSeats();
            for (int i = 0; i < order.getTotalTickets(); i++) {
                seatStatuses.get(i).setMovieTitle(order.getListTickets().get(i).getMovieTitle());
                seatStatuses.get(i).setScreeningStart(order.getListTickets().get(i).getScreeningStart());
            }

            OrderDto orderDto = OrderDto.builder()
                    .id(order.getId())
                    .total(order.getTotal())
                    .createdAt(order.getCreatedAt())
                    .paymentDetail(order.getPaymentDetail())
                    .listTickets(seatStatuses)
                    .build();
            orderDtos.add(orderDto);
        }
        return new ResponseEntity<>(orderDtos, HttpStatus.OK);
    }
}
