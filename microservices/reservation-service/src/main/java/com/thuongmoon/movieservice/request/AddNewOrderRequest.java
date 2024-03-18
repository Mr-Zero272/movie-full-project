package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.models.TicketInfo;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class AddNewOrderRequest {
    private String  invoiceId;
    private int totalTickets;
    private List<TicketInfo> listTickets;
}
