package com.themais.firebaseserver.web;


import com.themais.firebaseserver.model.EventInfo;
import com.themais.firebaseserver.service.FireStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/rest/events")
public class EventController {

    @Autowired
    FireStorageService fireStorageService;

//    @GetMapping("/massSchedule/")
//    List<EventInfo> getMassHours() {
//        return fireStorageService.getEventInfos(EventType.massSchedule.name());
//    }
//
//    @PostMapping("/massSchedule/")
//    boolean upsertMassHour(@RequestBody EventInfo massHour) {
//        return fireStorageService.upsertEventInfo(EventType.massSchedule.name(), massHour);
//    }
//
//    @DeleteMapping("/massSchedule/{massHourId}/")
//    boolean deleteMassHour(@PathVariable(name = "massHourId") String massHourId) {
//        return fireStorageService.deleteEventInfo(EventType.massSchedule.name(), massHourId);
//    }
//
//    @GetMapping("/officeHours/")
//    List<EventInfo> getOfficeHours() {
//        return fireStorageService.getEventInfos(EventType.officeHours.name());
//    }
//
//    @PostMapping("/officeHours/")
//    boolean upsertOfficeHour(@RequestBody EventInfo officeHour) {
//        return fireStorageService.upsertEventInfo(EventType.officeHours.name(), officeHour);
//    }
//
//    @DeleteMapping("/officeHours/{officeHourId}/")
//    boolean deleteOfficeHour(@PathVariable(name = "officeHourId") String officeHourId) {
//        return fireStorageService.deleteEventInfo(EventType.officeHours.name(), officeHourId);
//    }
//
//    @GetMapping("/confession/")
//    List<EventInfo> getConfessionEvents() {
//        return fireStorageService.getEventInfos(EventType.confession.name());
//    }
//
//    @PostMapping("/confession/")
//    boolean upsertConfessionEvent(@RequestBody EventInfo officeHour) {
//        return fireStorageService.upsertEventInfo(EventType.confession.name(), officeHour);
//    }
//
//    @DeleteMapping("/confession/{confessionEventId}/")
//    boolean deleteConfessionEvent(@PathVariable(name = "confessionEventId") String confessionEventId) {
//        return fireStorageService.deleteEventInfo(EventType.confession.name(), confessionEventId);
//    }

    @GetMapping("/")
    List<EventInfo> getEventInfos(@RequestParam(required = false, name = "tag") String tag) {
        return fireStorageService.getEventInfos(tag);
    }

    @GetMapping("/{eventId}/")
    EventInfo getEventInfo(@PathVariable(name = "eventId") String eventId) {
        return fireStorageService.getEventInfo(eventId);
    }

    @PostMapping("/")
    boolean upsertEventInfo(@RequestBody EventInfo officeHour) {
        return fireStorageService.upsertEventInfo(officeHour);
    }

    @DeleteMapping("/{eventId}/")
    boolean deleteEventInfo(@PathVariable(name = "eventId") String eventId) {
        return fireStorageService.deleteEventInfo(eventId);
    }


}
