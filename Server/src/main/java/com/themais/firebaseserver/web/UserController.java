package com.themais.firebaseserver.web;

import com.google.common.collect.ImmutableMap;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.themais.firebaseserver.model.ContactInfo;
import com.themais.firebaseserver.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private AuthService authService;

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    @PostMapping("/{userEmail}/authorization")
    Map<String, String> authorizeUserFromIdToken(@PathVariable String userEmail, @RequestBody String idToken) {
        try {
            return ImmutableMap.of("accessToken", authService.exchangeIdTokenForAccessToken(userEmail, idToken), "failedReason", "");
//        return "{\"owner\":\"sds\", \"notification\": {\"giao_xu_thanh_giuse\":[\"CAN_SEND_MSG\"],\"Vietnamese_class_02\": [\"CAN_SEND_MSG\"]}}";
        } catch (Exception e) {
            logger.warn("Exception while validating and exchange IdToken for AccessToken", e);
            return ImmutableMap.of("accessToken", "", "failedReason", "ERROR: " + e.getMessage());
        }
    }
}
