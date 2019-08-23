import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Contact} from "../model/contact.model";
import {EventInfo} from "../model/eventinfo.model";


@Injectable({
    providedIn: 'root'
})
export class BackendService {

    private URL_PREFIX = "http://localhost:8080/rest/";
    constructor(private http: HttpClient) {
        this.setup();
    }

    private setup() {
    }

    public getAllContacts(): Observable<Contact> {
        return this.http.get<Contact>(`${this.URL_PREFIX}contacts`);
    }

    public getOfficeHours(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}events/officeHours`);
    }

    public getMassSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}events/massSchedule`);
    }

    public getConfessionSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}events/confession`);
    }

}
