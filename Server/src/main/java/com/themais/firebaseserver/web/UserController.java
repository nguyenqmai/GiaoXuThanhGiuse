package com.themais.firebaseserver.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/users")
public class UserController {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }
}
