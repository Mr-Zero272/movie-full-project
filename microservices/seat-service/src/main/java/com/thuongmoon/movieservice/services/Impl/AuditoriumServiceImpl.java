package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.dao.AuditoriumDao;
import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.request.AddAuditoriumRequest;
import com.thuongmoon.movieservice.response.Pagination;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.AuditoriumService;
import lombok.extern.slf4j.Slf4j;
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
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AuditoriumServiceImpl implements AuditoriumService {
    @Autowired
    private AuditoriumDao auditoriumDao;
    @Autowired
    private SeatDao seatDao;

    @Transactional
    public ResponseEntity<ResponseMessage> addNewAuditorium(AddAuditoriumRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Auditorium> auditoriumOptional = auditoriumDao.findByName(request.getName());
        if (auditoriumOptional.isPresent()) {
            responseMessage.setMessage("This auditorium is already existed!");
            responseMessage.setState("error");
            responseMessage.setRspCode("400");
            return new ResponseEntity<>(responseMessage, HttpStatus.OK);
        }
        Auditorium newAuditorium = new Auditorium(null, request.getName(), request.getAddress(), LocalDateTime.now());
        Auditorium savedAd = auditoriumDao.save(newAuditorium);
        newAuditorium.setName(request.getName());
        List<String> nameRows = List.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M");
        List<Seat> seats = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            int numberSeatInRow = 10;
            if (nameRows.get(i).equals("A")) numberSeatInRow = 6;
            if (nameRows.get(i).equals("B")) numberSeatInRow = 8;
            for (int j = 0; j < numberSeatInRow; j++) {
                Seat seat = new Seat(null, nameRows.get(i), (j+1), savedAd);
                seats.add(seat);
            }
        }
        seatDao.saveAll(seats);

        responseMessage.setMessage("Add new auditorium successfully check it in table or manage tab!");
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<List<String>> provideAuditoriumNeed(Integer numAuditoriums, LocalDateTime startDate) {
        List<Auditorium> auditoriums = auditoriumDao.findAll();
        List<String> admIds = new ArrayList<>();
        for(Auditorium auditorium: auditoriums) {
            if(auditorium.getLastUpdated().isEqual(startDate) || auditorium.getLastUpdated().isBefore(startDate)) {
                auditorium.setLastUpdated(startDate.plusDays(7L));
                admIds.add(auditorium.getId());
            }

            if(admIds.size() == numAuditoriums) break;
        }

        if (admIds.size() == numAuditoriums) {
            auditoriumDao.saveAll(auditoriums);
            return new ResponseEntity<>(admIds, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
    }

    public ResponseEntity<ResponseMessage> editAuditorium(String id, Auditorium newAuditorium) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<Auditorium> oldAuditorium = auditoriumDao.findById(id);
        if(oldAuditorium.isPresent()) {
            oldAuditorium.get().setName(newAuditorium.getName());
            oldAuditorium.get().setAddress(newAuditorium.getAddress());
            oldAuditorium.get().setLastUpdated(LocalDateTime.now());

            Auditorium savedAdm = auditoriumDao.save(oldAuditorium.get());
            responseMessage.setMessage("Update auditorium successfully!");
            responseMessage.setData(savedAdm);
        } else {
            responseMessage.setMessage("Update auditorium failed!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums() {
        return new ResponseEntity<>(auditoriumDao.findAll(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Auditorium> fetchAuditoriumById(String id) {
        Optional<Auditorium> auditoriumOptional = auditoriumDao.findById(id);
        return auditoriumOptional.map(auditorium -> new ResponseEntity<>(auditorium, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.BAD_REQUEST));
    }

    @Override
    public ResponseEntity<ResponsePagination> searchPaginationAuditorium(String q, int size, int cPage) {
        if ( q == null || q.isEmpty()) {
            q = "";
        }
        Pageable pageable = PageRequest.of(cPage - 1, size);
        Page<Auditorium> page = auditoriumDao.findAllByName(pageable, q);
        Pagination pagination = Pagination.builder()
                .currentPage(cPage)
                .size(size)
                .totalPage(page.getTotalPages())
                .totalResult((int) page.getTotalElements())
                .build();
        ResponsePagination paginationResponse = ResponsePagination.builder()
                .data(page.getContent())
                .pagination(pagination)
                .build();
        return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }
}
