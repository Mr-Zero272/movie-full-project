package com.thuongmoon.movieservice.dto;

import com.thuongmoon.movieservice.models.PaymentDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private int total;
    private LocalDateTime creatAt;

    private String username;
    private PaymentDetail paymentDetailId;
    private List<String> listTickets = new ArrayList<>();

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
        return id != null && id.equals(((OrderDto) obj).id);
    }
}
