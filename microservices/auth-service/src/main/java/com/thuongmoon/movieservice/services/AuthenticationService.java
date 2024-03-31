package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.*;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {
    public AuthenticationResponse register(RegisterRequest request);

    public AuthenticationResponse authenticate(AuthenticationRequest request);

    ResponseEntity<ResponseMessage> sendOtpRegisterCode(String email);

    ResponseEntity<ResponseMessage> createNewBusinessAccount(AuthenticateOtpCodeRequest request);

    ResponseEntity<ResponseMessage> sendOtpChangePassCode(String email);

    ResponseEntity<ResponseMessage> validCodeChangePass(AuthenticateOtpCodeRequest request);

    ResponseEntity<ResponseMessage> changePassword(ChangePasswordRequest request);
}
