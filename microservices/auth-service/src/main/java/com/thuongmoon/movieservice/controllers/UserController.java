package com.thuongmoon.movieservice.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.UserService;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}
