package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.request.AddAuditoriumRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditoriumService {
    @Transactional
    public ResponseEntity<ResponseMessage> addNewAuditorium(AddAuditoriumRequest request);

    public ResponseEntity<List<String>> provideAuditoriumNeed(Integer numAuditoriums, LocalDateTime startDate);

    public ResponseEntity<ResponseMessage> editAuditorium(String id, Auditorium newAuditorium);

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums();

    ResponseEntity<Auditorium> fetchAuditoriumById(String id);

    ResponseEntity<ResponsePagination> searchPaginationAuditorium(String q, int size, int cPage);
}
