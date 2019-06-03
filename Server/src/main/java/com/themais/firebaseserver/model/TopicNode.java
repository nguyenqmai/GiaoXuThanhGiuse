package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by nguyenqmai on 5/30/2019.
 */
@Data
public class TopicNode {
    @Exclude private String id;
    private String displayName;
    private String parentId;

    @Exclude
    public String getId() {
        return id;
    }

    @Exclude
    public void setId(String id) {
        this.id = id;
    }
}
