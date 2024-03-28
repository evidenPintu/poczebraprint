import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ScanLabelService } from '../scan-label.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { jsPDF } from 'jspdf';
import { from } from 'rxjs';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-scanform',
  templateUrl: './scanform.component.html',
  styleUrls: ['./scanform.component.css'],
})
export class ScanformComponent implements OnInit {
  // Component properties and methods go here
  shippingDetails = {
    slp: '',
    uomid: '',
    fromid: null,
    fromname: '',
    toid: null,
    toname: '',
    carrier: '',
    appointmentid: null,
    trackingid: '',
    temperaturereq: 'false',
    wmsid: 'gtaa',
    createdby: '',
    deliverytype: 'Inbound',
    wmsstatus: 'Received',
    locationid: '',
    rewarehouselocationid: '',
    scanlocation: '',
    locationname: '',
    receivetime: '',
    createdon: '',
    lastupdated: '',
    units: '',
  };

  // @ViewChild('pdfTemplate') pdfTemplate!: ElementRef;

  // Define dataSource for the table
  @ViewChild('shippingForm') shippingForm!: NgForm;
  // Define variables for success and error messages
  successMessage = '';
  errorMessage = '';
  pdfTemplate = `
  <div class="pdf-template" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
width: 380px; margin: 20px; font-family: Arial, Helvetica, sans-serif;">



    <div class="border" style="border: 3px solid #212121; border-radius: 5px;padding: 20px;">
	  <div style="text-align: center;"> <img src="/assets/Logo.png" alt="Logo" /></div>
      <p style="text-align: center; font-weight: bold; color: #212121; font-size: 40px !important; margin: 25px 0 !important; ">{toname}</p>
      <p style="text-align: center ;font-weight: bold; color: #212121; font-size: 25px !important; margin: 25px 0 !important; ">SLP#: {slp}</p>
      <p style="text-align: center;">{barcode}</p>
      <p><strong>From name:</strong> {fromname}</p>
      <p><strong>Carrier:</strong> {carrier}</p>
      <p><strong>Receiving time:</strong> {receivetime}</p>
      <p><strong>UoM:</strong> {units} {uomid}</p>
      <p><strong>Temperature required: </strong> {temperaturereq}</p>
	  <div style="float: left; width: 150px;text-align: left; color:#212121 "><p><strong>Tracking id: </strong>{trackingid}</p></div>
	  <div style="float: left; width: 150px;text-align: right;color:#212121 "><p><strong>Appointment id: </strong> {appointmentid}</p></div>
           <div style="clear:both"></div>
      </div>
      
      


</div>
  `;

