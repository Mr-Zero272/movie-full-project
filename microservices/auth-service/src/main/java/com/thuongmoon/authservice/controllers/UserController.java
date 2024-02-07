package com.thuongmoon.authservice.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.thuongmoon.authservice.dto.UserDto;
import com.thuongmoon.authservice.response.ResponseMessage;
import com.thuongmoon.authservice.services.UserService;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/auth/user")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;
	
	@GetMapping
	public ResponseEntity<UserDto> getUserByUsername(@NonNull HttpServletRequest request) {
		return userService.getUserInfo();
	}

	@PutMapping
	public ResponseEntity<ResponseMessage> updateUserInfo(@RequestPart("avatar")MultipartFile avatar, @RequestPart("userInfo") String userInfo) throws JsonProcessingException {
		return userService.updateUser(avatar, userInfo);
	}
	
//	@PutMapping
//	public ResponseEntity<AuthenticationResponse> updateUser(@NonNull HttpServletRequest request,
//			@RequestPart("newUsername") String newUsername,
//			@RequestPart("newEmail") String newEmail,
//			@RequestPart("newPhoneNumber") String newPhoneNumber) {
//		String username = userService.getUsernameFromToken(request);
//		return ResponseEntity.ok(userService.updateUser(username, newUsername, newEmail, newPhoneNumber));
//	}
//
//	@PostMapping("/avatar")
//	public ResponseEntity<ResponseMessage> updateAvatarImage(@RequestPart("file") MultipartFile file, @NonNull HttpServletRequest request) {
//		final String authHeader = request.getHeader("Authorization");
//		final String jwt;
//		final String username;
//		jwt = authHeader.substring(7);
//		username = jwtService.extractUsername(jwt);
//		String fileName = file.getOriginalFilename();
//		int dotIndex = fileName.lastIndexOf(".");
//		String name = fileName.substring(0, dotIndex);
//		String extension = fileName.substring(dotIndex);
//		String newFileName = name + username + extension;
//		String message = "";
//		Path imagePath = Paths.get("uploads/images/avatars");
//		try {
//			if(!userService.updateAvatar(username, newFileName))
//			{
//				message = "Something went wrong!!!";
//				return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
//			}
//			storageService.saveFileWithPath(imagePath, file, newFileName);
//			message = "Uploaded the file successfully: " + file.getOriginalFilename();
//			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
//		} catch (Exception e) {
//			message = "Could not upload the file: " + file.getOriginalFilename() + ". Error: " + e.getMessage();
//			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
//		}
//	}
}
