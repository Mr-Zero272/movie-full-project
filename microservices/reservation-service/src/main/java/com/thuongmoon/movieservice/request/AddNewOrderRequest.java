package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.models.SeatStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class AddNewOrderRequest {
    private String  paymentDetailId;
    private int totalTickets;
    private List<SeatStatus> listTickets;
}
