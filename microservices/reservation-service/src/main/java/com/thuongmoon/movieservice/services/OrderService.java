package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.PaymentDetail;
import com.thuongmoon.movieservice.request.AddNewOrderRequest;
import com.thuongmoon.movieservice.request.AddNewPaymentRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

public interface OrderService {
    ResponseEntity<ResponseMessage> addNewPayment(String username, AddNewPaymentRequest request);

    ResponseEntity<ResponseMessage> addnewOrder(String username, AddNewOrderRequest request);

    ResponseEntity<PaymentDetail> getPaymentInfo(String paymentId);
}
