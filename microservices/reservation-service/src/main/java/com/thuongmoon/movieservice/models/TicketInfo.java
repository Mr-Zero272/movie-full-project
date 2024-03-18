package com.thuongmoon.movieservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketInfo {
    private String movieTitle;
    private LocalDateTime screeningStart;
    private String seatId;
}
