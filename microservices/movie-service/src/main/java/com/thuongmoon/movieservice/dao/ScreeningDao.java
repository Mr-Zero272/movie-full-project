package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Screening;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScreeningDao extends MongoRepository<Screening, String> {

    @Query(value = "{ 'screeningStart': { $gte: ?0, $lt: ?1 } }", fields = "{'movie': 0}")
    List<Screening> fetchByDate(LocalDateTime date1, LocalDateTime date2);
    @Query(value = "{ 'type': ?0, 'screeningStart': { $gte: ?1, $lt: ?2 } }", fields = "{'movie': 0}")
    List<Screening> fetchByTypeAndDate(String type, LocalDateTime date1, LocalDateTime date2);

    @Query(value = "{ 'screeningStart': { $gte: ?0, $lt: ?1 }, 'movie': ?2 }", fields = "{'movie': 0}")
    List<Screening> fetchByMovieIdAndDate(LocalDateTime date1, LocalDateTime date2, ObjectId movieId);

    @Query(value = "{ 'type': ?0, 'screeningStart': { $gte: ?1, $lt: ?2 }, 'movie': ?3 }", fields = "{'movie': 0}")
    List<Screening> fetchByTypeAndDateAndMovieId(String type, LocalDateTime date1, LocalDateTime date2, ObjectId movieId);

    Page<Screening> findAllByScreeningStartGreaterThanEqual(Pageable pageable, LocalDateTime screeningStart);
}
