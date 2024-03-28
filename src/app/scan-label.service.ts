import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScanLabelService {
  private apiUrl = 'http://129.154.40.128:8000/api';
  response: any;

  constructor(private http: HttpClient) {}

  postShippingDetails(data: any): Observable<any> {
    //console.log(data);
    return this.http.post<any>(`${this.apiUrl}/savescanitem`, data);
  }
  getUom(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getalluom`);
  }
  updateShippingDetails(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updatescanitem`, data);
  }
  postRewarehouseDeatil(data: any): Observable<any> {
    console.log(data);
    return this.http.post<any>(`${this.apiUrl}/rewarehouse`, data);
  }

  getAlllocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getalllocations`);
  }
}
