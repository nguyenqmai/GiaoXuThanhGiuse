package com.themais.firebaseserver.web;


import com.themais.firebaseserver.model.ContactInfo;
import com.themais.firebaseserver.model.EventInfo;
import com.themais.firebaseserver.service.FireStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by nguyenqmai on 2/5/2019.
 */
@RestController
@RequestMapping("/contacts")
public class ContactController {
    @Autowired
    FireStorageService fireStorageService;

    @GetMapping("/")
    List<ContactInfo> getAllContacts() {
        return fireStorageService.getAllContacts();
    }

    @PostMapping("/")
    boolean upsertContactInfo(@RequestBody ContactInfo contactInfo) {
        return fireStorageService.upsertContactInfo(contactInfo);
    }

    @GetMapping("/{contactInfoId}/")
    boolean deleteMassHour(@PathVariable(name = "contactInfoId") String contactInfoId) {
        return fireStorageService.deleteContactInfo(contactInfoId);
    }

}
