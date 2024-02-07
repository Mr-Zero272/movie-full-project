package com.thuongmoon.authservice.services;

import com.thuongmoon.authservice.config.JwtService;
import com.thuongmoon.authservice.dao.UserDao;
import com.thuongmoon.authservice.models.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
	private final UserDao repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthenticationService(UserDao repository, PasswordEncoder passwordEncoder, JwtService jwtService,
                                 AuthenticationManager authenticationManager) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	public AuthenticationResponse register(RegisterRequest request) {
		String avatar = "", phone = "";
		if (request.getAvatar() == null || request.getAvatar().isEmpty() || request.getAvatar().isBlank()) {
			avatar = "http://localhost:8272/api/v1/images/no_image.png?type=avatar";
		} else {
			avatar = request.getAvatar();
		}

		if (request.getPhoneNumber() == null || request.getPhoneNumber().isEmpty()
				|| request.getPhoneNumber().isBlank()) {
			phone = "Please update yourphone number!";
		} else {
			phone = request.getPhoneNumber();
		}
		var user = User.builder().username(request.getUsername()).email(request.getEmail()).avatar(avatar)
				.phoneNumber(phone).password(passwordEncoder.encode(request.getPassword())).role(Role.USER).build();
		var jwtToken = jwtService.generateToken(user);
		repository.save(user);
		return AuthenticationResponse.builder().token(jwtToken).message("success").build();
	}

	public AuthenticationResponse authenticate(AuthenticationResquest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		var user = repository.findByUsername(request.getUsername()).orElseThrow();
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).message("success").build();
	}

}
