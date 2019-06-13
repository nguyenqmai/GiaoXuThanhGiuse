import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Contact} from "../model/contact.model";


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
}
