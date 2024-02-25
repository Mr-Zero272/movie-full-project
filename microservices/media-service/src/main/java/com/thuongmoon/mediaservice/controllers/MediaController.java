package com.thuongmoon.mediaservice.controllers;

import com.thuongmoon.mediaservice.response.ResponseMessage;
import com.thuongmoon.mediaservice.services.FilesStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.apache.tomcat.util.http.fileupload.FileUploadBase.MULTIPART_FORM_DATA;

@RequestMapping("/api/v1")
@RestController
@RequiredArgsConstructor
public class MediaController {
    private final FilesStorageService filesStorageService;

    @GetMapping("/images/{imageName}")
    public @ResponseBody ResponseEntity<Resource> downloadImageFromFileSystem(@PathVariable("imageName") String imageName, @RequestParam(required = false, defaultValue = "") String type) throws IOException {
        //String imagePath = "D:\\HockyI_nam4\\Nien_luan_co_so\\csdl_booking_movie\\images\\movies\\" + imageName;
        //byte[] image = Files.readAllBytes(new File(imagePath).toPath());
        System.out.println(imageName);
        Path imagePath;
        if (type.equals("avatar")) {
            imagePath = Paths.get("uploads/images/avatars");
        } else {
            imagePath = Paths.get("uploads/images/movies");
        }
        Resource image = filesStorageService.loadFileWithPath(imagePath, imageName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);

        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    @GetMapping("/videos/{videoName}")
    public @ResponseBody ResponseEntity<Resource> getVideoFromFileSystem(@PathVariable("videoName") String videoName) throws IOException {
        //Path videoPath = Paths.get("uploads/videos/trailer");
//		String videoPath = "D:\\HockyI_nam4\\Nien_luan_co_so\\csdl_booking_movie\\videos\\trailer\\" + videoName;
//		byte[] video = Files.readAllBytes(new File(videoPath).toPath());
        Path imagePath = Paths.get("uploads/videos/trailer");
        Resource video = filesStorageService.loadFileWithPath(imagePath, videoName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(video, headers, HttpStatus.OK);
    }

    @PostMapping(value = "/images/avatar", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage> addAvatarUser(
            @RequestPart("file") MultipartFile avatar, @RequestPart("newName") String newName, @RequestPart("oldName") String oldName) {
        return filesStorageService.saveAvatarUser(avatar, newName, oldName);
    }

    @PostMapping(value = "/images", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage> addFiles(
            @RequestPart("files") MultipartFile[] files, @RequestPart("type") String type) {
        return filesStorageService.saveMediaMaterial(files, type);
    }

    @PostMapping(value = "/videos", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage> addTrailerForMovies(
            @RequestPart("file") MultipartFile file, @RequestPart("type") String type) {
        MultipartFile[] multipartFiles = new MultipartFile[1];
        multipartFiles[0] = file;
        return filesStorageService.saveMediaMaterial(multipartFiles, type);
    }

    @DeleteMapping
    public ResponseEntity<ResponseMessage> deleteFile(@RequestParam List<String> fileNames, @RequestParam String type) {
        return filesStorageService.deleteMediaMaterial(fileNames, type);
    }

}
