package com.themais.firebaseserver.controller;

import com.fasterxml.jackson.databind.ser.Serializers;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.messaging.FirebaseMessaging;
import com.themais.firebaseserver.model.BaseMessage;
import com.themais.firebaseserver.model.TopicNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    FirebaseMessaging firebaseMessaging;
//            FirebaseMessaging.getInstance().
//                    send(Message.builder().
//                            setTopic("MainGroup01.SubGroup03").
//                            //setNotification(new Notification("admin-title" + System.currentTimeMillis(), "admin-body" + System.currentTimeMillis())).
//                                    putData("sample-key01", "sample-data01").build());

    @Autowired
    Firestore firestore;

    @GetMapping("/topicNames/")
    List<String> getAllAvailableTopicNames() {
        ApiFuture<QuerySnapshot> query = firestore.collection("topics").select(FieldPath.documentId()).get();
        try { // query.get() blocks on response
            return query.get().getDocuments().stream().map(it -> it.getId()).collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @GetMapping("/topics/")
    List<TopicNode> getAllAvailableTopics() {
        ApiFuture<QuerySnapshot> query = firestore.collection("topics").get();
        try { // query.get() blocks on response
            return query.get().getDocuments().
                    stream().
                    map(doc -> { TopicNode tmp = doc.toObject(TopicNode.class); tmp.setId(doc.getId()); return tmp; }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @PostMapping("/topics/")
    boolean addNewTopic(@RequestBody TopicNode newTopic) {
        try {
            firestore.collection("topics").document(newTopic.getId()).set(newTopic).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    @GetMapping("/topics/{topic}/messages")
    List<BaseMessage> getAllBaseMessages(@PathVariable(name = "topic") String topic, @RequestParam(name = "processStatus", required = false) Boolean processStatus) {
        try { // query.get() blocks on response
            Query query = firestore.collection("messages").whereEqualTo("topic", topic);
            if (processStatus != null) {
                query = query.whereEqualTo("processed", processStatus);
            }
            return query.get().
                    get().
                    getDocuments().
                    stream().
                    map(doc -> { BaseMessage tmp = doc.toObject(BaseMessage.class); tmp.setId(doc.getId()); return tmp; }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @PutMapping("/topics/{topic}/messages")
    boolean addNewBaseMessage(@PathVariable(name = "topic") String topic, @RequestBody BaseMessage newMessage) {
        if (!topic.equals(newMessage.getTopic()))
            return false;
        try {
            newMessage.setCreationTime(Timestamp.now());
            newMessage.setProcessed(false);
            firestore.collection("messages").document().set(newMessage).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping("/messages/{messageId}")
    boolean updateProcessStatus(@PathVariable(name = "messageId") String messageId, @RequestBody Boolean processStatus) {
        if (processStatus == null)
            return false;
        try {
            DocumentReference docRef = firestore.collection("messages").document(messageId);
            ApiFuture<WriteResult> future = docRef.update("processed", processStatus);
            WriteResult result = future.get();
            System.out.println("Write result: " + result);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
