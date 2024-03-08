package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.dto.CartDto;
import com.thuongmoon.movieservice.request.AddToCartRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import org.springframework.http.ResponseEntity;

import java.util.concurrent.ExecutionException;

public interface CartService {
    ResponseEntity<ResponseMessage> addToCart(String username, AddToCartRequest request);

    ResponseEntity<CartDto> getAllTicketsByUsername(String username) throws ExecutionException, InterruptedException;

    ResponseEntity<ResponseMessage> deleteTicketInCart(String username, String ticketId) throws ExecutionException, InterruptedException;
}
