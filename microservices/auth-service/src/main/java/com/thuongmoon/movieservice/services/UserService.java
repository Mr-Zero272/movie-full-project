package com.thuongmoon.movieservice.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.thuongmoon.movieservice.dto.UserDto;
import com.thuongmoon.movieservice.models.StatisticalUser;
import com.thuongmoon.movieservice.models.User;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    public Optional<User> findByUsernameOrEmail(String username, String email);

    public ResponseEntity<UserDto> getUserInfo();

    public ResponseEntity<ResponseMessage> updateUser(MultipartFile avatar, String userInfo) throws JsonProcessingException;

    public ResponseEntity<ResponsePagination> fetchPaginationUsers(String  role, String usernameLike, int size, int cPage);

    ResponseEntity<List<StatisticalUser>> getStatisticalUser(String role, int year);

    ResponseEntity<Integer> getTotalUserByMonth(int year, int month);
}
