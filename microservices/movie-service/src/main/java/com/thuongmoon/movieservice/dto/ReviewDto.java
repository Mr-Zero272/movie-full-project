package com.thuongmoon.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String movieId;
    private String author;
    private String avatar;
    private int rating;
    private String comment;

    @Override
    public int hashCode() {
        return 2024;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return author != null && author.equals(((ReviewDto) obj).author);
    }
}
