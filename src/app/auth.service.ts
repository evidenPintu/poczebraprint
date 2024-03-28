import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://129.154.40.128:8000/api/authenticate';

  constructor(private http: HttpClient) {}
  // Function to authenticate a user
  authenticateUser(
    userid: string,
    password: string
    //active: boolean
  ): Observable<any> {
    // Set the headers for the HTTP request
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if needed
    });

    // Create the request body with the user's credentials
    const requestBody = {
      userid: userid,
      password: password,
    };
    // Send a POST request to the authentication API with the request body
    return this.http.post(this.apiUrl, requestBody, {
      headers,
      responseType: 'text',
    });
  }
  private userIdKey = 'user_id';

  setUserId(userid: string): void {
    localStorage.setItem(this.userIdKey, userid);
  }

  getUserId(): string {
    return localStorage.getItem(this.userIdKey) ?? '';
  }
  logout(): void {
    localStorage.removeItem(this.userIdKey);
  }
}
