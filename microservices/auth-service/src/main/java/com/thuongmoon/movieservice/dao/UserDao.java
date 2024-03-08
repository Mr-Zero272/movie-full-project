package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    @Query("{ 'username' : { $regex: ?0, $options: 'i' } }")
    Page<UserDto> findAllByName(Pageable pageable, String name);

    @Query("{ 'username' : { $regex: '', $options: 'i' } }")
    Page<UserDto> findAllDto(Pageable pageable);

    Page<User> findByUsernameLike(Pageable pageable, String username);
}
