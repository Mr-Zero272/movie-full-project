package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreDao extends MongoRepository<Genre, String> {
    Optional<Genre> findByName(String name);

    Page<Genre> findByNameLikeIgnoreCase(Pageable pageable, String name);

    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    Page<Genre> findAllByName(Pageable pageable, String name);
}
