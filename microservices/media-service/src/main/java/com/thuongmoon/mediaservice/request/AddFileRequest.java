package com.thuongmoon.mediaservice.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Data
public class AddFileRequest {
    private MultipartFile[] files;
    private String type;
}
