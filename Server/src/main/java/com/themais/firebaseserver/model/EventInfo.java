package com.themais.firebaseserver.model;

import com.google.cloud.firestore.annotation.Exclude;
import lombok.Data;

import java.util.List;

/**
 * Created by nguyenqmai on 6/9/2019.
 */
@Data
public class EventInfo {
    @Exclude
    private String id;
    private int displayOrder;
    private String displayName;
    private String note;
    private List<String> tags;
    private List<Occurrence> occurrences;
    private List<String> contactIds;


    @Exclude
    public String getId() {
        return id;
    }

    @Exclude
    public void setId(String id) {
        this.id = id;
    }
}
