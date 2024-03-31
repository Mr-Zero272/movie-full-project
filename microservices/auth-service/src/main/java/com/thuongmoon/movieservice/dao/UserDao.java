package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.models.Role;
import com.thuongmoon.movieservice.models.StatisticalUser;
import com.thuongmoon.movieservice.models.User;
import org.apache.kafka.common.quota.ClientQuotaAlteration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    @Query("{ 'username' : { $regex: ?0, $options: 'i' } }")
    Page<UserDto> findAllByName(Pageable pageable, String name);

    @Query("{ 'username' : { $regex: '', $options: 'i' } }")
    Page<UserDto> findAllDto(Pageable pageable);

    Page<User> findByUsernameLike(Pageable pageable, String username);

    Integer countUserByRole(@Param("role") Role role);

    @Aggregation({"{ $project: { month: {$month: \"$createdAt\"}}}",
            "{ $match: {month : ?0 } }",
            " { $count: \"totalUser\" }"})
    Integer countUsersByMonth(int month);

    @Aggregation({"{ $project: { month: {$month: \"$createdAt\"}, year: {$year: \"$createdAt\"}, role: 1 } }",
            "{ $match: { role: ?0, year: ?1 } }",
            "{ $group: { _id: {month: \"$month\"}, totalUser: { $sum: NumberInt(1)}}  }",
            "{ $sort: { \"_id.month\": 1 } }",
            "{ $project: { _id: 0, month: \"$_id.month\", totalUser: 1, } }"})
    List<StatisticalUser> statisticalUser(String role, int year);
}
