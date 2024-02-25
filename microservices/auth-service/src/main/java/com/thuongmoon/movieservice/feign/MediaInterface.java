package com.thuongmoon.movieservice.feign;

import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import static org.apache.tomcat.util.http.fileupload.FileUploadBase.MULTIPART_FORM_DATA;

@FeignClient("MEDIA-SERVICE")
public interface MediaInterface {
    @PostMapping(value = "api/v1/images/avatar", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage> addAvatarUser(
            @RequestPart("file") MultipartFile avatar, @RequestPart("newName") String newName, @RequestPart("oldName") String oldName);
}
