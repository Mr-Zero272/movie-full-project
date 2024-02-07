package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.GenreDao;
import com.thuongmoon.movieservice.dto.Pagination;
import com.thuongmoon.movieservice.model.Genre;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class GenreService {

    private final Logger LOGGER = LoggerFactory.getLogger(GenreService.class);
    @Autowired
    private GenreDao genreDao;

    public ResponseEntity<List<Genre>> fetchAllGenres() {
        return new ResponseEntity<>(genreDao.findAll(), HttpStatus.OK);
    }
    public ResponseEntity<ResponsePagination> fetchPaginationGenres(String q, int size, int cPage) {
        ResponsePagination responsePagination = new ResponsePagination();
        Pagination pagination = new Pagination();
        Page<Genre> page;
        Pageable pageable = PageRequest.of(cPage - 1, size);
        if (q != null || q.isEmpty() || q.isBlank()) {
            page = genreDao.findAllByName(pageable, q);
        } else {
            page = genreDao.findAll(pageable);
        }
        pagination.setSize(page.getSize());
        pagination.setTotalPage(page.getTotalPages());
        pagination.setCurrentPage(page.getNumber() + 1);
        pagination.setTotalResult((int) page.getTotalElements());

        responsePagination.setPagination(pagination);
        responsePagination.setData(page.getContent());
        return new ResponseEntity<>(responsePagination, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<String> addGenres(List<Genre> genres) {
        String message = "";
//        genres.stream().forEach(i -> i.setLastUpdate(LocalDateTime.now()));
        try {
            for (Genre genre : genres) {
                Optional<Genre> existGenre = genreDao.findByName(genre.getName());
                if (existGenre.isPresent()) {
                    continue;
                }
                genre.setLastUpdate(LocalDateTime.now());
                genreDao.save(genre);
            }
            message = "Add genres successfully!!";
        } catch (Exception e) {
            LOGGER.info("Add genre error!!");
            message = "Something went wrong!";
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> editGenre(String id, String newName) {
        Optional<Genre> genre = genreDao.findById(id);
        ResponseMessage responseMessage = new ResponseMessage();
        if (genre.isPresent()) {
           genre.get().setName(newName);
           genre.get().setLastUpdate(LocalDateTime.now());

           responseMessage.setState("success");
           responseMessage.setRspCode("200");
           responseMessage.setMessage("Edit genre successfully!");
           responseMessage.setData(genreDao.save(genre.get()));
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("500");
            responseMessage.setMessage("Something went wrong!");
            responseMessage.setData(null);
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}
