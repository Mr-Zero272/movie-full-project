package com.thuongmoon.movieservice.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateSeatStatusRequest {
    private String screeningId;
    private String auditoriumId;
    private int price;
}
