package com.themais.firebaseserver.security.jwtauthentication;

/**
 * Created by nguyenqmai on 7/11/2017.
 */
public interface TokenExtractor {
    String extract(String payload);
}
