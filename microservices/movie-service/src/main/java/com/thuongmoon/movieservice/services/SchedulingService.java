package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dao.MovieDao;
import com.thuongmoon.movieservice.dao.ScreeningDao;
import com.thuongmoon.movieservice.feign.SeatServiceInterface;
import com.thuongmoon.movieservice.helpers.DateTimeTransfer;
import com.thuongmoon.movieservice.kafka.JsonKafkaProducer;
import com.thuongmoon.movieservice.model.AuditoriumState;
import com.thuongmoon.movieservice.model.Movie;
import com.thuongmoon.movieservice.model.Requirement;
import com.thuongmoon.movieservice.model.Screening;
import com.thuongmoon.movieservice.request.GenerateSeatStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SchedulingService {
    @Autowired
    private DateTimeTransfer dateTimeTransfer;
    @Autowired
    private MovieDao movieDao;
    @Autowired
    private ScreeningDao screeningDao;
    @Autowired
    private SeatServiceInterface seatServiceInterface;
    @Autowired
    private JsonKafkaProducer jsonKafkaProducer;

    public ResponseEntity<String> doSchedule(LocalDateTime startDate) {
        int maxScreeningsPerDay = 7;
        // start at 7:00 am
        LocalDateTime startTimeToSchedule = dateTimeTransfer.calculateDatePlusHours(startDate, 7F);
        List<Movie> movies = movieDao.findAll();
        List<Requirement> requirements = new ArrayList<>();

        movies.forEach(movie -> {
            int tWeeks = movie.getRequirement().getTotalWeekScheduling();
            if (tWeeks != 0) {
                movie.getRequirement().setTotalWeekScheduling(tWeeks - 1);
            }
        });

        movies.forEach(movie -> {
            requirements.add(movie.getRequirement());
        });

        List<Screening> screenings = new ArrayList<>();
        int totalScreeningsEstimated = movies.stream().reduce(0,
                (total, movie) -> total + movie.getRequirement().getScreeningsPerWeek(), Integer::sum);
        int totalAuditoriumNeeded = (int) Math.ceil((double) totalScreeningsEstimated /(maxScreeningsPerDay*7));
        // call service roi lay so rap can thiet
        // tinh toan truoc so suat chieu tren tuan sau do lay so rap phu hop
        List<String> auditoriumIds = seatServiceInterface.getAvailableAuditorium(totalAuditoriumNeeded, startDate).getBody();
        if(auditoriumIds.isEmpty()) {
            return ResponseEntity.ok("Failed to fetch auditorium for scheduling!");
        }
        List<AuditoriumState> auditoriumStates = new ArrayList<>();
        for (String auditoriumId : auditoriumIds) {
            AuditoriumState auditoriumState = new AuditoriumState(auditoriumId, startTimeToSchedule, 0);
            auditoriumStates.add(auditoriumState);
        }
        // cac suat phim du phong min la 10 de bu tat ca cac suat chieu con thieu cua ca 1 ngay
        int indexAuditorium = 0;
        int screeningCount = 0;
        int breakState = 0;
        while (breakState != movies.size()) {
            breakState = 0;
            for (Movie movie : movies) {
                LocalDateTime screeningStart = dateTimeTransfer.calculateDatePlusMinutes(auditoriumStates.get(indexAuditorium).getLastScreeningsStartTime(), 30);
                if(movie.getRequirement().getSpecificRequireTypes().isEmpty()) {
                    breakState++;
                    continue;
                }

                if(screeningCount == auditoriumIds.size() * maxScreeningsPerDay) {
                    screeningCount = 0;
                    LocalDateTime nextDay = dateTimeTransfer.getNextDay(auditoriumStates.get(0).getLastScreeningsStartTime());
                    LocalDateTime newStartTime = dateTimeTransfer.calculateDatePlusHours(nextDay, 7F);
                    for (AuditoriumState auditoriumState : auditoriumStates) {
                        auditoriumState.setTotalScreeningsScheduled(0);
                        auditoriumState.setLastScreeningsStartTime(newStartTime);
                    }
                    indexAuditorium = 0;
                    break;
                }

                Screening screening = Screening.builder()
                        .type(movie.getRequirement().getSpecificRequireTypes().get(0).getTypeName())
                        .screeningStart(screeningStart)
                        .auditoriumId(auditoriumStates.get(indexAuditorium).getAuditoriumId())
                        .movie(movie)
                        .build();

                // add to list
                screenings.add(screening);
                screeningCount++;

                // update require
                int nScreenings = movie.getRequirement().getSpecificRequireTypes().get(0).getNScreenings();
                if (nScreenings - 1 == 0) {
                    movie.getRequirement().getSpecificRequireTypes().remove(0);
                } else {
                    movie.getRequirement().getSpecificRequireTypes().get(0).setNScreenings(nScreenings - 1);
                }

                //update auditorium state
                LocalDateTime lScreeningStart = auditoriumStates.get(indexAuditorium).getLastScreeningsStartTime();
                int movieDuration = movie.getDuration_min();
                auditoriumStates.get(indexAuditorium).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movieDuration));
                auditoriumStates.get(indexAuditorium).setTotalScreeningsScheduled(auditoriumStates.get(indexAuditorium).getTotalScreeningsScheduled());

                // update auditorium index
                indexAuditorium++;
                if (indexAuditorium == auditoriumIds.size()) {
                    indexAuditorium = 0;
                }
            }
        }

        movies.forEach(movie -> {
            movie.setRequirement(requirements.get(0));
            requirements.remove(0);
        });
        movieDao.saveAll(movies);
        List<Screening> screeningListSaved = screeningDao.saveAll(screenings);
        screeningListSaved.forEach(screening -> {
            // send message to seat-service through kafka to generate list seat status
            GenerateSeatStatusRequest generateSeatStatusRequest = new GenerateSeatStatusRequest();
            generateSeatStatusRequest.setPrice(76000);
            generateSeatStatusRequest.setScreeningId(screening.getId());
            generateSeatStatusRequest.setAuditoriumId(screening.getAuditoriumId());
            jsonKafkaProducer.sendSeatGenerateRequest(generateSeatStatusRequest);
        });
        return ResponseEntity.ok("Schedule successfully, see detail in your table tab!");
    }
}











