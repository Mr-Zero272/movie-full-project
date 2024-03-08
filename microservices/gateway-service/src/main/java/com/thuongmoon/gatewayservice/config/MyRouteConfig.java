package com.thuongmoon.gatewayservice.config;

import com.thuongmoon.gatewayservice.filters.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyRouteConfig {
    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator myRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("media-service1", predicateSpec ->
                        predicateSpec.path("/api/v1/media/**")
                                .filters(f -> f
                                        .rewritePath("/api/v1/media/images//(?<segment>.*)", "/images/${segment}")
                                        .rewritePath("/api/v1/media/videos//(?<segment>.*)", "/videos/${segment}"))
                                .uri("lb://media-service"))
                .route("movie-service1", predicateSpec ->
                        predicateSpec.path("/api/v1/movie")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("movie-service2", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/search/**")
                                .filters(f -> f.rewritePath("/api/v1/movie/search/(?<segment>.*)", "/${segment}"))
                                .uri("lb://movie-service"))
                .route("movie-service3", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/manufacture")
                                .uri("lb://movie-service"))
                .route("movie-service10", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/genre/all")
                                .uri("lb://movie-service"))
                .route("movie-service4", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/genre/**")
                                .filters(f -> f
                                        .rewritePath("/api/v1/movie/genre/(?<segment>.*)", "/${segment}")
                                        .rewritePath("/api/v1/movie/genre/all", "//all"))
                                .uri("lb://movie-service"))
                .route("movie-service5", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/info/**")
                                .uri("lb://movie-service"))
                .route("movie-service6", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/all/**")
                                .uri("lb://movie-service"))
                .route("movie-service7", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/info/**")
                                .uri("lb://movie-service"))
                .route("movie-service8", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/screening/**")
                                .filters(f -> f
                                        .rewritePath("/api/v1/movie/screening//(?<segment>.*)", "/${segment}"))
                                .uri("lb://movie-service"))
                .route("movie-service9", predicateSpec ->
                        predicateSpec.path("/api/v1/movie/review/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("auth-service1", predicateSpec ->
                        predicateSpec.path("/api/v1/auth/**")
                                .filters(f ->
                                        f.rewritePath("/api/v1/auth/user", "//user")
                                                .rewritePath("/api/v1/auth/user/search//(?<segment>.*)", "/${segment}")
                                                .filter(authenticationFilter))
                                .uri("lb://auth-service"))
                .route("seat-service", predicateSpec ->
                        predicateSpec.path("/api/v1/auditorium/**")
                                .filters(f ->
                                        f.rewritePath("/api/v1/auditorium/seat-status//(?<segment>.*)", "/seat-status/${segment}")
                                                .rewritePath("/api/v1/auditorium/seat-status/refresh-state", "//seat-status/refresh-state"))
                                .uri("lb://seat-service"))
                .route("reservation-service", predicateSpec ->
                        predicateSpec.path("/api/v1/reservation/**")
                                .filters(f ->
                                        f.rewritePath("/api/v1/reservation/order", "//order")
                                                .rewritePath("/api/v1/reservation/order/payment//(?<segment>.*)", "//order/payment/${segment}")
                                                .rewritePath("/api/v1/reservation/order/payment", "//order/payment")
                                                .filter(authenticationFilter))
                                .uri("lb://reservation-service"))
                .build();
    }
}