package com.themais.firebaseserver;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;

@SpringBootApplication(
        exclude = {
                org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
                org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class}
)
public class FirebaseserverApplication {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(FirebaseserverApplication.class, args);

//        try(FileInputStream serviceAccount = new FileInputStream("E:\\workspaces\\IntelliJ-workspace\\GiaoXuThanhGiuse\\Server\\src\\main\\resources\\my-first-project0123-firebase-adminsdk-pjw6z-d05f5c55b5.json")) {
//
//            ServiceAccountCredentials serviceAccountInfo = ServiceAccountCredentials.fromStream(serviceAccount);
//            FirebaseOptions options = new FirebaseOptions.Builder()
//                    .setCredentials(serviceAccountInfo)
//                    .setProjectId(serviceAccountInfo.getProjectId())
//                    .setServiceAccountId(serviceAccountInfo.getClientId())
//                    .build();
//
//            FirebaseApp baseInstance = FirebaseApp.initializeApp(options);
//            FirebaseMessaging msgApp = FirebaseMessaging.getInstance(baseInstance);
//
//            System.out.println(String.format("%s => %s", baseInstance.getName(), baseInstance.getOptions().getProjectId()));
//
//            FirebaseMessaging.getInstance().
//                    send(Message.builder().
//                            setTopic("MainGroup01.SubGroup03").
//                            setNotification(new Notification("admin-title" + System.currentTimeMillis(), "admin-body" + System.currentTimeMillis())).
//                            putData("sample-key01", "sample-data01").build());
//        }
    }

}
