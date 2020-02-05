package com.themais.firebaseserver.web;


import com.google.common.collect.ImmutableMap;
import com.themais.firebaseserver.model.ContactInfo;
import com.themais.firebaseserver.model.EventInfo;
import com.themais.firebaseserver.service.AuthService;
import com.themais.firebaseserver.service.FireStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/contacts")
public class ContactController {
    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    FireStorageService fireStorageService;

    @Autowired
    private AuthService authService;

    @GetMapping("/")
    Collection<ContactInfo> getAllContacts() {
        return fireStorageService.getAllContacts().values();
    }

    @PostMapping("/")
    boolean upsertContactInfo(@RequestBody ContactInfo contactInfo) {
        try {
            if (contactInfo.getAuthorization() != null &&
                    contactInfo.getAuthorization().size() > 0 &&
                    !authService.hasUserWithEmail(contactInfo.getEmail())) {
                authService.createUser(contactInfo);
            }
        } catch (Exception e) {
            logger.warn("Failed to create user {}", contactInfo.getEmail(), e);
        }
        return fireStorageService.upsertContactInfo(contactInfo);
    }

    @GetMapping("/{contactInfoId}/")
    boolean deleteContact(@PathVariable(name = "contactInfoId") String contactInfoId) {
        return fireStorageService.deleteContactInfo(contactInfoId);
    }


    @PostMapping("/{userEmail}/authorization")
    Map<String, String> authorizeUserFromIdToken(@PathVariable String userEmail, @RequestBody String idToken) {
        try {
            return ImmutableMap.of("accessToken", authService.exchangeIdTokenForAccessToken(userEmail, idToken), "failedReason", "");
        } catch (Exception e) {
            logger.warn("Exception while validating and exchange IdToken for AccessToken", e);
            return ImmutableMap.of("accessToken", "", "failedReason", "ERROR: " + e.getMessage());
        }
    }

}
