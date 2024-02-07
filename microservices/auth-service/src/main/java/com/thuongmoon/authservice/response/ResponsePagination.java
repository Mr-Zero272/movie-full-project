package com.thuongmoon.authservice.response;

import com.thuongmoon.authservice.dto.Pagination;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePagination {
    Object data;
    Pagination pagination;
}
