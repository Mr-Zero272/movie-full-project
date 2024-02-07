package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.Auditorium;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditoriumDao extends MongoRepository<Auditorium, String> {
}
