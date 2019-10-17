package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

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

    @Exclude
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ContactInfo self() {
        return this;
    }
}
