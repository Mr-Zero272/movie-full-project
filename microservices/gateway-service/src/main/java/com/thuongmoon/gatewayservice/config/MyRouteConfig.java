package com.thuongmoon.gatewayservice.config;

import com.thuongmoon.gatewayservice.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyRouteConfig {
    @Autowired
    AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator myRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("media-service", predicateSpec ->
                        predicateSpec.path("/api/v1/images/**")
                                .uri("lb://media-service"))
                .route("media-service", predicateSpec ->
                        predicateSpec.path("/api/v1/videos/**")
                                .uri("lb://media-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/search")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/manufacture")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/genre/all")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/info/**")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/all/**")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/info/**")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/screening/**")
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("auth-service", predicateSpec ->
                        predicateSpec.path("/api/v1/auth/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://auth-service"))
                .route("seat-service", predicateSpec ->
                        predicateSpec.path("/api/v1/auditorium/**")
                                .uri("lb://seat-service"))
                .build();
    }
}
