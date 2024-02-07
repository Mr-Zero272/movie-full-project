package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Requirement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RequirementDao extends MongoRepository<Requirement, String> {
}
