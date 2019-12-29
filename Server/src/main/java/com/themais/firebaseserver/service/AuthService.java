package com.themais.firebaseserver.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.themais.firebaseserver.model.ContactInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nguyenqmai on 12/23/2019.
 */
@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    FirebaseAuth firebaseAuth;

    @Autowired
    FireStorageService fireStorageService;

    public String buildNewJWT(String userIdEmail) throws Exception {
        ContactInfo user = fireStorageService.getContactWithIdEmail(userIdEmail);
        Map<String, Object> developerClaims = user == null ? Collections.emptyMap() : user.getAuthorization();
        return firebaseAuth.createCustomToken(userIdEmail, developerClaims != null ? developerClaims : Collections.emptyMap());
    }

    public String exchangeIdTokenForAccessToken(String userEmail, String idToken) throws Exception {

        FirebaseToken decodeToken = firebaseAuth.verifyIdToken(idToken, true);
        if (!decodeToken.isEmailVerified())
            throw new FirebaseAuthException("EMAIL_NOT_VERIFIED", "User must verify their email first");
        if (!userEmail.equalsIgnoreCase(decodeToken.getEmail()))
            throw new FirebaseAuthException("EMAIL_NOT_MATCH", "Provided email doesn't match with email in IdToken");

        return buildNewJWT(decodeToken.getEmail());
    }
}
