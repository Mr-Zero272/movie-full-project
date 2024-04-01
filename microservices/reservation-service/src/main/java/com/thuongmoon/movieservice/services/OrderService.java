package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.OrderDto;
import com.thuongmoon.movieservice.models.PaymentDetail;
import com.thuongmoon.movieservice.request.AddNewOrderRequest;
import com.thuongmoon.movieservice.request.AddNewPaymentRequest;
import com.thuongmoon.movieservice.request.CreateNewZalopayPaymentRequest;
import com.thuongmoon.movieservice.request.SendTicketsMailRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface OrderService {
    ResponseEntity<ResponseMessage> addNewPayment(String username, AddNewPaymentRequest request);

    ResponseEntity<ResponseMessage> addnewOrder(String username, AddNewOrderRequest request);

    ResponseEntity<PaymentDetail> getPaymentInfo(String paymentId);

    ResponseEntity<ResponseMessage> zalopayNewOrder(CreateNewZalopayPaymentRequest request) throws IOException;

    ResponseEntity<List<OrderDto>> getAllOrders(String username) throws ExecutionException, InterruptedException;

    ResponseEntity<ResponseMessage> sendTicketsToCusByMail(SendTicketsMailRequest request);
}
