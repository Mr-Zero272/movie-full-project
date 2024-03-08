package com.thuongmoon.gatewayservice.filters;

import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {
    public static final List<String> openApiEndpoints = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/authenticate",
            "/api/v1/movie/genre/all",
            "/api/v1/movie/search",
            "/api/v1/movie/info",
            "/api/v1/movie/manufacture",
            "/api/v1/movie/review/all",
            "/api/v1/movie/review/info",
            "/api/v1/movie/screening/type",
            "/api/v1/movie/screening/search",
            "/api/v1/images/**",
            "/api/v1/videos/**",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}