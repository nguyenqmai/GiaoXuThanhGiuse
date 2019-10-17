package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

/**
 * Created by nguyenqmai on 5/30/2019.
 */
@Data
public class TopicNode {
    private String id;
    private String vietnameseName;
    private String englishName;
    private String parentId;

    @Exclude
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
