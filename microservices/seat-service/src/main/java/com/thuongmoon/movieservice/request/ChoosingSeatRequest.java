package com.thuongmoon.movieservice.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChoosingSeatRequest {
    private String id;
    private String status;
    private String username;
}
