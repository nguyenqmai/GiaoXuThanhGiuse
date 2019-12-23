package com.themais.firebaseserver.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }
}
