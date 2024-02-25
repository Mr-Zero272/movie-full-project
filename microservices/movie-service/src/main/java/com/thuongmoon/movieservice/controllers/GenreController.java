package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.model.Genre;
import com.thuongmoon.movieservice.request.EditGenreRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movie/genre")
public class GenreController {
    @Autowired
    private GenreService genreService;

    @GetMapping("/all")
    public ResponseEntity<List<Genre>> findAllGenre() {
        return genreService.fetchAllGenres();
    }

    @GetMapping
    public ResponseEntity<ResponsePagination> findPaginationGenre(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "6") int size,
            @RequestParam(required = false, defaultValue = "1") int cPage) {
        return genreService.fetchPaginationGenres(q, size, cPage);
    }

    @PostMapping
    public ResponseEntity<String> addGenre(@RequestBody List<Genre> genres) {
        return genreService.addGenres(genres);
    }

    @PutMapping("/{genreId}")
    public ResponseEntity<ResponseMessage> editGenre(@PathVariable String genreId, @RequestBody EditGenreRequest request) {
        return genreService.editGenre(genreId, request.getNewName());
    }
}
