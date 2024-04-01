package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.SeatStatus;
import com.thuongmoon.movieservice.request.ChoosingSeatRequest;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.Impl.SeatStatusServiceImpl;
import com.thuongmoon.movieservice.services.SeatStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auditorium/seat-status")
public class SeatStatusController {
    @Autowired
    private SeatStatusService seatStatusService;

    @GetMapping("/{screeningId}")
    public List<SeatStatus> getListStatusByScreeningId(@PathVariable("screeningId") String screeningId) {
        return seatStatusService.getListSeatStatusByScreeningId(screeningId);
    }

    @PostMapping
    public ResponseEntity<List<String>> checkoutSeat(@RequestBody List<ChoosingSeatRequest> request) {
        return seatStatusService.checkoutSeat(request);
    }

    @PostMapping("/generate")
    public ResponseEntity<ResponseMessage> generateSeatStatusByScreeningId(@RequestBody GenerateSeatStatusRequest request) {
        return seatStatusService.generateSSByScreeningId(request);
    }

    @PostMapping("/refresh-state")
    public ResponseEntity<ResponseMessage> refreshSeatState(@RequestBody List<String> listSeatIds) {
        return seatStatusService.refreshSeatState(listSeatIds);
    }
}
