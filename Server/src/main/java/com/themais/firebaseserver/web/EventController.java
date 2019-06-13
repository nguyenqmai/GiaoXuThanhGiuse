package com.themais.firebaseserver.web;


import com.themais.firebaseserver.model.BaseMessage;
import com.themais.firebaseserver.model.EventInfo;
import com.themais.firebaseserver.model.TopicNode;
import com.themais.firebaseserver.service.FireStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    FireStorageService fireStorageService;

    @GetMapping("/massHours/")
    List<EventInfo> getMassHours() {
        return fireStorageService.getMassHours();
    }

    @PostMapping("/massHours/")
    boolean upsertMassHour(@RequestBody EventInfo massHour) {
        return fireStorageService.upsertMassHour(massHour);
    }

    @GetMapping("/massHours/{massHourId}/")
    boolean deleteMassHour(@PathVariable(name = "massHourId") String massHourId) {
        return fireStorageService.deleteMassHour(massHourId);
    }

}
