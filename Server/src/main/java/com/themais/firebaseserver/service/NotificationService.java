package com.themais.firebaseserver.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.themais.firebaseserver.model.BaseMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by nguyenqmai on 6/3/2019.
 */
@Service
public class NotificationService {
    static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    FireStorageService fireStorageService;

    @Autowired
    FirebaseMessaging firebaseMessaging;

    @Scheduled(cron = "${cron.expression}")
    void processNewBaseMessages() {
        for (BaseMessage msg : fireStorageService.getBaseMessages(null, BaseMessage.Status.NEW)) {
            try {
                if (msg.getTopic() == null)
                    continue;

                Message.Builder builder = Message.builder().setTopic(msg.getTopic());

                if (msg.getTitle() != null && msg.getBody() != null)
                    builder.setNotification(new Notification(msg.getTitle(), msg.getBody()));

                if (msg.getData() != null) {
                    builder.putAllData(msg.getData());
                }
                firebaseMessaging.send(builder.build());
                fireStorageService.updateStatus(msg.getId(), BaseMessage.Status.PROCESSED_SUCCESSFULLY, null);

            } catch (Exception e) {
                fireStorageService.updateStatus(msg.getId(), BaseMessage.Status.EXCEPTION, exceptionToString(e));
            }
        }
    }

    private String exceptionToString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }
}
