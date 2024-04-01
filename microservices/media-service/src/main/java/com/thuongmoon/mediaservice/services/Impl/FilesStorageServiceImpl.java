package com.thuongmoon.mediaservice.services.Impl;

import com.thuongmoon.mediaservice.response.ResponseMessage;
import com.thuongmoon.mediaservice.services.FilesStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

//Reference from https://bezkoder.com/
@Service
public class FilesStorageServiceImpl implements FilesStorageService {

    private final Path root = Paths.get("uploads");

    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public void save(MultipartFile file) {
        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public boolean delete(String filename) {
        try {
            Path file = root.resolve(filename);
            return Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public Resource loadFileWithPath(Path rootFilePath, String fileName) {
        try {
            Path file = rootFilePath.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public boolean deleteFileWithPath(Path r, String fileName) {
        try {
            Path file = r.resolve(fileName);
            return Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public void saveFileWithPath(Path path, MultipartFile file, String newFilename) {
        try {
            Files.copy(file.getInputStream(), path.resolve(newFilename));
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    public ResponseEntity<ResponseMessage> saveMediaMaterial(MultipartFile[] files, String type) {
        Path path = Paths.get("uploads/images/movies");
        if (type.equals("avatar")) {
            path = Paths.get("uploads/images/avatars");
        }

        if (type.equals("trailer")) {
            path = Paths.get("uploads/videos/trailer");
        }

        ResponseMessage responseMessage = new ResponseMessage();
        responseMessage.setMessage("Save file successfully!");
        responseMessage.setState("success");
        responseMessage.setRspCode("200");


        Path finalPath = path;
        Arrays.asList(files).forEach(file -> {
            try {
                Files.copy(file.getInputStream(), finalPath.resolve(file.getOriginalFilename()));
            } catch (IOException e) {
                if (e instanceof FileAlreadyExistsException) {
                    throw new RuntimeException("This file (" + file.getOriginalFilename() + ") already exists.");
                }

                responseMessage.setMessage("Some files are already exists!");
                responseMessage.setState("warning");
                responseMessage.setRspCode("200");

                throw new RuntimeException(e.getMessage());
            }
        });

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<ResponseMessage> deleteMediaMaterial(List<String> fileNames, String type) {
        Path path = Paths.get("uploads/images/movies");
        if (type.equals("avatar")) {
            path = Paths.get("uploads/images/avatars");
        }

        if (type.equals("trailer")) {
            path = Paths.get("uploads/videos/trailer");
        }

        ResponseMessage responseMessage = new ResponseMessage();
        responseMessage.setMessage("Save file successfully!");
        responseMessage.setState("success");
        responseMessage.setRspCode("200");


        Path finalPath = path;
        fileNames.forEach(fileName -> {
            try {
                Path fileDelete = finalPath.resolve(Objects.requireNonNull(fileName));
                Files.deleteIfExists(fileDelete);
            } catch (IOException e) {
                if (e instanceof FileAlreadyExistsException) {
                    throw new RuntimeException("Cannot delete this file: (" + fileName + ")");
                }

                responseMessage.setMessage("Some files are already exists!");
                responseMessage.setState("warning");
                responseMessage.setRspCode("200");

                throw new RuntimeException(e.getMessage());
            }
        });

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<ResponseMessage> saveAvatarUser(MultipartFile avatar, String newName, String oldName) {
        ResponseMessage responseMessage = new ResponseMessage();
        responseMessage.setMessage("Save file successfully!");
        responseMessage.setState("success");
        responseMessage.setRspCode("200");
        Path path = Paths.get("uploads/images/avatars");
        try {
            Files.copy(avatar.getInputStream(), path.resolve(newName));
            if (!oldName.equals("http://localhost:8272/api/v1/media/images/no_image.png?type=avatar")) {
                Path fileDelete = path.resolve(Objects.requireNonNull(oldName));
                Files.deleteIfExists(fileDelete);
            }
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                responseMessage.setMessage("Some thing went wrong went try to edit avatar files!");
                responseMessage.setState("warning");
                responseMessage.setRspCode("200");
                throw new RuntimeException("A file of that name already exists.");
            }

            throw new RuntimeException(e.getMessage());
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}
