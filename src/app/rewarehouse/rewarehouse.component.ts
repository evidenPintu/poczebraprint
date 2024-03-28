import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ScanLabelService } from '../scan-label.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { jsPDF } from 'jspdf';
import { from } from 'rxjs';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-rewarehouse',
  templateUrl: './rewarehouse.component.html',
  styleUrls: ['./rewarehouse.component.css'],
})
export class RewarehouseComponent {
  FieldError: any;
  Slectoption: any;
  Requiredfield: any;
  Locationrequired: any;
  Location: any;
  NoSLP: any;
  SLPrequired: any;
  Save: any;
  successMessage = '';
  errorMessage = '';
  listLocation: any;
  title = 'fdex-form';
  shippingForm: any;
  filteredListSlp!: Observable<any[]>;
  listSlp: any[] = [];
  SLPData: any;
  responseLabel: any;
  SearchSLP: any;
  @ViewChild('shipForm') shipForm!: NgForm;
  constructor(
    private fb: FormBuilder,
    private scanlabelService: ScanLabelService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.shippingForm = this.fb.group({
      rewarehouselocationid: ['', Validators.required],
      slp: ['', Validators.required],
    });
    //console.log(this.shippingForm.controls.rewarehouselocationid.errors);
  }

  ngOnInit() {
    this.fetchLabels();
    this.scanlabelService.getAlllocations().subscribe((data) => {
      this.listLocation = data;
    });
    this.dataService.getAllItemsStatus().subscribe((data: any) => {
      //console.log('Data received:', data);
      this.listSlp = data;
      // console.log(this.listSlp);
      this.filteredListSlp = this.shippingForm.controls.slp.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || ''))
      );
    });
  }
  //
  getAlllocations(id: any) {
    //console.log(this.listLocation);
    let selectedLocation = this.listLocation.find(
      (x: any) => x.locationid == id
    );
    //console.log(selectedLocation);
    return selectedLocation?.locationname;
  }
  // This method is called to show a success snackbar with the given message
  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['mat-mdc-snack-bar-container-green'],
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listSlp.filter((item) => {
      item.slp = String(item.slp);
      return item.slp.toLowerCase().includes(filterValue);
    });
  }

  // Function to fetch labels from the JSON file
  fetchLabels(): void {
    this.http.get<any>('assets/labels.json').subscribe((data) => {
      this.Requiredfield = data.labels[0].Requiredfield;
      this.Location = data.labels[0].Location;
      this.Save = data.labels[0].Save;
      this.NoSLP = data.labels[0].NoSLP;
      this.SearchSLP = data.labels[0].SearchSLP;
      this.SLPData = data.labels[0].SLPData;
      this.FieldError = data.error[0].FieldError;
      this.Locationrequired = data.error[0].Locationrequired;
      this.SLPrequired = data.error[0].SLPrequired;
    });
  }
  isSubmitted: boolean = false;

  onSubmit() {
    this.isSubmitted = true;
    if (this.shippingForm.invalid) {
      this.errorMessage = this.FieldError;
      return;
    }
    const currentDate = new Date();

    const lastupdated = currentDate.toISOString();

    //console.log(this.shippingForm.value);
    let shippingDetails = {
      slp: this.shippingForm.value.slp,
      uomid: null,
      fromid: null,
      fromname: null,
      toid: null,
      toname: null,
      carrier: null,
      appointmentid: null,
      trackingid: null,
      temperaturereq: 'false',
      wmsid: 'gtaa',
      createdby: '',
      deliverytype: 'inbound',
      wmsstatus: 'Received',
      locationid: null,
      rewarehouselocationid: this.shippingForm.value.rewarehouselocationid,
      scanlocation: '',
      locationname: '',
      receivetime: null,
      createdon: '',
      lastupdated: lastupdated,
    };

    this.scanlabelService.postRewarehouseDeatil(shippingDetails).subscribe(
      (response: any) => {
        // console.log('scanlabelService :', response);
        this.successMessage = `Location updated successfully SLP# ${response.slp} `;
        this.errorMessage = '';
        this.showSuccessSnackbar(this.successMessage);
        this.responseLabel = response.slp;
        this.cdr.detectChanges();
        this.isSubmitted = false;
        this.clearForm();

        // this.shippingForm.get('slp').setValue('');
      },
      (error: any) => {
        this.errorMessage = 'Error updating details. Please try again';
        this.successMessage = '';
      }
    );
  }
  clearForm() {
    this.shipForm.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
