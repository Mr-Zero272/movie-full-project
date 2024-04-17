package com.thuongmoon.movieservice.services.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thuongmoon.movieservice.config.JwtService;
import com.thuongmoon.movieservice.dao.UserDao;
import com.thuongmoon.movieservice.dto.Pagination;
import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.dto.UserUpdateDto;
import com.thuongmoon.movieservice.feign.MediaInterface;
import com.thuongmoon.movieservice.kafka.JsonKafkaProducer;
import com.thuongmoon.movieservice.models.StatisticalUser;
import com.thuongmoon.movieservice.models.User;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
	@Autowired
	private final UserDao userDao;
	@Autowired
	private final JwtService jwtService;
	@Autowired
	private MediaInterface mediaInterface;
	@Autowired
	private JsonKafkaProducer jsonKafkaProducer;

	public Optional<User> findByUsernameOrEmail(String username, String email) {
		return userDao.findByUsernameOrEmail(username, email);
	}

	private static String getUserNameFromContext() {
		String username = "";
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (!(authentication instanceof AnonymousAuthenticationToken)) {
            username = authentication.getName();
		}
		return username;
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
						.phoneNumber(currentUser.get().getPhoneNumber())
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
				UserUpdateDto userUpdateDto = new UserUpdateDto();
				if (avatar != null) {
					String fileName = avatar.getOriginalFilename();
					int dotIndex = fileName.lastIndexOf(".");
					String name = fileName.substring(0, dotIndex);
					String extension = fileName.substring(dotIndex);
					String newFileName = name + currentUsername + extension;

					int point1 = user.get().getAvatar().lastIndexOf("?type=avatar");
					String oldName =user.get().getAvatar().substring(36, point1);
					mediaInterface.addAvatarUser(avatar, newFileName, oldName);
					user.get().setAvatar("http://localhost:8272/api/v1/media/images/" + newFileName + "?type=avatar");
					userUpdateDto.setAvatar("http://localhost:8272/api/v1/media/images/" + newFileName + "?type=avatar");
				} else {
					userUpdateDto.setAvatar(user.get().getAvatar());
				}
				// send to kafka to update
				userUpdateDto.setId(user.get().getId());
				userUpdateDto.setUsername(user.get().getUsername());
				userUpdateDto.setEmail(newUserInfo.getEmail());
				userUpdateDto.setPhone(newUserInfo.getPhoneNumber());
				jsonKafkaProducer.updateUser(userUpdateDto);


				user.get().setEmail(newUserInfo.getEmail());
				user.get().setPhoneNumber(newUserInfo.getPhoneNumber());
				user.get().setModifiedAt(LocalDateTime.now());
				User updatedUser = userDao.save(user.get());
				UserDto userDtoUpdated = UserDto.builder()
						.id(updatedUser.getId())
						.username(updatedUser.getUsername())
						.email(updatedUser.getEmail())
						.avatar(updatedUser.getAvatar())
						.phoneNumber(updatedUser.getPhoneNumber())
						.authorities(updatedUser.getAuthorities())
						.build();

				responseMessage.setData(userDtoUpdated);
				responseMessage.setMessage("Update user information successfully!");
			}
		}
		return new ResponseEntity<>(responseMessage, HttpStatus.OK);
	}

	public ResponseEntity<ResponsePagination> fetchPaginationUsers(String  role, String usernameLike, int size, int cPage) {
//		System.out.println(role);
		ResponsePagination responsePagination = new ResponsePagination();
		if (role.equals("ADMIN")) {
			Pagination pagination = new Pagination();
			Page<UserDto> page = null;
			Pageable pageable = PageRequest.of(cPage - 1, size);
			if (usernameLike != null) {
				page = userDao.findAllByName(pageable, usernameLike);
			}

			pagination.setSize(page.getSize());
			pagination.setTotalPage(page.getTotalPages());
			pagination.setCurrentPage(page.getNumber() + 1);
			pagination.setTotalResult((int) page.getTotalElements());

			responsePagination.setPagination(pagination);
			responsePagination.setData(page.getContent());
		} else {
			responsePagination.setData("You are not an admin!");
		}
		return new ResponseEntity<>(responsePagination, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<StatisticalUser>> getStatisticalUser(String role, int year) {
		return new ResponseEntity<>(userDao.statisticalUser(role, year), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Integer> getTotalUserByMonth(int month) {
		return ResponseEntity.ok(userDao.countUsersByMonth(month));
	}

	public static List<LocalDateTime> getWeekList(LocalDate date) {
		List<LocalDateTime> weekList = new ArrayList<>();
		DayOfWeek dayOfWeek = date.getDayOfWeek();

		// Add the input date
		weekList.add(date.atTime(0, 0));

		// Add days before the input date to reach Monday
		for (int i = 0; i < dayOfWeek.getValue() - 1; i++) {
			date = date.minusDays(1);
			weekList.add(0, date.atTime(0, 0));
		}

		// Add days after the input date to reach Sunday
		for (int i = dayOfWeek.getValue(); i <= 7; i++) {
			date = date.plusDays(1);
			weekList.add(date.atTime(0, 0));
		}

		return weekList;
	}
}
