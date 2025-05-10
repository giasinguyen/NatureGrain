package com.naturegrain.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {
    
    public NotFoundException(String message){
        super(message);
    }
    
    public NotFoundException(String message, Throwable cause){
        super(message, cause);
    }
    
}