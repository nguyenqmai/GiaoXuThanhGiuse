package com.themais.firebaseserver.security.jwtauthentication;


import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by nguyenqmai on 7/11/2017.
 */

public class JwtAuthenticationProvider implements AuthenticationProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationProvider.class);
    private String jwtTokenPrincipalNameField;
    private List<String> claimUris;


    public JwtAuthenticationProvider(String jwtTokenPrincipalNameField, List<String> claimUris) {
        this.jwtTokenPrincipalNameField = jwtTokenPrincipalNameField;
        this.claimUris = new ArrayList<>(claimUris);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        DecodedJWT rawAccessToken = (DecodedJWT) authentication.getCredentials();

        List<GrantedAuthority> authorities = new LinkedList<>();

        for (String claimUri : claimUris) {
            for (String granted : rawAccessToken.getClaim(claimUri).asList(String.class)) {
                authorities.add(new SimpleGrantedAuthority(granted));
            }
        }

        String principalName = rawAccessToken.getSubject();
        if (jwtTokenPrincipalNameField != null) {
            Claim usernameClaim = rawAccessToken.getClaim(jwtTokenPrincipalNameField);
            if (usernameClaim.isNull() || usernameClaim.asString().isEmpty()) {
                logger.warn("Principal's name value is NULL or empty for token's field [{}], using token's subject's value", jwtTokenPrincipalNameField);
            } else {
                 principalName = rawAccessToken.getClaim(jwtTokenPrincipalNameField).asString();
            }
        }
        logger.debug("Collected {} GrantedAuthority objs for principle [{}]", authorities.size(), principalName);
        UserContext context = UserContext.create(principalName, authorities);
        return new JwtAuthenticationToken(context, context.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
    }
}

/*
{
  "iss": "https://nguyenqmai.auth0.com/",
  "sub": "auth0|5964fe2fcb1ef72c78b03ef5",
  "aud": [
    "https://partintime.com/rest/",
    "https://nguyenqmai.auth0.com/userinfo"
  ],
  "azp": "QfuqZutBTquaTXzAD3I3aRwzFus5KUoX",
  "exp": 1502603123,
  "iat": 1502516723,
  "scope": "openid profile email",
  "gty": "password",
  "http://metadata/groups": [
    "power_users"
  ],
  "http://metadata/roles": [
    "admin",
    "sale_assocciate",
    "store"
  ],
  "http://metadata/permissions": [
    "signup:user",
    "subscribe:supplier",
    "prepare:order",
    "submit:order",
    "manage:user",
    "setup:monthlyfee"
  ],
  "http://metadata/user_metadata": {}
}
 */


