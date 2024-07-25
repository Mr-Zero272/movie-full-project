package com.moonmovie.user_service.models;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String email;
    private String newPassword;
}
