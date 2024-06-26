package com.thuongmoon.movieservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatStatus implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	private String status;
	private int price;

	private String screeningId;
	private String movieTitle;
	private LocalDateTime screeningStart;
	private String provider;
	@DocumentReference
	private Seat seat;

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SeatStatus other = (SeatStatus) obj;
		return id != null && id.equals(((SeatStatus) obj).id);
	}

	@Override
	public int hashCode() {
		return 2024;
	}
}
