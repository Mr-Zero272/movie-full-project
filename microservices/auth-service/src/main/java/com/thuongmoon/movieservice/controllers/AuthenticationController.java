package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.AuthenticationResponse;
import com.thuongmoon.movieservice.models.AuthenticationResquest;
import com.thuongmoon.movieservice.models.RegisterRequest;
import com.thuongmoon.movieservice.models.User;
import com.thuongmoon.movieservice.services.AuthenticationService;
import com.thuongmoon.movieservice.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
	private final AuthenticationService authenticationService;
	private final UserService userService;
	
	public AuthenticationController(AuthenticationService authenticationService, UserService userService) {
		this.authenticationService = authenticationService;
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register (@RequestBody RegisterRequest request){
		Optional<User> user = userService.findUserByUsername(request.getUsername());
		if (user.isPresent()) {
			String message = "This username is already existed!!";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthenticationResponse("", message));
			//return ResponseEntity.ok(new AuthenticationResponse("", message));
		} else {
			return ResponseEntity.ok(authenticationService.register(request));						
		}
	}
	
	@PostMapping("/authenticate")
	public ResponseEntity<AuthenticationResponse> register (@RequestBody AuthenticationResquest request){
		System.out.println(request.toString());
		return ResponseEntity.ok(authenticationService.authenticate(request));
	}
}
