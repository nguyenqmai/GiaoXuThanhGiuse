package com.themais.firebaseserver.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.themais.firebaseserver.model.ContactInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nguyenqmai on 12/23/2019.
 */
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    FirebaseAuth firebaseAuth;

    @Autowired
    FireStorageService fireStorageService;

    public String buildNewJWT(String userIdEmail) throws Exception {
        ContactInfo user = fireStorageService.getContactWithIdEmail(userIdEmail);
        return firebaseAuth.createCustomToken(userIdEmail, user.getAuthorization() != null ? user.getAuthorization() : Collections.emptyMap());
    }
}
