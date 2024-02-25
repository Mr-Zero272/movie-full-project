package com.thuongmoon.movieservice.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmoon.movieservice.dao.MovieDao;
import com.thuongmoon.movieservice.dto.TestDta;
import com.thuongmoon.movieservice.feign.MediaInterface;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Requirement;
import com.thuongmoon.movieservice.request.MovieAddRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.MovieService;
import com.thuongmoon.movieservice.services.SchedulingService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

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
                                                       @RequestHeader("username") String username) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        MovieAddRequest movieInfoParse = objectMapper.readValue(movieInfo, MovieAddRequest.class);
        return movieService.addMovie(movieInfoParse, movieImages, movieTrailer, actorImages, username);
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<ResponseMessage> editMovie(@PathVariable String movieId,
                                                     @RequestPart("movie") String movie,
                                                     @RequestPart(value = "movieImages", required = false) List<MultipartFile> movieImages,
                                                     @RequestPart(value = "movieTrailer", required = false) MultipartFile movieTrailer) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Movie movieParse = objectMapper.readValue(movie, Movie.class);
        return movieService.editMovie(movieId, movieParse, movieImages, movieTrailer);
    }

    @PutMapping("/requirement/{requirementId}")
    public ResponseEntity<ResponseMessage> editRequirement(@PathVariable String requirementId, @RequestBody Requirement requirement) {
        return movieService.editRequest(requirementId, requirement);
    }

    @PostMapping("/schedule")
    public ResponseEntity<String> scheduling(@RequestBody LocalDateTime startTime) {
        System.out.println(startTime.toString());
        return scheduleService.doSchedule(startTime);
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

    @GetMapping("/info/{movieId}")
    public ResponseEntity<Movie> getMovieInfo(@PathVariable String movieId) {
        return movieService.getMovieInfo(movieId);
    }

    @GetMapping("/manufacture")
    public ResponseEntity<List<String>> getAllManufactures() {
        return movieService.getListManufactures();
    }
}
