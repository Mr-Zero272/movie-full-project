package com.thuongmoon.authservice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class ResponseMessage {
    private String message;
    private String rspCode;
    private String state;
    private Object data;

    public ResponseMessage() {
        message = "";
        rspCode = "200";
        state = "success";
    }
}
