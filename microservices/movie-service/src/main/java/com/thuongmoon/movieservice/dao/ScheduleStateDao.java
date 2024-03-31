package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.ScheduleState;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScheduleStateDao extends MongoRepository<ScheduleState, String> {
    @Aggregation({"{$sort: {\"lastScheduledTime\": -1}}", "{$limit:  1}"})
    Optional<ScheduleState> findLastEle();
}
