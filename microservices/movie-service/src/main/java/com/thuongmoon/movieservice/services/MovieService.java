package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.Pagination;
import com.thuongmoon.movieservice.model.Gallery;
import com.thuongmoon.movieservice.model.Genre;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Requirement;
import com.thuongmoon.movieservice.request.MovieAddRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface MovieService {
    public int getTotalMovie();
    public ResponseEntity<ResponseMessage> addMovie(MovieAddRequest request, MultipartFile[] movieImages, MultipartFile movieTrailer, MultipartFile[] actorImages, String username);
    public ResponseEntity<ResponseMessage> editRequest(String idRequirement, Requirement newRequirement);
    public ResponseEntity<ResponseMessage> editMovie(String movieId, Movie newMovie, List<MultipartFile> movieImages, MultipartFile movieTrailer);
    public ResponseEntity<ResponsePagination> fetchMoviePagination(String q, String type, List<ObjectId> genreIds, List<String> manufacturers, int size, int cPage);
    public ResponseEntity<Movie> getMovieInfo(String movieId);
    public ResponseEntity<List<String>> getListManufactures();
}
