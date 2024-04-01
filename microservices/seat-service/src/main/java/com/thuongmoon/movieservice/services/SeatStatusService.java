package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface SeatStatusService {
    public void sendDataToWebSocket(String destination, Object data);
    public ResponseEntity<ResponseMessage> generateSSByScreeningId(GenerateSeatStatusRequest request);
    public List<SeatStatus> getListSeatStatusByScreeningId(String screeningId);
    public void updateSeatStatus(ChoosingSeatRequest request);
    public ResponseEntity<ResponseMessage> refreshSeatState(List<String> listSeatIds);
    public List<SeatStatus> findAllSeatByIds(List<String> seatIds);
    public ResponseEntity<List<String>> checkoutSeat(List<ChoosingSeatRequest> requests);
}
