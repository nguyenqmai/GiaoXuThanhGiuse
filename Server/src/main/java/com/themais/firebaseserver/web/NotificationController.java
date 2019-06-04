package com.themais.firebaseserver.web;


import com.themais.firebaseserver.model.BaseMessage;
import com.themais.firebaseserver.model.TopicNode;
import com.themais.firebaseserver.service.FireStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    FireStorageService fireStorageService;

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
        return fireStorageService.addNewTopic(newTopic);
    }


    @GetMapping("/topics/{topic}/messages")
    List<BaseMessage> getAllBaseMessages(@PathVariable(name = "topic") String topic,
                                         @RequestParam(name = "status", required = false) BaseMessage.Status status) {
        return fireStorageService.getBaseMessages(topic, status);
    }

    @PutMapping("/topics/{topic}/messages")
    boolean addNewBaseMessage(@PathVariable(name = "topic") String topic, @RequestBody BaseMessage newMessage) {
        return fireStorageService.addNewBaseMessage(topic, newMessage);
    }
}
