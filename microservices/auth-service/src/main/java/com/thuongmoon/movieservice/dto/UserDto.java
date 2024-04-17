package com.thuongmoon.movieservice.dto;

import com.thuongmoon.movieservice.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collection;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
	private String id;
	private String username;
	private String email;
	private String avatar;
	private String phoneNumber;
	private Role role;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;
	private Collection<? extends GrantedAuthority> authorities;
}
