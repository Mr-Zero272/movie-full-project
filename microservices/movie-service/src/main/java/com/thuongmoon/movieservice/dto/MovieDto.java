package com.thuongmoon.movieservice.dto;

import com.thuongmoon.movieservice.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
    private String title;
    private String director;
    private String description;
    private String trailer;
    private String verticalImage;
    private String horizontalImage;
    private String manufacturer;
    private int duration_min;
    private String releaseDate;
    private int rating;
    private String userId;

    private List<Actor> cast = new ArrayList<>();

    private List<Gallery> galleries = new ArrayList<>();

    private List<String> genres = new ArrayList<>();

}
