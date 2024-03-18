package com.thuongmoon.movieservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class PaymentStatusResponse {
    private String provider;
    private String invoiceId;
    private String status;
}
