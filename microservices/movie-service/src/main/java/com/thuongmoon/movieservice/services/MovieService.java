package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.GenreDao;
import com.thuongmoon.movieservice.dao.MovieDao;
import com.thuongmoon.movieservice.dao.RequirementDao;
import com.thuongmoon.movieservice.dto.Pagination;
import com.thuongmoon.movieservice.feign.MediaInterface;
import com.thuongmoon.movieservice.helpers.DateTimeTransfer;
import com.thuongmoon.movieservice.model.Gallery;
import com.thuongmoon.movieservice.model.Genre;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Requirement;
import com.thuongmoon.movieservice.request.MovieAddRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class MovieService {
    @Autowired
    private GenreDao genreDao;
    @Autowired
    private RequirementDao requirementDao;
    @Autowired
    private MovieDao movieDao;
    @Autowired
    private DateTimeTransfer dateTimeTransfer;
    @Autowired
    private MediaInterface mediaInterface;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Transactional
    public ResponseEntity<ResponseMessage> addMovie(MovieAddRequest request, MultipartFile[] movieImages, MultipartFile movieTrailer, MultipartFile[] actorImages, String username) {
        // do I need to handle image or video right there?
        MultipartFile[] movieTrailers = new MultipartFile[1];
        movieTrailers[0] = movieTrailer;
        mediaInterface.addFiles(movieImages, "movie");
        mediaInterface.addFiles(movieTrailers, "trailer");
        mediaInterface.addFiles(actorImages, "avatar");

        // galleries
        List<Gallery> galleries = new ArrayList<>();
        for (MultipartFile movieImage : movieImages) {
            Gallery gallery = new Gallery(movieImage.getOriginalFilename());
            galleries.add(gallery);
        }

        Requirement requirementSaved = requirementDao.save(request.getRequirement());
        List<Genre> genres = new ArrayList<>();
        request.getMovie().getGenres().forEach(genreId -> {
            Optional<Genre> genreE = genreDao.findById(genreId);
            genreE.ifPresent(genres::add);
        });
        Movie newMovie = Movie.builder()
                .title(request.getMovie().getTitle())
                .director(request.getMovie().getDirector())
                .description(request.getMovie().getDescription())
                .trailer(movieTrailer.getOriginalFilename())
                .verticalImage(movieImages[3].getOriginalFilename())
                .horizontalImage(movieImages[0].getOriginalFilename())
                .manufacturer(request.getMovie().getManufacturer())
                .duration_min(request.getMovie().getDuration_min())
                .releaseDate(dateTimeTransfer.transperStrToLocalDateTime(request.getMovie().getReleaseDate()))
                .rating(request.getMovie().getRating())
                .whoAdd(username)
                .cast(request.getMovie().getCast())
                .reviews(request.getMovie().getReviews())
                .galleries(galleries)
                .requirement(requirementSaved)
                .genres(genres)
                .build();
        movieDao.save(newMovie);
        ResponseMessage responseMessage = new ResponseMessage();
        responseMessage.setMessage("Add new movie success!");
        responseMessage.setState("success");
        responseMessage.setRspCode("200");
        return ResponseEntity.ok(responseMessage);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> editRequest(String idRequirement, Requirement newRequirement) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Requirement> requirement = requirementDao.findById(idRequirement);
        if(requirement.isPresent()) {
            requirement.get().setSpecificRequireTypes(newRequirement.getSpecificRequireTypes());
            requirement.get().setScreeningsPerWeek(newRequirement.getScreeningsPerWeek());
            requirement.get().setTotalWeekScheduling(newRequirement.getTotalWeekScheduling());

            responseMessage.setRspCode("200");
            responseMessage.setData(requirementDao.save(requirement.get()));
            responseMessage.setMessage("Edit requirement success!");
        } else {
            responseMessage.setRspCode("400");
            responseMessage.setData(null);
            responseMessage.setMessage("Edit requirement failed!");
        }

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> editMovie(String movieId, Movie newMovie, List<MultipartFile> movieImages, MultipartFile movieTrailer) {
        // handle file tuong tu nhu o tren
        // xoa cac file anh cu
        // neu cac file gui toi trong ko can xoa
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Movie> movie = movieDao.findById(movieId);

        if (movie.isPresent()) {
            movie.get().setTitle(newMovie.getTitle());
            movie.get().setDirector(newMovie.getDirector());
            movie.get().setDescription(newMovie.getDescription());
            movie.get().setTrailer(newMovie.getTrailer());

            movie.get().setManufacturer(newMovie.getManufacturer());
            movie.get().setDuration_min(newMovie.getDuration_min());
            movie.get().setReleaseDate(newMovie.getReleaseDate());
            movie.get().setRating(newMovie.getRating());
            movie.get().setWhoAdd(newMovie.getWhoAdd());
            movie.get().setGalleries(newMovie.getGalleries());
            movie.get().setGenres(newMovie.getGenres());

            if (!movieImages.isEmpty()) {
                // call service delete image here
                List<String> imageNames = new ArrayList<>();
                MultipartFile[] imageFiles = new MultipartFile[movieImages.size()];
                for (int i = 0; i < movieImages.size(); i++) {
                    imageNames.add(movieImages.get(0).getOriginalFilename());
                    imageFiles[i] = movieImages.get(i);
                }

                mediaInterface.deleteFile(imageNames, "image");
                mediaInterface.addFiles(imageFiles, "images");
                movie.get().setVerticalImage(movieImages.get(3).getOriginalFilename());
                movie.get().setHorizontalImage(movieImages.get(0).getOriginalFilename());
            }

            if (!movieTrailer.isEmpty()) {
                // call service delete trailer here
                List<String> nameTrailer = List.of(movieTrailer.getOriginalFilename());
                MultipartFile[] trailerFile = new MultipartFile[0];
                trailerFile[0] = movieTrailer;

                mediaInterface.deleteFile(nameTrailer, "trailer");
                mediaInterface.addFiles(trailerFile, "trailer");
                movie.get().setTrailer(movieTrailer.getOriginalFilename());
            }

            responseMessage.setRspCode("200");
            responseMessage.setData(movieDao.save(movie.get()));
            responseMessage.setMessage("Edit movie success!");
        } else {
            responseMessage.setRspCode("400");
            responseMessage.setData(null);
            responseMessage.setMessage("Edit movie failed!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<ResponsePagination> fetchMoviePagination(String q, String type, List<ObjectId> genreIds, List<String> manufacturers, int size, int cPage) {
        if (q == null) q = "";
        if (type == null) type = "";
        ResponsePagination responsePagination = new ResponsePagination();
        Pagination pagination = new Pagination();
        int skip = (cPage - 1) * size;

        List<Movie> movies = new ArrayList<>();
        int totalResult = 0;

        if (manufacturers == null && genreIds == null) {
            movies =  movieDao.getMoviePaginationWithoutManufacturersAndGenres(q, type, size, skip);
            if (!movies.isEmpty()) {
                totalResult = movieDao.countMoviePaginationWithoutManufacturersAndGenres(q, type);
            }
        } else if (manufacturers == null) {
            log.info("manufacturers null");
            movies =  movieDao.getMoviePaginationWithoutManufacturers(q, type, genreIds, size, skip);
            if (!movies.isEmpty()) {
                totalResult = movieDao.countMoviePaginationWithoutManufacturers(q, type, genreIds);
            }
        } else if (genreIds == null) {
            movies =  movieDao.getMoviePaginationWithoutGenres(q, type, manufacturers, size, skip);
            if (!movies.isEmpty()) {
                totalResult = movieDao.countMoviePaginationWithoutGenres(q, type, manufacturers);
            }
        } else {
            movies =   movieDao.getMoviePagination(q, type, genreIds, manufacturers, size, skip);
            if (!movies.isEmpty()) {
                totalResult = movieDao.countMoviePagination(q, type, genreIds, manufacturers);
            }
        }

        pagination.setSize(size);
        pagination.setTotalPage((int) Math.ceil((double) totalResult/size));
        pagination.setCurrentPage(cPage);
        pagination.setTotalResult(totalResult);

        responsePagination.setPagination(pagination);
        responsePagination.setData(movies);
        return new ResponseEntity<>(responsePagination, HttpStatus.OK);
    }

    public ResponseEntity<Movie> getMovieInfo(String movieId) {
        Optional<Movie> movie = movieDao.findById(movieId);
        Movie result = new Movie();
        result = movie.orElse(null);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> getListManufactures() {
        List<String> manufactures = mongoTemplate.query(Movie.class)
                .distinct("manufacturer")
                .as(String.class)
                .all();
        return new ResponseEntity<>(manufactures, HttpStatus.OK);
    }
}
