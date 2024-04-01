package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.Pagination;
import com.thuongmoon.movieservice.model.Screening;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ScreeningService {
    public ResponseEntity<List<String>> getTypes();

    public ResponseEntity<List<Screening>> fetchScreeningByTypeAndDate(String type, LocalDateTime date, ObjectId movieId);

    public ResponseEntity<Screening> fetchScreeningById(String screeningId);

    public ResponseEntity<ResponsePagination> fetchAllScreeningGreaterThanDate(LocalDateTime date, int size, int cPage);
}
