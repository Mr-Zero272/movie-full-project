package com.thuongmoon.movieservice.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.models.StatisticalUser;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.Impl.UserServiceImpl;
import com.thuongmoon.movieservice.services.MailService;
import com.thuongmoon.movieservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;

import java.util.List;

@RestController
@RequestMapping("api/v1/auth/user")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping
	public ResponseEntity<UserDto> getUserInfo() {
		return userService.getUserInfo();
	}

	@PutMapping
	public ResponseEntity<ResponseMessage> updateUserInfo(@RequestPart(value = "avatar", required = false)MultipartFile avatar, @RequestPart("userInfo") String userInfo) throws JsonProcessingException {
		return userService.updateUser(avatar, userInfo);
	}

	@GetMapping("/search")
	public ResponseEntity<ResponsePagination> findPaginationUser(
			@RequestHeader(value = "role", required = true) String role,
			@RequestParam(required = false) String usernameLike,
			@RequestParam(required = false, defaultValue = "6") int size,
			@RequestParam(required = false, defaultValue = "1") int cPage) {
		return userService.fetchPaginationMovies(role, usernameLike, size, cPage);
	}

	@GetMapping("/statistical")
	public ResponseEntity<List<StatisticalUser>> getStatisticalUser(@RequestParam (value = "role", required = false, defaultValue = "USER") String role, @RequestParam(value = "year") int year){
		return userService.getStatisticalUser(role, year);
	}

	@GetMapping("/total")
	public ResponseEntity<Integer> getTotalUser(@RequestParam(value = "month") int month) {
		return userService.getTotalUserByMonth(month);
	}
}
