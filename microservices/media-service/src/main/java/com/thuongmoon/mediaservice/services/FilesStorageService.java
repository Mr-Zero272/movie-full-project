package com.thuongmoon.mediaservice.services;

import com.thuongmoon.mediaservice.response.ResponseMessage;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public interface FilesStorageService {
    public void init();

    public void save(MultipartFile file);

    public Resource load(String filename);

    public void deleteAll();

    public Stream<Path> loadAll();

    public boolean delete(String filename);

    public Resource loadFileWithPath(Path rootFilePath, String fileName);

    public boolean deleteFileWithPath(Path r, String fileName);

    public void saveFileWithPath(Path path, MultipartFile file, String newFilename);

    public ResponseEntity<ResponseMessage> saveMediaMaterial(MultipartFile[] files, String type);

    public ResponseEntity<ResponseMessage> deleteMediaMaterial(List<String> fileNames, String type);

    public ResponseEntity<ResponseMessage> saveAvatarUser(MultipartFile avatar, String newName, String oldName);
}
