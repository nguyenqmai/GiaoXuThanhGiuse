package com.themais.firebaseserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        exclude = {
                org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
                org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class}
)
public class FirebaseserverApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(FirebaseserverApplication.class, args);
    }

}

