package com.themais.firebaseserver.security.jwtauthentication;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationServiceException;

/**
 * Created by nguyenqmai on 7/11/2017.
 */
public class JwtHeaderTokenExtractor implements TokenExtractor {
    private String headerPrefix;

    public JwtHeaderTokenExtractor(String headerPrefix) {
        this.headerPrefix = headerPrefix;
    }

    @Override
    public String extract(String header) {
        if (StringUtils.isBlank(header)) {
            throw new AuthenticationServiceException("Authorization header cannot be blank!");
        }

        if (header.length() < headerPrefix.length()) {
            throw new AuthenticationServiceException("Invalid authorization header size.");
        }

        return header.substring(headerPrefix.length(), header.length()).trim();
    }
}
