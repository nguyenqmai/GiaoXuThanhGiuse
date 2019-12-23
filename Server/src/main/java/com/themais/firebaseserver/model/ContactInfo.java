package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.Map;

/**
 * Created by nguyenqmai on 6/10/2019.
 */
@Data
public class ContactInfo {
    private String id;
    private String title;
    private String name;
    private String phone;
    private String email;
    private Map<String, Object> authorization;

    @Exclude
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Exclude
    public Map<String, Object> getAuthorization() {
        return authorization;
    }

    @Exclude
    public ContactInfo self() {
        return this;
    }
}
