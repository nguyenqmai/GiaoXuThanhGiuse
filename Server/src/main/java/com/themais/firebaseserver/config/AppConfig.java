package com.themais.firebaseserver.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * Created by nguyenqmai on 2/7/2019.
 */
@Data
@Configuration
@ComponentScan(basePackages = "com.themais.firebaseserver")
@EnableScheduling
@ConfigurationProperties(prefix = "app")

public class AppConfig {
    String adminServiceAccountKeyFile;
    int value;

    @Bean
    public FirebaseApp getFirebaseApp() throws IOException {

        try (FileInputStream serviceAccount = new FileInputStream(adminServiceAccountKeyFile)) {

            ServiceAccountCredentials serviceAccountInfo = ServiceAccountCredentials.fromStream(serviceAccount);
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(serviceAccountInfo)
                    .setProjectId(serviceAccountInfo.getProjectId())
                    .setServiceAccountId(serviceAccountInfo.getClientId())
                    .build();

            return FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public FirebaseMessaging getFirebaseMessaging() throws IOException {
        return FirebaseMessaging.getInstance(getFirebaseApp());
    }

    @Bean
    public Firestore getFirestore() throws IOException {
        return FirestoreClient.getFirestore(getFirebaseApp());

    }
}
