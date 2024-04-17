package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.*;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.AuthenticationService;
import com.thuongmoon.movieservice.services.MailService;
import com.thuongmoon.movieservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        Optional<User> user = userService.findByUsernameOrEmail(request.getUsername(), request.getEmail());
        if (user.isPresent()) {
            String message = "This username or email is already existed!!";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthenticationResponse("", message));
            //return ResponseEntity.ok(new AuthenticationResponse("", message));
        } else {
            return ResponseEntity.ok(authenticationService.register(request));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        System.out.println(request.toString());
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/register-business")
    public ResponseEntity<ResponseMessage> sendMailRegisterBusinessAccount(@RequestParam("email") String email) {
        return authenticationService.sendOtpRegisterCode(email);
    }

    @PostMapping("/register-business")
    public ResponseEntity<ResponseMessage> registerBusinessAccount(@RequestBody AuthenticateOtpCodeRequest request) {
        return authenticationService.createNewBusinessAccount(request);
    }

    @GetMapping("/change-pass")
    public ResponseEntity<ResponseMessage> sendMailRegisterChangePass(@RequestParam("email") String email) {
        return authenticationService.sendOtpChangePassCode(email);
    }

    @PostMapping("/valid-otp")
    public ResponseEntity<ResponseMessage> validCodeOtpChangePassword(@RequestBody AuthenticateOtpCodeRequest request) {
        return authenticationService.validCodeChangePass(request);
    }

    @PostMapping("/change-pass")
    public ResponseEntity<ResponseMessage> changePassword(@RequestBody ChangePasswordRequest request) {
        return authenticationService.changePassword(request);
    }
}
