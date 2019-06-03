package com.themais.firebaseserver.security.jwtauthentication;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;

import java.security.Principal;
import java.util.List;

/**
 * Created by nguyenqmai on 7/11/2017.
 */
public class UserContext implements Principal {
    private final String name;
    private final List<GrantedAuthority> authorities;

    private UserContext(String name,
                        List<GrantedAuthority> authorities) {
        this.name = name;
        this.authorities = authorities;
    }

    static UserContext create(String name, List<GrantedAuthority> authorities) {
        if (StringUtils.isBlank(name)) throw new IllegalArgumentException("subject is blank");
        return new UserContext(name, authorities);
    }

    @Override
    public String getName() {
        return name;
    }

    List<GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
