package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.model.Genre;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GenreService {
    public ResponseEntity<List<Genre>> fetchAllGenres();
    public ResponseEntity<ResponsePagination> fetchPaginationGenres(String q, int size, int cPage);
    public ResponseEntity<String> addGenres(List<Genre> genres);
    @Transactional
    public ResponseEntity<ResponseMessage> editGenre(String id, String newName);
}
