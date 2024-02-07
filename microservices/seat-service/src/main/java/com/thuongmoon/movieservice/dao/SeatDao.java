package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.models.Seat;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatDao extends MongoRepository<Seat, String> {

    @Aggregation({"{$lookup: {from : \"auditorium\", localField: \"auditorium\", foreignField: \"_id\", as: \"adm\"}}",
            "{$match: {\"adm.0.name\":  { $regex: ?0, $options: 'i' }}}"})
    public List<Seat> findByAuditoriumName(String auditoriumName);

    @Aggregation({"{$match: {\"auditorium\": ?0}}"})
    public List<Seat> findByAuditoriumId(ObjectId auditoriumId);
}
