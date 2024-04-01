package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.dto.TicketMailRequest;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class SendTicketsMailRequest {
    private List<TicketMailRequest> tickets;
    private String mail;
}
