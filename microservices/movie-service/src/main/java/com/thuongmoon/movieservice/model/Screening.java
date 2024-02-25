package com.thuongmoon.movieservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "screening")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Screening implements Serializable {

	/**
	 * 
	 */
	@Serial
	private static final long serialVersionUID = 1L;
	@Id
	private String id;
	// type 3D, 2D, 4D, IMAX 3D,...
	private String type;
	private LocalDateTime screeningStart;
	private int price;
	private String auditoriumId;
	private List<String> seatDetailId;

	@DocumentReference
	private Movie movie;
//
//	private Auditorium auditorium;
//
//	private List<SeatStatus> listSeatStatus = new ArrayList<>();

	@Override
	public int hashCode() {
		return 2023;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		return id != null && id.equals(((Screening) obj).id);
	}
}
