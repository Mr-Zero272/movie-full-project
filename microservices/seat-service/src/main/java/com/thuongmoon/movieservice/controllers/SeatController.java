package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.models.Seat;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auditorium/seat")
public class SeatController {
    @Autowired
    private SeatDao seatDao;

    @GetMapping("/{auditoriumId}")
    public List<Seat> getListSeatByAuditoriumName(@PathVariable("auditoriumId") ObjectId auditoriumId) {
        return seatDao.findByAuditoriumId(auditoriumId);
    }
}
