package com.thuongmoon.movieservice.dao;

import com.thuongmoon.movieservice.model.Movie;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieDao extends MongoRepository<Movie, String> {
    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"genres\": {$in: ?2}, \"manufacturer\": { $in: ?3}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{ $skip: ?5}", "{$limit:  ?4}" })
    List<Movie> getMoviePagination(
            @Param("q") String q,
            @Param("type") String type,
            @Param("genreIds") List<ObjectId> genreIds,
            @Param("manufacturers") List<String> manufacturers,
            int limit, int skip );

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"genres\": {$in: ?2}, \"manufacturer\": { $in: ?3}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{$count: \"totalMovies\"}"})
    Integer countMoviePagination(
            @Param("q") String q,
            @Param("type") String type,
            @Param("genreIds") List<ObjectId> genreIds,
            @Param("manufacturers") List<String> manufacturers);

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"manufacturer\": { $in: ?2}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{ $skip: ?4}", "{$limit:  ?3}"})
    List<Movie> getMoviePaginationWithoutGenres(
            @Param("q") String q,
            @Param("type") String type,
            @Param("manufacturers") List<String> manufacturers,
            int limit, int skip );

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"manufacturer\": { $in: ?2}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{$count: \"totalMovies\"}"})
    Integer countMoviePaginationWithoutGenres(
            @Param("q") String q,
            @Param("type") String type,
            @Param("manufacturers") List<String> manufacturers);

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"genres\": {$in: ?2}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{ $skip: ?4}", "{$limit:  ?3}"})
    List<Movie> getMoviePaginationWithoutManufacturers(
            @Param("q") String q,
            @Param("type") String type,
            @Param("genreIds") List<ObjectId> genreIds,
            int limit, int skip );

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}, \"genres\": {$in: ?2}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{$count: \"totalMovies\"}"})
    Integer countMoviePaginationWithoutManufacturers(
            @Param("q") String q,
            @Param("type") String type,
            @Param("genreIds") List<ObjectId> genreIds);

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{ $skip: ?3}", "{$limit:  ?2}"})
    List<Movie> getMoviePaginationWithoutManufacturersAndGenres(
            @Param("q") String q,
            @Param("type") String type,
            int limit, int skip );

    @Aggregation({"{$lookup: {from : \"requirement\", localField: \"requirement\", foreignField: \"_id\", as: \"req\"}}",
            "{$match: {'title': { $regex: ?0, $options: 'i' } ,\"req.0.specificRequireTypes\": { $elemMatch: { \"typeName\": { $regex: ?1, $options: 'i' }}}}}",
            "{$project: { \"galleries\": 0, \"userId\": 0, \"requirement\": 0}}",
            "{$count: \"totalMovies\"}"})
    Integer countMoviePaginationWithoutManufacturersAndGenres(
            @Param("q") String q,
            @Param("type") String type);
}
