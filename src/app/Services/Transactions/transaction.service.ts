import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ReportItem, ReportResponse, SaveTransaction, Transaction } from "../../Interfaces/generic.interface";

@Injectable({
    providedIn: 'root'
})

export class TransactionService {
    private urlApi: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json'
        });
    }

    getListTransactionByAccount(numberAccount: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.urlApi}/transaction/ListTransactionByAccount/${numberAccount}`);
    }

    getListTransactionAccountByDates(report: ReportItem): Observable<ReportResponse> {
        return this.http.get<ReportResponse>(`${this.urlApi}/transaction/GenerateReportAccountByDates?AccountNumber=${report.accountNumber}&StartDate=${report.startDate}&EndDate=${report.endDate}`);
    }

    postCreateAccount(transaction: SaveTransaction): Observable<any> {
        const url = `${this.urlApi}/transaction/CreateTransaction`;
        return this.http.post<any>(url, transaction, {
            headers: this.getHeaders()
        });
    }


}
