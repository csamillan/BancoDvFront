import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Account, SaveAccount } from "../../Interfaces/generic.interface";

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    private urlApi: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json'
        });
    }

    getAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(`${this.urlApi}/account/ListAccount`);
    }

    postCreateAccount(account: SaveAccount): Observable<any> {
        const url = `${this.urlApi}/account/CreateAccount`;
        return this.http.post<any>(url, account, {
            headers: this.getHeaders()
        });
    }

    putUpdateAccount(account: SaveAccount): Observable<any> {
        const url = `${this.urlApi}/account/UpdateAccount`;
        return this.http.put<any>(url, account, {
            headers: this.getHeaders()
        });
    }

    patchDesactiveAccount(numberAccount: string): Observable<any> {
        const url = `${this.urlApi}/account/DesactiveAccount/${numberAccount}`;
        return this.http.patch<any>(url, {
            headers: this.getHeaders()
        });
    }

}
