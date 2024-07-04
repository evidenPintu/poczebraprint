import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import '../assets/js/BrowserPrint-3.1.250.min'

declare var BrowserPrint: any
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'POC ZEBRA PRINT';

  selectedPrinter :any = null;

  constructor() {
    if(BrowserPrint!= undefined){
      console.log(JSON.stringify(new BrowserPrint.ApplicationConfiguration()))
   // this.initPrinter()
      this. getAvaialblePrinter()
    }
  }

  private initPrinter() {
    try {
      console.log('calling   initPrinter()' )
      BrowserPrint.getDefaultDevice("printer", (device: any) => {
        console.log(`default selected device ... ${JSON.stringify(device)}`)
        if (device != undefined) {
          console.log(`selected device ===: name :${device.name} \n type: ${device.deviceType} \n connection :${device.connection}`)
          this.selectedPrinter = device;
        } else {
          console.log(` error in getting default selected printer ... ${device} \n trying to find available printers.`)
          this.getAvaialblePrinter()
        }
      }, (errorMsg: any) => { console.error("error in getting default printer" + errorMsg) })

    } catch {
      console.error(`Error in initialising broser print and getting default printer...`)
      console.log(JSON.stringify(new BrowserPrint.ApplicationConfiguration()))
    }
  }

  private getAvaialblePrinter() {
    try {
      console.log("calling... getAvaialblePrinter()");
      BrowserPrint.getLocalDevices((deviceList: any) => {
        if (deviceList != undefined && deviceList.length > 0) {
          console.log("avaialble devices" + JSON.stringify(deviceList));
          for (var i = 0; i < deviceList.length; i++) {
            if (!deviceList[i] != undefined && deviceList[i].deviceType.toLocaleLowerCase().indexOf("printer") != -1) {
              console.log(`selected device ===: name :${deviceList[i].name} \n type: ${deviceList[i].deviceType} \n connection :${deviceList[i].connection}`)
              this.selectedPrinter = deviceList[i];
              return;
            }
          }
          console.error('Printing no availbe, please check deconnected device properly.');
        } else {
          console.error('No device connected to initiate printing, please check deconnected device properly.');
        }
      }, (error: any) => {
        console.error(`Error getting available devices, please restart connected device...\n ${error}`);
      })
    } catch {
      console.error(`Error in finding avaialble printers,try again...`)
      console.log(JSON.stringify(new BrowserPrint.ApplicationConfiguration()))
    }
  }

  print(dataToWrite: string) {
    console.log("Reqest for printing...")
   if (this.selectedPrinter != null) {
      this.selectedPrinter.send(dataToWrite, (successMsg: any) => {
        console.log("lable printed successfully.  " + JSON.stringify(successMsg));
      }, (err: any) =>
        console.error("error in printing lable.  " + err)
      )
    } else {
      this.initPrinter()
    }
  }


  // private setSelectedDevice(device: any): boolean {
  //   if (!device != undefined && device.deviceType.toLocaleLowerCase().indexOf("printer") != -1) {
  //     console.log(`selected device ===: name :${device.name} \n type: ${device.deviceType} \n connection :${device.connection}`)
  //     this.selectedPrinter = device;
  //     return true;
  //   }
  //   return false;
  // }

  //   }, function(){alert("Error getting local devices")},"printer");

  //   }

  //   successPrintList(prnterList: any) {
  //     console.log(`printer list== ${prnterList}`)

  //     try {
  //       default_printer = printer;
  //       if ((printer != null) && (printer.connection != undefined)) {
  //         selected_printer = printer;
  //         jslog("Found Zebra printer: " + printer.name + " connected via: " + printer.connection);
  //         // Check if printing is triggered from the form or the list view
  //         if (sysIds.length > 0) {
  //           for (var i = 0; i < sysIds.length; i++) {
  //             var ga = new GlideAjax('AdvaniaUtils');
  //             ga.addParam('sysparm_name','ajaxClientDataHandler');
  //             ga.addParam('sysparm_tablename','alm_asset'); // Table name
  //             ga.addParam('sysparm_sysid', sysIds[i]); // Sysid
  //             ga.addParam('sysparm_fieldnames','model,serial_number'); // Field names we want to retrieve
  //             ga.getXML(userCallback);
  //           }
  //         }
  //         else {
  //           printLabel(g_form.getDisplayValue('model'), g_form.getValue('serial_number'));
  //         }

  //       }
  //       else {
  //         alert("No default Zebra printer is configured. Please right-click on Zebra Browser Print icon in system tray and set a default Zebra printer.");
  //       }

  //     }
  //     catch(err) {
  //       jslog('A JavaScript runtime error occurred: ' + err.message);
  //     }
  //   }

  handleError(error: any) {
    console.log(error)
  }
}