  // Define variables for labels and data
  UOMData: any;
  Case: any;
  Pallet: any;
  Temperaturereq: any;
  Yes: any;
  No: any;
  AppointmentID: any;
  EnterAppointmentID: any;
  TrackingID: any;
  EnterTrackingID: any;
  FormID: any;
  EnterFormID: any;
  FromName: any;
  EnterFromName: any;
  ToID: any;
  EnterToID: any;
  ToName: any;
  EnterToName: any;
  Carrier: any;
  EnterCarrier: any;
  ClearButton: any;
  ScanButton: any;
  UOMrequired: any;
  Temreqrequired: any;
  AppointmentIDrequired: any;
  Onlynumbers: any;
  TrackingIDrequired: any;
  FormIDrequired: any;
  FromNamerequired: any;
  ToIDrequired: any;
  ToNamerequired: any;
  Carrierrequired: any;
  FieldError: any;
  Slectoption: any;
  CreatedBy: any;
  Requiredfield: any;
  data: any;
  responseLabel: any;
  Receivingtime: any;
  listuom: any;
  unitrequired: any;
  Enterunit: any;
  unit: any;
  barcode = '';
  //Component Constructor
  constructor(
    private scanlabelService: ScanLabelService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.shippingDetails.createdby = this.authService.getUserId();
  }
  //Component Lifecycle Hooks
  ngOnInit(): void {
    this.fetchLabels();
    this.scanlabelService.getUom().subscribe((data) => {
      this.listuom = data;
    });
  }
  // Function to fetch labels from the JSON file
  fetchLabels(): void {
    this.http.get<any>('assets/labels.json').subscribe((data) => {
      this.UOMData = data.labels[0].UOMData;
      this.Case = data.labels[0].Case;
      this.Pallet = data.labels[0].Pallet;
      this.Temperaturereq = data.labels[0].Temperaturereq;
      this.Yes = data.labels[0].Yes;
      this.No = data.labels[0].No;
      this.AppointmentID = data.labels[0].AppointmentID;
      this.EnterAppointmentID = data.labels[0].EnterAppointmentID;
      this.TrackingID = data.labels[0].TrackingID;
      this.EnterTrackingID = data.labels[0].EnterTrackingID;
      this.FormID = data.labels[0].FormID;
      this.EnterFormID = data.labels[0].EnterFormID;
      this.FromName = data.labels[0].FromName;
      this.EnterFromName = data.labels[0].EnterFromName;
      this.ToID = data.labels[0].ToID;
      this.EnterToID = data.labels[0].EnterToID;
      this.ToName = data.labels[0].ToName;
      this.EnterToName = data.labels[0].EnterToName;
      this.Carrier = data.labels[0].Carrier;
      this.EnterCarrier = data.labels[0].EnterCarrier;
      this.ClearButton = data.labels[0].ClearButton;
      this.ScanButton = data.labels[0].ScanButton;
      this.Slectoption = data.labels[0].Slectoption;
      this.CreatedBy = data.labels[0].CreatedBy;
      this.Requiredfield = data.labels[0].Requiredfield;
      this.Receivingtime = data.labels[0].Receivingtime;
      this.unit = data.labels[0].unit;
      this.Enterunit = data.labels[0].Enterunit;

      this.UOMrequired = data.error[0].UOMrequired;
      this.Temreqrequired = data.error[0].Temreqrequired;
      this.AppointmentIDrequired = data.error[0].AppointmentIDrequired;
      this.Onlynumbers = data.error[0].Onlynumbers;
      this.TrackingIDrequired = data.error[0].TrackingIDrequired;
      this.FormIDrequired = data.error[0].FormIDrequired;
      this.FromNamerequired = data.error[0].FromNamerequired;
      this.ToIDrequired = data.error[0].ToIDrequired;
      this.ToNamerequired = data.error[0].ToNamerequired;
      this.Carrierrequired = data.error[0].Carrierrequired;
      this.FieldError = data.error[0].FieldError;
      this.unitrequired = data.error[0].unitrequired;
    });
  }
  // This function is called when the form is submitted
  submitForm() {
    // Get the current date and time
    const currentDate = new Date();
    const receiveTime = currentDate.toISOString();
    this.shippingDetails.receivetime = receiveTime;
    // If the form is invalid, it sets an error message and returns
    if (this.shippingForm.form.invalid) {
      this.errorMessage = this.FieldError;
      this.successMessage = '';

      return;
    }

    this.scanlabelService.postShippingDetails(this.shippingDetails).subscribe(
      (response: any) => {
        if (response && response.slp !== undefined) {
          this.successMessage = `Inventory label generated with SLP# ${response.slp}`;
          this.errorMessage = '';
          this.showSuccessSnackbar(this.successMessage);
          this.responseLabel = response.slp;
          this.cdr.detectChanges();
          this.generatePDF();
          //this.generateBarcode();
          this.clearForm();
        } else {
          this.errorMessage = '';
          this.successMessage = '';
        }
      },
      (error: any) => {
        this.errorMessage = 'Error submitting form. Please try again.';
        this.successMessage = '';
      }
    );
  }
  //
  // generateBarcode() {
  //   const canvas = document.createElement('canvas');
  //   JsBarcode('#barcode2', this.responseLabel, {
  //     format: 'pharmacode',
  //     lineColor: '#0aa',
  //     width: 4,
  //     height: 40,
  //     displayValue: true,
  //   });
  //   return canvas.toDataURL('image/png');
  // }
  generateBarcode() {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, this.responseLabel, {
      format: 'CODE39',
      lineColor: '#000',
      width: 2,
      height: 100,
      fontOptions: 'bold',
      fontSize: 12,
      displayValue: false,
    });
    return canvas.toDataURL('image/png');
  }
  generatePDF() {
    // this.generateBarcode();

    const filledTemplate = this.fillTemplatePlaceholders();
    const pdf = new jsPDF();
    //const pdfTemplate = this.pdfTemplate.nativeElement;
    // Use the stored response.label to create the PDF name
    const pdfName = `Inventory_SLP#${this.responseLabel}.pdf`;
    //

    pdf.html(filledTemplate, {
      callback: (pdf) => {
        //pdf.text(`Shipping Label - ${this.responseLabel}`, 20, 20); // Add the response label to the PDF
        pdf.autoPrint();
        const timeInterval = 5000;
        const timeIntervalsave = 4000;
        setTimeout(() => {
          // Print the PDF
          pdf.output('dataurlnewwindow');
        }, timeInterval);
        //window.open(pdf.output('bloburl'), '_blank');
        setTimeout(() => {
          // Print the PDF
          pdf.save(pdfName);
        }, timeIntervalsave);
      },
      html2canvas: {
        scale: 0.49,
        useCORS: true,
      },
    });
  }
  //

  //TemplatePlaceholders
  fillTemplatePlaceholders(): string {
    this.generateBarcode();
    const barcodeImage = this.generateBarcode();
    console.log('<img src="' + barcodeImage + '" id="barcode"/>');
    const barcodePlaceholder = '<img src="' + barcodeImage + '" id="barcode"/>';
    return (
      this.pdfTemplate
        .replace('{barcode}', barcodePlaceholder)
        //.replace('{barcode}', '')
        .replace('{slp}', this.responseLabel)
        .replace('{fromname}', this.shippingDetails.fromname)
        .replace('{uomid}', this.getUmoDesc(this.shippingDetails.uomid))
        .replace('{units}', this.shippingDetails.units)
        .replace('{toname}', this.shippingDetails.toname)
        .replace('{carrier}', this.shippingDetails.carrier)
        .replace('{receivetime}', this.shippingDetails.receivetime)
        .replace(
          '{temperaturereq}',
          this.shippingDetails.temperaturereq == 'true' ? 'Yes' : 'No'
        )
        .replace('{trackingid}', this.shippingDetails.trackingid)
        .replace('{appointmentid}', String(this.shippingDetails.appointmentid))
    );
  }

  getUmoDesc(id: any) {
    //console.log(this.listuom);
    let selecteduOm = this.listuom.find((x: any) => x.uomid == id);
    //console.log(selecteduOm);
    return selecteduOm?.uomdesc;
  }
  // This method is called to show a success snackbar with the given message
  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['mat-mdc-snack-bar-container-green'],
    });
  }
  // This method is called to clear the form
  clearForm() {
    this.shippingDetails = {
      slp: '',
      uomid: '',
      fromid: null,
      fromname: '',
      toid: null,
      toname: '',
      carrier: '',
      appointmentid: null,
      trackingid: '',
      temperaturereq: 'false',
      wmsid: 'gtaa',
      createdby: '',
      deliverytype: 'Inbound',
      wmsstatus: 'Received',
      locationid: '',
      rewarehouselocationid: '',
      scanlocation: '',
      locationname: '',
      receivetime: '',
      createdon: '',
      lastupdated: '',
      units: '',
    };
    // It resets the shippingDetails
    this.shippingForm.resetForm({
      temperaturereq: 'false',
    });

    this.successMessage = '';
    this.errorMessage = '';
  }
}
