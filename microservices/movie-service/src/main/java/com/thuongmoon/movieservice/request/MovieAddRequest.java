package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.dto.MovieDto;
import com.thuongmoon.movieservice.model.Requirement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieAddRequest {
    private MovieDto movie;
    private Requirement requirement;
}
