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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "movie")
public class Movie implements Serializable {
	/**
	 * 
	 */
	@Serial
	private static final long serialVersionUID = 1L;
	@Id
	private String id;
	private String title;
	private String director;
	private String description;
	private String trailer;
	private String verticalImage;
	private String horizontalImage;
	private String manufacturer;
	private int duration_min;
	private LocalDateTime releaseDate;
	private int rating;
	private String state;

	@DocumentReference
	private Requirement requirement;

	private List<Actor> cast = new ArrayList<>();

	//user add this movie -> must have role business
	private String whoAdd;

	private List<Gallery> galleries = new ArrayList<>();

	@DocumentReference
	private List<Genre> genres = new ArrayList<>();

	@DocumentReference
	private List<Review> reviews = new ArrayList<>();

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
		return id != null && id.equals(((Movie) obj).id);
	}

}
