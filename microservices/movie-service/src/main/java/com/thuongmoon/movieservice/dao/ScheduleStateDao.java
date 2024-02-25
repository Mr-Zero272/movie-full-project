package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.ScheduleState;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleStateDao extends MongoRepository<ScheduleState, String> {
}
