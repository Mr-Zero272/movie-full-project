package com.thuongmoon.authservice.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmoon.authservice.config.JwtService;
import com.thuongmoon.authservice.dao.UserDao;
import com.thuongmoon.authservice.dto.UserDto;
import com.thuongmoon.authservice.feign.MediaInterface;
import com.thuongmoon.authservice.models.AuthenticationResponse;
import com.thuongmoon.authservice.models.User;
import com.thuongmoon.authservice.response.ResponseMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService  {
	@Autowired
	private final UserDao userDao;
	@Autowired
	private final JwtService jwtService;
	@Autowired
	private MediaInterface mediaInterface;

	public List<User> getAllUser() {
		return userDao.findAll();
	}

	public Optional<User> findUserByUsername(String username) {
		return userDao.findByUsername(username);
	}

//	public boolean updateAvatar(String username, String avatar) {
//		User user = userDao.findByUsername(username).orElse(new User());
//		Path imagePath = Paths.get("uploads/images/avatars");
//		if (user.getAvatar().equals("no_image.png")) {
//			user.setAvatar(avatar);
//			userDao.save(user);
//			return true;
//		} else {
//			if(filesStorageService.deleteFileWithPath(imagePath, user.getAvatar())) {
//				user.setAvatar(avatar);
//				userDao.save(user);
//				return true;
//			} else {
//				return false;
//			}
//		}
//	}

	public String getUsernameFromToken(HttpServletRequest request) {
		final String authHeader = request.getHeader("Authorization");
		final String jwt;
		final String username;
		jwt = authHeader.substring(7);
		username = jwtService.extractUsername(jwt);
		return username;
	}

//	public AuthenticationResponse updateUser(String username, String newUsername, String newEmail, String newPhoneNumber) {
//		Optional<User> user = userDao.findIfUsernameExisted(username, newUsername);
//		String jwtToken = "";
//		if(user.isEmpty()) {
//			User updateUser = userDao.findByUsername(username).orElse(new User());
//			updateUser.setUsername(newUsername);
//			updateUser.setEmail(newEmail);
//			updateUser.setPhoneNumber(newPhoneNumber);
//			userDao.save(updateUser);
//			jwtToken = jwtService.generateToken(updateUser);
//			return AuthenticationResponse.builder()
//					.token(jwtToken)
//					.message("success")
//					.build();
//		} else {
//			return AuthenticationResponse.builder()
//					.token(jwtToken)
//					.message("This username is already existed!!")
//					.build();
//		}
//	}

	private static String getUserNameFromContext() {
		String username = "";
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (!(authentication instanceof AnonymousAuthenticationToken)) {
			String currentUserName = authentication.getName();
			username = currentUserName;
		}
		return username;
	}

	public User getUserFromToken(HttpServletRequest request) {
		final String authHeader = request.getHeader("Authorization");
		final String jwt;
		final String username;
		jwt = authHeader.substring(7);
		username = jwtService.extractUsername(jwt);
		User user = userDao.findByUsername(username).orElseThrow();
		return user;
	}

	public ResponseEntity<UserDto> getUserInfo() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (!(authentication instanceof AnonymousAuthenticationToken)) {
			String currentUserName = authentication.getName();
			Optional<User> currentUser = userDao.findByUsername(currentUserName);
			if (currentUser.isPresent()) {
				UserDto userDto = UserDto.builder()
						.id(currentUser.get().getId())
						.username(currentUser.get().getUsername())
						.email(currentUser.get().getEmail())
						.phone(currentUser.get().getPhoneNumber())
						.avatar(currentUser.get().getAvatar())
						.authorities(currentUser.get().getAuthorities())
						.build();
				return new ResponseEntity<>(userDto, HttpStatus.OK);
			}
		}
		return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
	}

	public ResponseEntity<ResponseMessage> updateUser(MultipartFile avatar, String userInfo) throws JsonProcessingException {
		String currentUsername = getUserNameFromContext();
		ResponseMessage responseMessage = new ResponseMessage();
		if (!currentUsername.isEmpty()) {
			Optional<User> user = userDao.findByUsername(currentUsername);
			if (user.isPresent()) {
				ObjectMapper objectMapper = new ObjectMapper();
				UserDto newUserInfo = objectMapper.readValue(userInfo, UserDto.class);
				log.info(String.valueOf(newUserInfo.toString()));
				String fileName = avatar.getOriginalFilename();
				int dotIndex = fileName.lastIndexOf(".");
				String name = fileName.substring(0, dotIndex);
				String extension = fileName.substring(dotIndex);
				String newFileName = name + currentUsername + extension;
				mediaInterface.addAvatarUser(avatar, newFileName, user.get().getAvatar());
				user.get().setAvatar("http://localhost:8272/api/v1/images/" + newFileName + "?type=avatar");
				user.get().setEmail(newUserInfo.getEmail());
				user.get().setPhoneNumber(newUserInfo.getPhone());
				User updatedUser = userDao.save(user.get());
				UserDto userDtoUpdated = UserDto.builder()
						.id(updatedUser.getId())
						.username(updatedUser.getUsername())
						.email(updatedUser.getEmail())
						.avatar(updatedUser.getAvatar())
						.phone(updatedUser.getPhoneNumber())
						.authorities(updatedUser.getAuthorities())
						.build();

				responseMessage.setData(userDtoUpdated);
				responseMessage.setMessage("Update user information successfully!");
			}
		}
		return new ResponseEntity<>(responseMessage, HttpStatus.OK);
	}
}
