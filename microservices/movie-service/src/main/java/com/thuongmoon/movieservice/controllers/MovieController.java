package com.thuongmoon.movieservice.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmoon.movieservice.feign.MediaInterface;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Requirement;
import com.thuongmoon.movieservice.request.MovieAddRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.Impl.MovieServiceImpl;
import com.thuongmoon.movieservice.services.Impl.SchedulingServiceImpl;
import com.thuongmoon.movieservice.services.MovieService;
import com.thuongmoon.movieservice.services.SchedulingService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/movie")
public class MovieController {
    @Autowired
    private MovieService movieService;
    @Autowired
    private MediaInterface mediaInterface;
    @Autowired
    private SchedulingService scheduleService;

    @PostMapping("/test-image")
    public ResponseEntity<ResponseMessage> addImagesForMovies(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("type") String type) {
        return mediaInterface.addFiles(files, type);
    }

    @PostMapping
    public ResponseEntity<ResponseMessage> addNewMovie(@RequestPart("movieInfo") String movieInfo,
                                                       @RequestPart(value = "movieImages", required = false) MultipartFile[] movieImages,
                                                       @RequestPart(value = "movieTrailer", required = false) MultipartFile movieTrailer,
                                                       @RequestPart(value = "actorImages", required = false) MultipartFile[] actorImages,
                                                       @RequestHeader("username") String username,
                                                       @RequestHeader("role") String role) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        MovieAddRequest movieInfoParse = objectMapper.readValue(movieInfo, MovieAddRequest.class);
        return movieService.addMovie(movieInfoParse, movieImages, movieTrailer, actorImages, username, role);
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<ResponseMessage> editMovie(@PathVariable String movieId,
                                                     @RequestPart(value = "movieInfo") String movieInfo,
                                                     @RequestPart(value = "movieImages", required = false) List<MultipartFile> movieImages,
                                                     @RequestPart(value = "actorImages", required = false) List<MultipartFile> actorImages,
                                                     @RequestPart(value = "movieTrailer", required = false) MultipartFile movieTrailer) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        MovieAddRequest movieInfoParse = objectMapper.readValue(movieInfo, MovieAddRequest.class);
//        System.out.println(movieInfoParse.toString());
        return movieService.editMovie(movieId, movieInfoParse.getMovie(), actorImages, movieImages, movieTrailer);
    }

    @PutMapping("/approve/{movieId}")
    public ResponseEntity<ResponseMessage> editStateMovie(@RequestHeader("role") String role, @PathVariable String movieId, @RequestBody Map<String,String> request) {
        return movieService.editStateMovie(role, movieId, request.get("state"));
    }

    @PutMapping("/requirement/{requirementId}")
    public ResponseEntity<ResponseMessage> editRequirement(@PathVariable String requirementId, @RequestBody Requirement requirement) {
        return movieService.editRequest(requirementId, requirement);
    }

    @PostMapping("/schedule")
    public ResponseEntity<String> scheduling(@RequestHeader("role") String role, @RequestBody LocalDateTime startTime) {
        System.out.println(startTime.toString());
        return scheduleService.doSchedule(role, startTime);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponsePagination> fetchMoviePagination(@RequestParam(required = false, defaultValue = "") String q,
                                                     @RequestParam(required = false, defaultValue = "") String type,
                                                     @RequestParam(required = false) List<ObjectId> genreIds,
                                                     @RequestParam(required = false) List<String> manufacturers,
                                                     @RequestParam(required = false, defaultValue = "6") int size,
                                                     @RequestParam(required = false, defaultValue = "1") int cPage) {
        return movieService.fetchMoviePagination(q, type, genreIds, manufacturers, size, cPage);
    }

    @GetMapping("/new")
    public ResponseEntity<ResponsePagination> fetchNewMoviePagination(@RequestParam(required = false, defaultValue = "6") int size,
                                                                   @RequestParam(required = false, defaultValue = "1") int cPage) {
        return movieService.fetchNewMoviePagination(size, cPage);
    }

    @GetMapping("/business/search")
    public ResponseEntity<ResponsePagination> fetchAdminMoviePagination(@RequestHeader("username") String username,
                                                                           @RequestHeader("role") String role,
                                                                           @RequestParam(required = false, defaultValue = "") String q,
                                                                           @RequestParam(required = false, defaultValue = "6") int size,
                                                                           @RequestParam(required = false, defaultValue = "1") int cPage) {
        return movieService.fetchAdminMoviePagination(username, role, q, size, cPage);
    }

    @GetMapping("/info/{movieId}")
    public ResponseEntity<Movie> getMovieInfo(@PathVariable String movieId) {
        return movieService.getMovieInfo(movieId);
    }

    @GetMapping("/manufacture")
    public ResponseEntity<List<String>> getAllManufactures() {
        return movieService.getListManufactures();
    }

    @GetMapping("/totalMovie")
    public ResponseEntity<Integer> getTotalMovie() {
        return ResponseEntity.ok(movieService.getTotalMovie());
    }
}
