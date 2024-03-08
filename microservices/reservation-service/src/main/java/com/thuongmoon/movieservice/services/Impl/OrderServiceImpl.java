package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.dao.OrderDao;
import com.thuongmoon.movieservice.dao.PaymentDetailDao;
import com.thuongmoon.movieservice.models.Order;
import com.thuongmoon.movieservice.models.PaymentDetail;
import com.thuongmoon.movieservice.request.AddNewOrderRequest;
import com.thuongmoon.movieservice.request.AddNewPaymentRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private PaymentDetailDao paymentDetailDao;

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
        responseMessage.setData(paymentDetailSaved.getId());
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> addnewOrder(String username, AddNewOrderRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<PaymentDetail> paymentDetail = paymentDetailDao.findById(request.getPaymentDetailId());
        if (paymentDetail.isPresent()) {
            Order newOrder = Order.builder()
                    .total(paymentDetail.get().getAmount())
                    .serviceFree((long) (paymentDetail.get().getAmount() * 0.05))
                    .creatAt(LocalDateTime.now())
                    .totalTickets(request.getTotalTickets())
                    .username(username)
                    .paymentDetailId(paymentDetail.get())
                    .listTickets(request.getListTickets())
                    .build();
            Order orderSaved = orderDao.save(newOrder);
            responseMessage.setMessage("Thank for your order!!");
        } else {
            responseMessage.setMessage("This order is not payment yet!!");
            responseMessage.setState("failed");
            responseMessage.setRspCode("400");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<PaymentDetail> getPaymentInfo(String paymentId) {
        Optional<PaymentDetail> paymentDetail = paymentDetailDao.findById(paymentId);
        return paymentDetail.map(detail -> new ResponseEntity<>(detail, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.OK));
    }
}
