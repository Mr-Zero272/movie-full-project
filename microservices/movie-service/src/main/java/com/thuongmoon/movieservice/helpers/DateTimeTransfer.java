package com.thuongmoon.movieservice.helpers;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class DateTimeTransfer {
    private final static String dateTimePattern = "yyyy-MM-dd HH:mm";
    public LocalDateTime transperStrToLocalDateTime(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(dateTimePattern);
        return LocalDateTime.parse(date, formatter);
    }

    public LocalDateTime calculateDatePlusHours(LocalDateTime currenDate, float ETime) {
        // convert addition hours to minutes
        long minutesToAdd = (long) (ETime * 60);

        return currenDate.plusMinutes(minutesToAdd);
    }

    public LocalDateTime calculateDatePlusMinutes(LocalDateTime currenDate, int minutesToAdd) {
        return currenDate.plusMinutes(minutesToAdd);
    }

    public float calculateDifferenceInHours(LocalDateTime dateTime1, LocalDateTime dateTime2) {
        Duration duration = Duration.between(dateTime1, dateTime2);
        long seconds = duration.getSeconds();
        float hours = seconds / 3600.0f;

        return Math.abs(hours); // Trả về giá trị tuyệt đối
    }

    public boolean compareTwoDates(LocalDateTime d1, LocalDateTime d2) {
        int diff = d1.compareTo(d2);
        return diff >= 0;
    }

    public LocalDateTime getNextDay(LocalDateTime currentDate) {
        return currentDate.toLocalDate().plusDays(1).atStartOfDay();
    }
}
