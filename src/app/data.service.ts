import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  slp(slp: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://129.154.40.128:8000/api';
  dataChanged: any;

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<any> {
    //console.log(this.dataChanged);
    return this.http.get<any>(`${this.apiUrl}/getallitems`);
  }
  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallitems`);
  }
  updateData(id: number, updatedData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updatescanitem`, updatedData);
  }

  deleteItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inactivatescanitem`, item);
  }
  getAllItemsStatus(): Observable<any> {
    //console.log(this.dataChanged);
    return this.http.get<any>(
      `${this.apiUrl}/getitemsbywmsstatus?wmsstatus=Received`
    );
  }
}
