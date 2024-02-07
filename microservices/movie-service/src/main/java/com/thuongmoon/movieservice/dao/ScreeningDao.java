package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Screening;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningDao extends MongoRepository<Screening, String> {
}
