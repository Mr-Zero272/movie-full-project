package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.config.JwtService;
import com.thuongmoon.movieservice.dao.UserDao;
import com.thuongmoon.movieservice.models.*;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.AuthenticationService;
import com.thuongmoon.movieservice.services.MailService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserDao repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;
    private final UserDao userDao;
    private final StringRedisTemplate redisTemplate;

    private static final String OTP_CHARACTERS = "0123456789";
    private static final String PASS_CHARACTERS = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*";

    public AuthenticationServiceImpl(UserDao repository, PasswordEncoder passwordEncoder, JwtService jwtService,
                                     AuthenticationManager authenticationManager, MailService mailService, UserDao userDao, StringRedisTemplate redisTemplate) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.mailService = mailService;
        this.userDao = userDao;
        this.redisTemplate = redisTemplate;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        String avatar = "", phone = "";
        if (request.getAvatar() == null || request.getAvatar().isEmpty() || request.getAvatar().isBlank()) {
            avatar = "http://localhost:8272/api/v1/media/images/no_image.png?type=avatar";
        } else {
            avatar = request.getAvatar();
        }

        if (request.getPhoneNumber() == null || request.getPhoneNumber().isEmpty()
                || request.getPhoneNumber().isBlank()) {
            phone = "Please update your phone number!";
        } else {
            phone = request.getPhoneNumber();
        }
        var user = User.builder().username(request.getUsername()).email(request.getEmail()).avatar(avatar)
                .phoneNumber(phone).password(passwordEncoder.encode(request.getPassword())).role(Role.USER).build();
        var jwtToken = jwtService.generateToken(user);
        repository.save(user);
        return AuthenticationResponse.builder().token(jwtToken).message("success").build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        var user = repository.findByUsername(request.getUsername()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).message("success").build();
    }

    public String generateRandomString(int length, String characters) {
        // a class in java.security
        SecureRandom random = new SecureRandom();
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            result.append(characters.charAt(index));
        }
        return result.toString();
    }


    @Override
    @Cacheable(value = "codeTmp", key = "#email")
    public ResponseEntity<ResponseMessage> sendOtpRegisterCode(String email) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<User> user = userDao.findByEmail(email);
        // create otp code
        String code = generateRandomString(5, OTP_CHARACTERS);

        // create context for send mail
        Context context = new Context();
        if (user.isEmpty()) {
            context.setVariable("code", code);
            context.setVariable("message", "Thank you for choosing Moon Movie. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes.");
            responseMessage.setMessage("Receive otp code in your email!");
            mailService.sendEmailWithHtmlTemplate(email, "Code OTP", "otpCode", context);
            // send mail and save otp code in redis
            redisTemplate.opsForValue().set(email, code, 6, TimeUnit.MINUTES);
        } else {
            if (!user.get().getRole().equals(Role.MOVIE_BUSINESS) && !user.get().getRole().equals(Role.ADMIN)) {
                context.setVariable("code", code);
                context.setVariable("message", "Thank you for choosing Moon Movie. Use the following OTP to complete your Update your account to business role procedures. OTP is valid for 5 minutes.");
                responseMessage.setMessage("This email already has an account! We will update it to business account.");
                mailService.sendEmailWithHtmlTemplate(email, "Code OTP", "otpCode", context);
                // send mail and save otp code in redis
                redisTemplate.opsForValue().set(email, code, 6, TimeUnit.MINUTES);
            } else {
                context.setVariable("message", "Thank you for choosing Moon Movie. We would like to inform you that this email has a BUSINESS account. You can return to the login page and start working right away.");
                responseMessage.setMessage("This email already has an BUSINESS account!");
                responseMessage.setRspCode("400");
                responseMessage.setState("error");
                mailService.sendEmailWithHtmlTemplate(email, "MOON MOVIE Inform", "normalMail", context);
            }
        }
        return ResponseEntity.ok(responseMessage);
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseMessage> createNewBusinessAccount(AuthenticateOtpCodeRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<User> user = userDao.findByEmail(request.getEmail());
        String code = redisTemplate.opsForValue().get(request.getEmail());
        if (request.getCode() != null && request.getCode().equals(code)) {
            redisTemplate.delete(request.getEmail());
            String username = request.getEmail();
            String password = generateRandomString(8, PASS_CHARACTERS);
            Context context = new Context();
            if (user.isEmpty()) {
                User newUser = User.builder()
                        .avatar("http://localhost:8272/api/v1/media/images/no_image.png?type=avatar")
                        .email(request.getEmail())
                        .username(username)
                        .password(passwordEncoder.encode(password))
                        .phoneNumber("")
                        .role(Role.MOVIE_BUSINESS)
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build();
                userDao.save(newUser);

                //send info to user through mail
                context.setVariable("username", username);
                context.setVariable("password", password);
                mailService.sendEmailWithHtmlTemplate(request.getEmail(), "Your business account", "businessResMail", context);
            } else {
                user.get().setRole(Role.MOVIE_BUSINESS);
                userDao.save(user.get());
                context.setVariable("message", "Your account has been upgraded to a business account. Now you can start selling with us.");
                mailService.sendEmailWithHtmlTemplate(request.getEmail(), "Your business account", "normalMail", context);
            }
            responseMessage.setMessage("The otp code is valid");
        } else {
            responseMessage.setMessage("The opt code is invalid");
            responseMessage.setState("error");
            responseMessage.setRspCode("400");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    @Cacheable(value = "codeTmp", key = "#email")
    public ResponseEntity<ResponseMessage> sendOtpChangePassCode(String email) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<User> user = userDao.findByEmail(email);
        // create otp code
        String code = generateRandomString(5, OTP_CHARACTERS);

        // create context for send mail
        Context context = new Context();
        if (user.isPresent()) {
            context.setVariable("code", code);
            context.setVariable("message", "Thank you for choosing Moon Movie. Use the following OTP to complete your Reset Password procedures. OTP is valid for 5 minutes.");
            responseMessage.setMessage("Receive otp code in your email!");
            mailService.sendEmailWithHtmlTemplate(email, "Code OTP", "otpCode", context);
            // send mail and save otp code in redis
            redisTemplate.opsForValue().set(email, code, 6, TimeUnit.MINUTES);
        } else {
            responseMessage.setMessage("This email has no account exist!");
            responseMessage.setRspCode("400");
            responseMessage.setState("error");
        }
        return ResponseEntity.ok(responseMessage);
    }

    @Override
    public ResponseEntity<ResponseMessage> validCodeChangePass(AuthenticateOtpCodeRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        String code = redisTemplate.opsForValue().get(request.getEmail());
        if (request.getCode() != null && request.getCode().equals(code)) {
            responseMessage.setMessage("The otp code is valid");
        } else {
            responseMessage.setMessage("The opt code is invalid");
            responseMessage.setState("error");
            responseMessage.setRspCode("400");
        }
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResponseMessage> changePassword(ChangePasswordRequest request) {
        ResponseMessage responseMessage = new ResponseMessage();
        Optional<User> user = userDao.findByEmail(request.getEmail());
        if (user.isPresent()) {
            user.get().setPassword(passwordEncoder.encode((request.getNewPassword())));
            userDao.save(user.get());
            responseMessage.setMessage("Change password successfully!");
        } else {
            responseMessage.setState("error");
            responseMessage.setRspCode("400");
            responseMessage.setMessage("This email have no account existed!");
        }
        return ResponseEntity.ok(responseMessage);
    }

}
