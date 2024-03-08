package com.thuongmoon.movieservice.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Seat implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	private String rowSeat;
	private int numberSeat;

	@DocumentReference
	private Auditorium auditorium;

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
		return id != null && id.equals(((Seat) obj).id);
	}
}
