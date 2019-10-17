package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.List;

/**
 * Created by nguyenqmai on 6/9/2019.
 */
@Data
public class EventInfo {
    private String id;
    private int displayOrder;
    private String displayName;
    private String note;
    private List<String> tags;
    private List<String> contactIds;
    private List<Occurrence> occurrences;
    private List<ContactInfo> contacts;


    @Exclude
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Exclude
    public List<ContactInfo> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactInfo> contacts) {
        this.contacts = contacts;
    }
}
