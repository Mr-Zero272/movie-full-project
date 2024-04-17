package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.Auditorium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuditoriumDao extends MongoRepository<Auditorium, String> {
    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    Page<Auditorium> findAllByName(Pageable pageable, String name);

    Optional<Auditorium> findByName(String name);
}
