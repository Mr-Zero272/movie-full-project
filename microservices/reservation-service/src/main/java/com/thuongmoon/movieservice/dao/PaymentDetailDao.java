package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.PaymentDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentDetailDao extends MongoRepository<PaymentDetail, String> {
    Optional<PaymentDetail> findByInvoiceId(String invoiceId);
}
