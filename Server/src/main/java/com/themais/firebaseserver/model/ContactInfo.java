package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

/**
 * Created by nguyenqmai on 6/10/2019.
 */
@Data
public class ContactInfo {
    @Exclude
    private String id;
    private String title;
    private String name;
    private String phone;

    @Exclude
    public String getId() {
        return id;
    }

    @Exclude
    public void setId(String id) {
        this.id = id;
    }
}
