package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.models.TicketInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {
    private List<TicketInfo> ticketInfos;
}
