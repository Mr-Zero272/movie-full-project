package com.thuongmoon.movieservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecificRequireType {
    private String typeName;
    private int nScreenings;
}
