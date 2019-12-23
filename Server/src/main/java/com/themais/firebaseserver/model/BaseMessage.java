package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by nguyenqmai on 5/31/2019.
 */
@Data
public class BaseMessage {
    private String id;
    private Long creationTime;
    private Status status;
    private String topic;
    private String title;
    private String body;

    private Map<String, String> extraData;
    private String exceptionDetail;

    @Exclude
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public enum Status {
        NEW, IGNORED, PROCESSED_SUCCESSFULLY, EXCEPTION
    }
}
