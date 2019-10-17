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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by nguyenqmai on 6/3/2019.
 */
@Service
public class FireStorageService {
    enum MyCollections {
        topics, events, baseMessages, contacts
    }

    @Autowired
    Firestore firestore;

    public List<String> getAllAvailableTopicNames() {
        ApiFuture<QuerySnapshot> query = firestore.collection(MyCollections.topics.name()).select(FieldPath.documentId()).get();
        try { // query.get() blocks on response
            return query.get().getDocuments().stream().map(it -> it.getId()).collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }


    public List<TopicNode> getAllAvailableTopics() {
        ApiFuture<QuerySnapshot> query = firestore.collection(MyCollections.topics.name()).get();
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
            return java.util.Collections.emptyList();
        }
    }

    public boolean upsertTopic(TopicNode newTopic) {
        try {
            firestore.collection(MyCollections.topics.name()).document().set(newTopic).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<BaseMessage> getBaseMessages(String topic, BaseMessage.Status status) {
        try { // query.get() blocks on response
            Query query = firestore.collection(MyCollections.baseMessages.name());
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
            return java.util.Collections.emptyList();
        }
    }

    public boolean addNewBaseMessage(String topic, BaseMessage newMessage) {
        if (!topic.equals(newMessage.getTopic()))
            return false;
        try {
            newMessage.setCreationTime(Timestamp.now());
            newMessage.setStatus(BaseMessage.Status.NEW);
            firestore.collection(MyCollections.baseMessages.name()).document().set(newMessage).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean updateStatus(String messageId, BaseMessage.Status status, String exceptionDetail) {
        if (status == null)
            return false;
        try {
            DocumentReference docRef = firestore.collection(MyCollections.baseMessages.name()).document(messageId);
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

    public List<EventInfo> getEventInfos(String tag) {
        ApiFuture<QuerySnapshot> query = (tag == null || tag.isEmpty()) ?
                firestore.collection("events").get() :
                firestore.collection("events").whereArrayContains("tags", tag).get();
        try { // query.get() blocks on response
            Map<String, ContactInfo> contacts = getAllContacts();
            return query.get().getDocuments().
                    stream().
                    map(doc -> {
                        EventInfo tmp = doc.toObject(EventInfo.class);
                        tmp.setId(doc.getId());
                        tmp.setContacts(
                            tmp.getContactIds().stream().map(id -> contacts.get(id)).collect(Collectors.toList())
                        );
                        return tmp;
                    }).
                    collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    public EventInfo getEventInfo(String eventId) {
        ApiFuture<DocumentSnapshot> query = firestore.collection(MyCollections.events.name()).document(eventId).get();
        try { // query.get() blocks on response
            EventInfo ret = query.get().toObject(EventInfo.class);
            ret.setId(eventId);
            if (!ret.getContactIds().isEmpty()) {
                Map<String, ContactInfo> contacts = getAllContacts();
                ret.setContacts(
                        ret.getContactIds().stream().map(id -> contacts.get(id)).collect(Collectors.toList())
                );
            }
            return ret;
        } catch (Exception e) {
            return null;
        }
    }

    public boolean upsertEventInfo(EventInfo eventInfo) {
        try {
            if (eventInfo.getId() != null) {
                firestore.collection(MyCollections.events.name()).document(eventInfo.getId()).set(eventInfo).get();
            } else {
                firestore.collection(MyCollections.events.name()).document().set(eventInfo).get();
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteEventInfo(String eventId) {
        try {
            firestore.collection(MyCollections.events.name()).document(eventId).delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Map<String, ContactInfo> getAllContacts() {
        ApiFuture<QuerySnapshot> query = firestore.collection(MyCollections.contacts.name()).get();
        try { // query.get() blocks on response
            return query.get().getDocuments().
                    stream().
                    map(doc -> {
                        ContactInfo tmp = doc.toObject(ContactInfo.class);
                        tmp.setId(doc.getId());
                        return tmp;
                    }).
                    collect(Collectors.toMap(ContactInfo::getId, ContactInfo::self));
        } catch (Exception e) {
            return java.util.Collections.emptyMap();
        }
    }

    public boolean upsertContactInfo(ContactInfo contactInfo) {
        try {
            firestore.collection(MyCollections.contacts.name()).document().set(contactInfo).get();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteContactInfo(String contactInfoId) {
        try {
            firestore.collection(MyCollections.contacts.name()).document(contactInfoId).delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
