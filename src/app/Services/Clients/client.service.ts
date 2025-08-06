import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Clients } from "../../Interfaces/generic.interface";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private urlApi: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json'
        });
    }

    getClients(): Observable<Clients[]> {
        return this.http.get<Clients[]>(`${this.urlApi}/clients/ListClient`);
    }

    getClientById(identity: string): Observable<Clients> {
        return this.http.get<Clients>(`${this.urlApi}/clients/GetClientByIdentity/${identity}`);
    }

    postCreateClient(clients: Clients): Observable<any> {
        const url = `${this.urlApi}/clients/CreateClient`;
        return this.http.post<any>(url, clients, {
            headers: this.getHeaders()
        });
    }

    putUpdateClient(clients: Clients): Observable<any> {
        const url = `${this.urlApi}/clients/UpdateClient`;
        return this.http.put<any>(url, clients, {
            headers: this.getHeaders()
        });
    }

    DeleteClient(identity: string): Observable<any> {
    const url = `${this.urlApi}/clients/DeleteClient/${identity}`;
    return this.http.delete<any>(url, {
        headers: this.getHeaders()
    });
}
}
