package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.AuditoriumDao;
import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.request.AddAuditoriumRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
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
public class AuditoriumService {
    @Autowired
    private AuditoriumDao auditoriumDao;
    @Autowired
    private SeatDao seatDao;

    @Transactional
    public ResponseEntity<ResponseMessage> addNewAuditorium(AddAuditoriumRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Auditorium newAuditorium = new Auditorium(null, request.getName(), LocalDateTime.now());
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
                auditorium.setLastUpdated(startDate.plusDays(7L));
                admIds.add(auditorium.getId());

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
            oldAuditorium.get().setLastUpdated(newAuditorium.getLastUpdated());

            Auditorium savedAdm = auditoriumDao.save(oldAuditorium.get());
            responseMessage.setMessage("Update auditorium successfully!");
            responseMessage.setData(savedAdm);
        } else {
            responseMessage.setMessage("Update auditorium failed!");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}
