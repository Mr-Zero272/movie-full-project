package com.thuongmoon.movieservice.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddNewPaymentRequest {
    private Long amount;
    private String provider;
    private String invoiceId;
    private String status;
}
