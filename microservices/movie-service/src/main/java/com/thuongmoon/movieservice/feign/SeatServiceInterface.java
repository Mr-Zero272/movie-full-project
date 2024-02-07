package com.thuongmoon.movieservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient("SEAT-SERVICE")
public interface SeatServiceInterface {
    @GetMapping("/api/v1/auditorium/av-auditorium")
    public ResponseEntity<List<String>> getAvailableAuditorium(@RequestParam("numAuditoriums") Integer numAuditoriums,
                                                               @RequestParam("startDate") LocalDateTime startDate);
}
