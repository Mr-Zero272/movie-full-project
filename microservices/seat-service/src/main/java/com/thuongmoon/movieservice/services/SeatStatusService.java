package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.dao.SeatStatusDao;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SeatStatusService {
    @Autowired
    private SeatDao seatDao;
    @Autowired
    private SeatStatusDao seatStatusDao;

    @Transactional
    public ResponseEntity<ResponseMessage> generateSSByScreeningId(GenerateSeatStatusRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        List<Seat> seats = seatDao.findByAuditoriumId(new ObjectId(request.getAuditoriumId()));
        List<SeatStatus> seatStatuses = new ArrayList<>();
        for (Seat seatItem: seats) {
            SeatStatus seatStatus = new SeatStatus(null, "available", request.getPrice(), request.getScreeningId(), seatItem);
            seatStatuses.add(seatStatus);
        }

        responseMessage.setMessage("Generate seat detail successfully!");
        seatStatusDao.saveAll(seatStatuses);
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);

    }

    public List<SeatStatus> getListSeatStatusByScreeningId(String screeningId) {
        return seatStatusDao.findSeatStatusByScreeningId(screeningId);
    }
}
