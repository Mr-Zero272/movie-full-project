package com.thuongmoon.movieservice.dto;

import com.thuongmoon.movieservice.models.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private int totalTicket;
    private LocalDateTime lastUpdate;
    private boolean active;
    private List<SeatStatus> listTickets = new ArrayList<>();

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
        return id != null && id.equals(((CartDto) obj).id);
    }
}
