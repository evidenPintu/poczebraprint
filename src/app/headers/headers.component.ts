import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css'],
})
export class HeadersComponent {
  userid: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Retrieve the user ID from localStorage
    this.userid = this.authService.getUserId();
  }
  logout() {
    // Show the progress spinner
    this.loading = true;

    // Call the logout method from AuthService
    this.authService.logout();

    // Simulate a delay before navigating to the login page
    setTimeout(() => {
      // Hide the progress spinner
      this.loading = false;

      // Navigate to the login page
      this.router.navigate(['/login']);
    }, 2000); // Adjust the delay as needed
  }
}
