package com.themais.firebaseserver.model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.Map;

/**
 * Created by nguyenqmai on 5/31/2019.
 */
@Data
public class BaseMessage {
    @Exclude
    private String id;
    private Timestamp creationTime;
    private Status status;
    private String topic;
    private String title;
    private String body;

    private Map<String, String> data;
    private String exceptionDetail;

    @Exclude
    public String getId() {
        return id;
    }

    @Exclude
    public void setId(String id) {
        this.id = id;
    }

    public enum Status {
        NEW, PROCESSED_SUCCESSFULLY, EXCEPTION
    }
}
