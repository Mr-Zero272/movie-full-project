package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.PaymentDetail;
import com.thuongmoon.movieservice.request.AddNewOrderRequest;
import com.thuongmoon.movieservice.request.AddNewPaymentRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservation/order")
public class OderController {
    @Autowired
    private OrderService orderService;

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
}
