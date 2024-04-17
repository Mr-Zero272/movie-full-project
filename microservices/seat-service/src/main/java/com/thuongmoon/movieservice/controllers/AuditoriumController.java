package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.request.AddAuditoriumRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.AuditoriumService;
import com.thuongmoon.movieservice.services.Impl.AuditoriumServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auditorium")
public class AuditoriumController {

    @Autowired
    private AuditoriumService auditoriumService;

    @PostMapping
    public ResponseEntity<ResponseMessage> addNewAuditorium(@RequestBody AddAuditoriumRequest request) {
        return auditoriumService.addNewAuditorium(request);
    }

    @PutMapping("/{auditoriumId}")
    public ResponseEntity<ResponseMessage> editAuditorium(@PathVariable("auditoriumId") String id, @RequestBody Auditorium auditorium) {
        return auditoriumService.editAuditorium(id, auditorium);
    }

    @GetMapping("/{auditoriumId}")
    public ResponseEntity<Auditorium> getAuditoriumById(@PathVariable("auditoriumId") String id) {
        return auditoriumService.fetchAuditoriumById(id);
    }

    @GetMapping("/av-auditorium")
    public ResponseEntity<List<String>> getAvailableAuditorium(@Param("numAuditoriums") Integer numAuditoriums,
                                                               @Param("startDate") LocalDateTime startDate) {
        return auditoriumService.provideAuditoriumNeed(numAuditoriums, startDate);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponsePagination> searchAuditorium(@RequestParam(required = false, defaultValue = "") String q,
                                                               @RequestParam(required = false, defaultValue = "6") int size,
                                                               @RequestParam(required = false, defaultValue = "1") int cPage) {
        return auditoriumService.searchPaginationAuditorium(q, size, cPage);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Auditorium>> getAllAuditoriums() {
        return auditoriumService.fetchAllAuditoriums();
    }
}
