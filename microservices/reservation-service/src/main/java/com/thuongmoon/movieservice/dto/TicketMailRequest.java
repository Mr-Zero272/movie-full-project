package com.thuongmoon.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketMailRequest {
    private String title;
    private LocalDateTime date;
    private String dateFormat;
    private String begins;
    private String hall;
    private String row;
    private String seat;
    private String id;
    private int price;
}
