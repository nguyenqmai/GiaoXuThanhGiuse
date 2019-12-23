package com.themais.firebaseserver.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.themais.firebaseserver.model.BaseMessage;
import org.apache.commons.lang3.time.FastDateFormat;
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
    static final FastDateFormat dateFormatter = FastDateFormat.getInstance("yyyy-MM-dd hh:mm:ss");
    @Autowired
    FireStorageService fireStorageService;

    @Autowired
    FirebaseMessaging firebaseMessaging;

    @Scheduled(cron = "${cron.expression:13 */3 * * * ?}")
//    @Scheduled(fixedRate = 30000)
    void processNewBaseMessages() {
        logger.info("Processing new base messages ... {}", dateFormatter.format(System.currentTimeMillis()));
        for (BaseMessage msg : fireStorageService.getBaseMessages(null, BaseMessage.Status.NEW)) {
            try {
                if (msg.getTopic() == null)
                    continue;

                fireStorageService.updateStatus(msg.getId(), sendBaseMessage(msg), null);
            } catch (Exception e) {
                fireStorageService.updateStatus(msg.getId(), BaseMessage.Status.EXCEPTION, exceptionToString(e));
            }
        }
    }

    public BaseMessage.Status sendBaseMessage(BaseMessage msg) throws Exception {
        if (msg.getTopic() == null)
            return BaseMessage.Status.IGNORED;

        Message.Builder builder = Message.builder().setTopic(msg.getTopic());

        if (msg.getTitle() != null && msg.getBody() != null)
            builder.setNotification(new Notification(msg.getTitle(), msg.getBody()));


        builder.putData("topic", msg.getTopic());
        builder.putData("title", msg.getTitle());
        builder.putData("body", msg.getBody());
        builder.putData("creationTime", String.valueOf(msg.getCreationTime()));
        if (msg.getExtraData() != null) {
            builder.putAllData(msg.getExtraData());
        }
        firebaseMessaging.send(builder.build());
        return BaseMessage.Status.PROCESSED_SUCCESSFULLY;
    }

    private String exceptionToString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }
}
