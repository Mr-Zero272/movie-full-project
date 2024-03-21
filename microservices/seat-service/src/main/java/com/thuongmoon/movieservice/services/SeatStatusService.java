package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.dao.SeatStatusDao;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SeatStatusService {
    @Autowired
    private SeatDao seatDao;
    @Autowired
    private SeatStatusDao seatStatusDao;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendDataToWebSocket(String destination, Object data) {
        messagingTemplate.convertAndSend(destination, data);
    }

    @Transactional
    public ResponseEntity<ResponseMessage> generateSSByScreeningId(GenerateSeatStatusRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        List<Seat> seats = seatDao.findByAuditoriumId(new ObjectId(request.getAuditoriumId()));
        List<SeatStatus> seatStatuses = new ArrayList<>();
        for (Seat seatItem: seats) {
            SeatStatus seatStatus = new SeatStatus(null, "available", request.getPrice(), "", request.getScreeningId(), seatItem);
            seatStatuses.add(seatStatus);
        }

        responseMessage.setMessage("Generate seat detail successfully!");
        seatStatusDao.saveAll(seatStatuses);
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);

    }

    public List<SeatStatus> getListSeatStatusByScreeningId(String screeningId) {
        return seatStatusDao.findSeatStatusByScreeningId(screeningId);
    }

    @Transactional
    public void updateSeatStatus(ChoosingSeatRequest request) {
        Optional<SeatStatus> seatStatus = seatStatusDao.findById(request.getId());
        if (seatStatus.isPresent()) {
            if (request.getStatus().equals("booked")) {
                seatStatus.get().setStatus("booked");
                seatStatus.get().setWhoChoose(request.getUsername());
                request.setStatus("booked");
                seatStatusDao.save(seatStatus.get());
                sendDataToWebSocket("/topic/seat-state", request);
            } else {
                if (seatStatus.get().getWhoChoose().equals(request.getUsername())) {
                    if (request.getStatus().equals("choosing")) {
                        seatStatus.get().setStatus("available");
                        seatStatus.get().setWhoChoose("");
                        request.setStatus("available");
                        seatStatusDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                } else if (seatStatus.get().getWhoChoose().isEmpty()){
                    if (request.getStatus().equals("available")) {
                        seatStatus.get().setWhoChoose(request.getUsername());
                        seatStatus.get().setStatus("choosing");
                        request.setStatus("choosing");
                        seatStatusDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                }
            }
        }
    }

    @Transactional
    public ResponseEntity<ResponseMessage> refreshSeatState(List<String> listSeatIds) {
        ResponseMessage responseMessage = new ResponseMessage();
        List<SeatStatus> seatStatusList = seatStatusDao.findAllById(listSeatIds);
        seatStatusList.forEach(seatStatus -> {
            seatStatus.setStatus("available");
        });
        seatStatusDao.saveAll(seatStatusList);

        responseMessage.setMessage("Refresh state successfully!");
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public List<SeatStatus> findAllSeatByIds(List<String> seatIds) {
        return seatStatusDao.findAllById(seatIds);
    }

    public ResponseEntity<List<String>> checkoutSeat(List<ChoosingSeatRequest> requests) {
        List<String> listDisableIds = new ArrayList<>();
        for (ChoosingSeatRequest req: requests) {
            Optional<SeatStatus> seatStatus = seatStatusDao.findById(req.getId());
            if (seatStatus.isPresent()) {
                if (seatStatus.get().getWhoChoose().isEmpty()){
                    if (seatStatus.get().getStatus().equals("available")) {
                        seatStatus.get().setWhoChoose(req.getUsername());
                        seatStatus.get().setStatus("choosing");
                        req.setStatus("choosing");
                        seatStatusDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", seatStatus);
                    }
                } else {
                    listDisableIds.add(req.getId());
                }
            }
        }

        return new ResponseEntity<>(listDisableIds, HttpStatus.OK);
    }
}
