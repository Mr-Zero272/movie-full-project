package com.thuongmoon.movieservice.response;

import com.thuongmoon.movieservice.dto.Pagination;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponsePagination {
    Object data;
    Pagination pagination;
}
