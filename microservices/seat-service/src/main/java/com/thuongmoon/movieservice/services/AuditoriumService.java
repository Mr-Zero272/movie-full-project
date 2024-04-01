package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.request.AddAuditoriumRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface AuditoriumService {
    @Transactional
    public ResponseEntity<ResponseMessage> addNewAuditorium(AddAuditoriumRequest request);

    public ResponseEntity<List<String>> provideAuditoriumNeed(Integer numAuditoriums, LocalDateTime startDate);

    public ResponseEntity<ResponseMessage> editAuditorium(String id, Auditorium newAuditorium);

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums();
}
