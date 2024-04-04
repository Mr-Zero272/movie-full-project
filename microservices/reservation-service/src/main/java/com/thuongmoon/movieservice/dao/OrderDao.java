package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.dto.TestQuery;
import com.thuongmoon.movieservice.models.Order;
import com.thuongmoon.movieservice.models.Statistical;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDao extends MongoRepository<Order, String> {
    List<Order> findByUsername(String username);

    @Aggregation({"{ $project: { month: { $month: \"$createdAt\" }, year: {$year: \"$createdAt\"}, total: 1, serviceFee: 1, totalTickets: 1, listTickets: 1 }}",
            "{ $unwind: \"$listTickets\" }",
            "{ $match: { year: ?0,  \"listTickets.provider\": ?1}}",
            "{ $group: { _id: { month: \"$month\" }, totalSum: { $sum: \"$listTickets.price\" }, serviceFeeSum: {$sum: { $multiply: [\"$listTickets.price\", 0.05] }  }, totalTickets: {$sum: NumberInt(1)} }}",
            "{ $sort: { \"_id.month\": 1 } }",
            "{ $project: { _id: 0, month: \"$_id.month\", totalSum: 1, serviceFeeSum: 1, totalTickets: 1 }}",
            "{ $limit: 12 }"})
    List<Statistical> getStatisticalOrder(int year, String provider);
}
