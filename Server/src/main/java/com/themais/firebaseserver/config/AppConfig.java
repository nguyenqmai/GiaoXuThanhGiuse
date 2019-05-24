package com.themais.firebaseserver.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * Created by nguyenqmai on 2/7/2019.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    String adminServiceAccountKeyFile;
    int value;

//    @Bean
//    public FirebaseApp getFirebaseApp() throws IOException {
//
//        FileInputStream serviceAccount = new FileInputStream(adminServiceAccountKeyFile);
//
//        FirebaseOptions options = new FirebaseOptions.Builder()
//                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                .build();
//
//        return FirebaseApp.initializeApp(options);
//
//    }
}
