package com.themais.firebaseserver.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Created by nguyenqmai on 7/11/2017.
 */
public class BadIssuerException extends AuthenticationException {
    public BadIssuerException(String msg) {
        super(msg);
    }
}
