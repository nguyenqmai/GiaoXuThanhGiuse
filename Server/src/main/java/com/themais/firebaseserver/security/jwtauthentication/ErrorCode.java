package com.themais.firebaseserver.security.jwtauthentication;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Created by nguyenqmai on 7/11/2017.
 */
public enum ErrorCode {
    GLOBAL(2), AUTHENTICATION(10), JWT_TOKEN_EXPIRED(11);

    private int errorCode;

    ErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    @JsonValue
    public int getErrorCode() {
        return errorCode;
    }
}
