package com.themais.firebaseserver.web;


import com.themais.firebaseserver.model.BaseMessage;
import com.themais.firebaseserver.model.TopicNode;
import com.themais.firebaseserver.service.FireStorageService;
import com.themais.firebaseserver.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/notifications")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    FireStorageService fireStorageService;

    @Autowired
    NotificationService notificationService;

    @GetMapping("/topicNames/")
    List<String> getAllAvailableTopicNames() {
        return fireStorageService.getAllAvailableTopicNames();
    }

    @GetMapping("/topics/")
    List<TopicNode> getAllAvailableTopics() {
        return fireStorageService.getAllAvailableTopics();
    }

    @PostMapping("/topics/")
    boolean addNewTopic(@RequestBody TopicNode newTopic) {
        return fireStorageService.upsertTopic(newTopic);
    }


    @GetMapping("/topics/{topic}/messages")
    List<BaseMessage> getAllBaseMessages(@PathVariable(name = "topic") String topic,
                                         @RequestParam(name = "status", required = false) BaseMessage.Status status) {
        return fireStorageService.getBaseMessages(topic, status);
    }

    @PutMapping("/topics/{topic}/messages")
    BaseMessage.Status addNewBaseMessage(@PathVariable(name = "topic") String topic, @RequestBody BaseMessage newMessage) throws Exception {

        try {
            fireStorageService.addNewBaseMessage(topic, newMessage);
            return BaseMessage.Status.NEW;
        } catch (Exception e) {
            logger.warn("Exception while saving BaseMessage", e);
            throw e;
        }
    }
}
