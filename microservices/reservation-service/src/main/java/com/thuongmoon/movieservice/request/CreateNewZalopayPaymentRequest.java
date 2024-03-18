package com.thuongmoon.movieservice.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateNewZalopayPaymentRequest {
    private String app_trans_id;
    private int amount;
    private String description;
    private String redirectUrl;
}
