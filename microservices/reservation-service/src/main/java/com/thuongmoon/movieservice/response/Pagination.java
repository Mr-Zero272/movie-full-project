package com.thuongmoon.movieservice.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pagination {
    private int size;
    private int currentPage;
    private int totalPage;
    private int totalResult;
}
