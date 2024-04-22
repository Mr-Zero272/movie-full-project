package com.thuongmoon.movieservice.services;

import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public interface SchedulingService {
    public ResponseEntity<String> doSchedule(String role, LocalDateTime startDate);
}
