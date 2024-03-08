package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.dto.CartDto;
import com.thuongmoon.movieservice.request.AddToCartRequest;
import com.thuongmoon.movieservice.response.ResponseMessage;
import com.thuongmoon.movieservice.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1/reservation")
public class CartController {
    @Autowired
    private CartService cartService;


    @PostMapping
    public ResponseEntity<ResponseMessage> addToCart(@RequestHeader("username") String username, @RequestBody AddToCartRequest request) {
        return cartService.addToCart(username, request);
    }

    @GetMapping
    public ResponseEntity<CartDto> getAllTicketInCart(@RequestHeader("username") String username) throws ExecutionException, InterruptedException {
        return cartService.getAllTicketsByUsername(username);
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<ResponseMessage> deleteTicketInCart(@RequestHeader("username") String username, @PathVariable("ticketId") String ticketId) {
        return cartService.deleteTicketInCart(username, ticketId);
    }
}
