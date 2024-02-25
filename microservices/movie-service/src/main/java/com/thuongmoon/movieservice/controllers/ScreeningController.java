package com.thuongmoon.movieservice.controllers;

import com.mongodb.client.DistinctIterable;
import com.thuongmoon.movieservice.model.Screening;
import com.thuongmoon.movieservice.services.ScreeningService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/movie/screening")
public class ScreeningController {
    @Autowired
    private ScreeningService screeningService;

    @GetMapping("/type")
    public ResponseEntity<List<String>> getScreeningTypes() {
        return screeningService.getTypes();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Screening>> getScreeningByTypeAndDate(
            @RequestParam("date")LocalDateTime date, @RequestParam(value = "type", required = false) String type, @RequestParam(value = "movieId", required = false)ObjectId movieId) {
        return screeningService.fetchScreeningByTypeAndDate(type, date, movieId);
    }

    @GetMapping("/{screeningId}")
    public ResponseEntity<Screening> fetchScreeningById(@PathVariable(value = "screeningId", required = true) String screeningId) {
        return screeningService.fetchScreeningById(screeningId);
    }
}
