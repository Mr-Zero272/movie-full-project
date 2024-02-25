package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.ScreeningDao;
import com.thuongmoon.movieservice.model.Screening;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScreeningService {
    @Autowired
    private ScreeningDao screeningDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    public ResponseEntity<List<String>> getTypes() {
        List<String> distinctTypes = mongoTemplate.query(Screening.class).distinct("type").as(String.class).all();
        return new ResponseEntity<>(distinctTypes, HttpStatus.OK);
    }

    public ResponseEntity<List<Screening>> fetchScreeningByTypeAndDate(String type, LocalDateTime date, ObjectId movieId) {
        LocalDateTime date2 = date.plusDays(1);
        List<Screening> screenings = new ArrayList<>();
        if (type == null && movieId == null) {
            screenings = screeningDao.fetchByDate(date, date2);
            return new ResponseEntity<>(screenings, HttpStatus.OK);
        }

        if (movieId == null) {
            screenings = screeningDao.fetchByTypeAndDate(type, date, date2);
        } else {
            screenings = screeningDao.fetchByTypeAndDateAndMovieId(type, date, date2, movieId);
        }
        return new ResponseEntity<>(screenings, HttpStatus.OK);
    }

    public ResponseEntity<Screening> fetchScreeningById(String screeningId) {
        Optional<Screening> screening = screeningDao.findById(screeningId);
        return screening.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.OK));
    }
}
