// Import necessary modules and services
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // reference to the input element with the id 'userIdInput'
  @ViewChild('userIdInput')
  //store user ID, password, error message, and other form controls
  userIdInput!: ElementRef;
  userid: string = '';
  password: string = '';
  errorMessage: string = '';
  userIdFormControl = this.fb.control('', [Validators.required]);
  passwordFormControl = this.fb.control('', [Validators.required]);
  hide = true;
  rememberMe: boolean = false;
  loading: boolean = false;
  // Variables to fetch labels from a JSON file
  welcomeLabel: any;
  ExpressHypeLabel: any;
  LoginLabel: any;
  LogininwithLabel: any;
  UserIDLabel: any;
  PasswordLabel: any;
  RememberMeLabel: any;
  LoginButtonLable: any;
  UserIDError: any;
  UserPasswordError: any;
  FieldError: any;
  UserIDValidationError: any;
  UserIDInactiveError: any;
  PasswordValidationError: any;
  APIError: any;
  EnteryourUserID: any;
  Enteryourpassword: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient, //HTTP request to fetch the JSON file
    private authService: AuthService
  ) {}
  // initialize the component
  ngOnInit(): void {
    // Fetch labels from the JSON file
    this.fetchLabels();
    // Retrieve 'rememberMe' value from localStorage
    const storedRememberMe = localStorage.getItem('rememberMe');
    this.rememberMe = storedRememberMe ? JSON.parse(storedRememberMe) : false;
    // If 'rememberMe' is checked, retrieve user ID and password from localStorage

    if (this.rememberMe) {
      // Retrieve user ID and password from localStorage if 'Remember Me' is checked
      this.userid = localStorage.getItem('userid') || '';
      this.password = localStorage.getItem('password') || '';
    }
  }
  // focus on the user ID input field after the view has been initialized
  ngAfterViewInit() {
    this.userIdInput.nativeElement.focus();
  }
  // Function to hide the error message
  hideErrorMessage() {
    this.errorMessage = '';
  }
  // Function to handle the change event of the 'Remember Me' toggle
  onRememberMeChange(event: MatSlideToggleChange): void {
    this.rememberMe = event.checked;

    // Store the 'rememberMe' value in localStorage
    localStorage.setItem('rememberMe', JSON.stringify(this.rememberMe));
    // If 'rememberMe' is unchecked, clear stored credentials from localStorage
    if (!this.rememberMe) {
      // Clear stored credentials if 'Remember Me' is unchecked
      localStorage.removeItem('userId');
      localStorage.removeItem('password');
    }
  }
  // Function to fetch labels from the JSON file
  fetchLabels(): void {
    this.http.get<any>('assets/labels.json').subscribe((data) => {
      this.welcomeLabel = data.labels[0].welcomeLabel;
      this.ExpressHypeLabel = data.labels[0].ExpressHypeLabel;
      this.LoginLabel = data.labels[0].LoginLabel;
      this.LogininwithLabel = data.labels[0].LogininwithLabel;
      this.UserIDLabel = data.labels[0].UserIDLabel;
      this.PasswordLabel = data.labels[0].PasswordLabel;
      this.RememberMeLabel = data.labels[0].RememberMeLabel;
      this.LoginButtonLable = data.labels[0].LoginButtonLable;
      this.EnteryourUserID = data.labels[0].EnteryourUserID;
      this.Enteryourpassword = data.labels[0].Enteryourpassword;
      this.UserIDError = data.error[0].UserIDError;
      this.UserPasswordError = data.error[0].UserPasswordError;
      this.FieldError = data.error[0].FieldError;
      this.UserIDValidationError = data.error[0].UserIDValidationError;
      this.UserIDInactiveError = data.error[0].UserIDInactiveError;
      this.PasswordValidationError = data.error[0].PasswordValidationError;
      this.APIError = data.error[0].APIError;
    });
  }
  // Function to handle the login process
  login(): void {
    // Check if both User ID and password are entered
    if (!this.userid || !this.password) {
      this.errorMessage = this.FieldError;
      return;
    } else {
      this.errorMessage = ''; // Hide the error message
    }

    this.loading = true;
    setTimeout(() => {
      // Fetch user credentials from the dummy API
      this.authService.authenticateUser(this.userid, this.password).subscribe(
        (response: any) => {
          //console.log(response);
          // After successful login, set the user ID in the auth service
          const userid = this.userid;
          this.authService.setUserId(userid);
          this.router.navigate(['/home']);

          if (this.rememberMe) {
            localStorage.setItem('userid', this.userid);
            localStorage.setItem('password', this.password);
          }
        },
        // Handle different error statuses and display appropriate error messages
        (error) => {
          if (error.status === 409) {
            this.errorMessage = this.UserIDInactiveError;
          } else if (error.status === 401) {
            this.errorMessage = this.PasswordValidationError;
          } else if (error.status === 400) {
            this.errorMessage = this.UserIDValidationError;
          } else {
            this.errorMessage = this.APIError;
          }
        }
      );

      this.loading = false; // Set loading state back to false
    }, 1000); // Simulate API call delay, adjust as needed
  }
}
