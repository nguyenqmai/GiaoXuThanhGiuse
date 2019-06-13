package com.themais.firebaseserver.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.themais.firebaseserver.model.BaseMessage;
import com.themais.firebaseserver.model.ContactInfo;
import com.themais.firebaseserver.model.EventInfo;
import com.themais.firebaseserver.model.TopicNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by nguyenqmai on 6/3/2019.
 */
@Service
public class FireStorageService {
    @Autowired
    Firestore firestore;

    public List<String> getAllAvailableTopicNames() {
        ApiFuture<QuerySnapshot> query = firestore.collection("topics").select(FieldPath.documentId()).get();
        try { // query.get() blocks on response
            return query.get().getDocuments().stream().map(it -> it.getId()).collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }


    public List<TopicNode> getAllAvailableTopics() {
        ApiFuture<QuerySnapshot> query = firestore.collection("topics").get();
        try { // query.get() blocks on response
            return query.get().getDocuments().
                    stream().
                    map(doc -> {
                        TopicNode tmp = doc.toObject(TopicNode.class);
                        tmp.setId(doc.getId());
                        return tmp;
                    }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean upsertTopic(TopicNode newTopic) {
        try {
            firestore.collection("topics").document().set(newTopic).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<BaseMessage> getBaseMessages(String topic, BaseMessage.Status status) {
        try { // query.get() blocks on response
            Query query = firestore.collection("baseMessages");
            if (topic != null) {
                query = query.whereEqualTo("topic", topic);
            }

            if (status != null) {
                query = query.whereEqualTo("status", status);
            }
            return query.get().
                    get().
                    getDocuments().
                    stream().
                    map(doc -> {
                        BaseMessage tmp = doc.toObject(BaseMessage.class);
                        tmp.setId(doc.getId());
                        return tmp;
                    }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean addNewBaseMessage(String topic, BaseMessage newMessage) {
        if (!topic.equals(newMessage.getTopic()))
            return false;
        try {
            newMessage.setCreationTime(Timestamp.now());
            newMessage.setStatus(BaseMessage.Status.NEW);
            firestore.collection("baseMessages").document().set(newMessage).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean updateStatus(String messageId, BaseMessage.Status status, String exceptionDetail) {
        if (status == null)
            return false;
        try {
            DocumentReference docRef = firestore.collection("baseMessages").document(messageId);
            ApiFuture<WriteResult> future = (exceptionDetail == null) ?
                    docRef.update("status", status.name()) :
                    docRef.update("status", status.name(), "exceptionDetail", exceptionDetail);
            WriteResult result = future.get();
            System.out.println("Write result: " + result);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<EventInfo> getMassHours() {
        ApiFuture<QuerySnapshot> query = firestore.collection("massHours").orderBy("displayOrder", Query.Direction.ASCENDING).get();
        try { // query.get() blocks on response
            return query.get().getDocuments().
                    stream().
                    map(doc -> {
                        EventInfo tmp = doc.toObject(EventInfo.class);
                        tmp.setId(doc.getId());
                        return tmp;
                    }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean upsertMassHour(EventInfo massHour) {
        try {
            firestore.collection("massHours").document().set(massHour).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteMassHour(String massHourId) {
        try {
            firestore.collection("massHours").document(massHourId).delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<ContactInfo> getAllContacts() {
        ApiFuture<QuerySnapshot> query = firestore.collection("contacts").get();
        try { // query.get() blocks on response
            return query.get().getDocuments().
                    stream().
                    map(doc -> {
                        ContactInfo tmp = doc.toObject(ContactInfo.class);
                        tmp.setId(doc.getId());
                        return tmp;
                    }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean upsertContactInfo(ContactInfo contactInfo) {
        try {
            firestore.collection("contacts").document().set(contactInfo).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteContactInfo(String contactInfoId) {
        try {
            firestore.collection("contacts").document(contactInfoId).delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
