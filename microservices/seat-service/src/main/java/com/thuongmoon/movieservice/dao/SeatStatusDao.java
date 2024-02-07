package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.SeatStatus;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatStatusDao extends MongoRepository<SeatStatus, String> {
    List<SeatStatus> findSeatStatusByScreeningId(String screeningId);
}
