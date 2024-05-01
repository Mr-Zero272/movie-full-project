package com.thuongmoon.movieservice;

import com.thuongmoon.movieservice.dao.MovieDao;
import com.thuongmoon.movieservice.model.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class MovieServiceApplication{
	@Autowired
	MovieDao movieDao;

	public static void main(String[] args) {
		SpringApplication.run(MovieServiceApplication.class, args);
	}
}
