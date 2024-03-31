package com.thuongmoon.movieservice.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Statistical {
    private long totalSum;
    private long serviceFeeSum;
    private int totalTickets;
    private int totalOrders;
    private int month;
}
