package com.themais.firebaseserver.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.themais.firebaseserver.model.ContactInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Objects;

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

    public String buildNewJWT(String userEmail) throws Exception {
        ContactInfo user = fireStorageService.getContactWithUid(getUidByEmail(userEmail));
        Map<String, Object> developerClaims = user == null ? Collections.emptyMap() : user.getAuthorization();
        return firebaseAuth.createCustomToken(userEmail, developerClaims != null ? developerClaims : Collections.emptyMap());
    }

    public String exchangeIdTokenForAccessToken(String userEmail, String idToken) throws Exception {
        if (!hasUserWithEmail(userEmail))
            throw new FirebaseAuthException("EMAIL_NOT_MATCH", "Provided email doesn't match with any user");

        FirebaseToken decodeToken = firebaseAuth.verifyIdToken(idToken, true);
        if (!decodeToken.isEmailVerified())
            throw new FirebaseAuthException("EMAIL_NOT_VERIFIED", "User must verify their email first");
        if (!userEmail.equalsIgnoreCase(decodeToken.getEmail()))
            throw new FirebaseAuthException("EMAIL_NOT_MATCH", "Provided email doesn't match with email in IdToken");

        return buildNewJWT(decodeToken.getEmail());
    }

    public String getUidByEmail(String email) throws Exception {
        UserRecord userRecord = firebaseAuth.getUserByEmail(email);
        return userRecord.getUid();
    }

    public boolean hasUserWithEmail(String email) throws Exception {
        try {
            UserRecord userRecord = firebaseAuth.getUserByEmail(email);
            return true;
        } catch (FirebaseAuthException e) {
            if ("user-not-found".equalsIgnoreCase(e.getErrorCode())) {
                return false;
            }
            throw e;
        }
    }

    public String createUser(ContactInfo contactInfo) throws Exception {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(contactInfo.getEmail())
                    .setPassword(String.valueOf(Objects.hashCode(Math.random())))
                    .setDisplayName(contactInfo.getName())
                    .setDisabled(false);

            return firebaseAuth.createUser(request).getUid();
    }

    public boolean deleteUser(String uuid) throws Exception {
        firebaseAuth.deleteUser(uuid);
        return true;
    }
}
