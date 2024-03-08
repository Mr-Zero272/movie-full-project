package com.thuongmoon.movieservice.response;

import com.thuongmoon.movieservice.models.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListSeatResponse {
    private List<SeatStatus> seats;
}
