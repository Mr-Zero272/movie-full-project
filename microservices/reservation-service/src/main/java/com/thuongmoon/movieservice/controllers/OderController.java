package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.dao.OrderDao;
import com.thuongmoon.movieservice.dto.OrderDto;
import com.thuongmoon.movieservice.dto.TestQuery;
import com.thuongmoon.movieservice.models.PaymentDetail;
import com.thuongmoon.movieservice.models.Statistical;
import com.thuongmoon.movieservice.request.AddNewOrderRequest;
import com.thuongmoon.movieservice.request.AddNewPaymentRequest;
import com.thuongmoon.movieservice.request.CreateNewZalopayPaymentRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1/reservation/order")
public class OderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private OrderDao orderDao;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrdersByUsername(@RequestHeader("username") String username) throws ExecutionException, InterruptedException {
        return orderService.getAllOrders(username);
    }

    @PostMapping("/payment")
    public ResponseEntity<ResponseMessage> createNewPayment(@RequestHeader("username") String username, @RequestBody AddNewPaymentRequest request) {
        return orderService.addNewPayment(username, request);
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<PaymentDetail> getPaymentDetail(@PathVariable("paymentId") String paymentId) {
        return orderService.getPaymentInfo(paymentId);
    }

    @PostMapping
    public ResponseEntity<ResponseMessage> createNewOrder(@RequestHeader("username") String username, @RequestBody AddNewOrderRequest request) {
        return orderService.addnewOrder(username, request);
    }

    @PostMapping("/creat-zalopay-payment")
    public ResponseEntity<ResponseMessage> createZaloPayment(@RequestBody CreateNewZalopayPaymentRequest request) throws IOException {
        return orderService.zalopayNewOrder(request);
    }

    @GetMapping("/statistical")
    public ResponseEntity<List<Statistical>> testQuery(@RequestParam("year") int year) {
        return ResponseEntity.ok(orderDao.getStatisticalOrder(year));
    }
}
