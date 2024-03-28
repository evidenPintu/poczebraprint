import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Data } from '@angular/router';

@Component({
  selector: 'app-labelinfo',
  templateUrl: './labelinfo.component.html',
  styleUrls: ['./labelinfo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class LabelinfoComponent implements OnInit {
  // Define displayed columns for the table
  displayedColumns: string[] = [
    'slp',
    'fromname',
    'toname',
    'uom',
    'carrier',
    'locationname',
    'createdby',
    'wmsstatus',
    'receivetime',
    'deliverytype',
    'lastupdated',
  ];
  // Define dataSource for the table
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'actions'];
  expandedElement: any | null;
  // Define ViewChild for sorting and pagination
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  // Define variables for labels and data
  FromName: any;
  EnterFromName: any;
  ToName: any;
  EnterToName: any;
  Carrier: any;
  Location: any;
  DeliveryTypes: any;
  Status: any;
  Receivingtime: any;
  CreatedBy: any;
  LastUpdated: any;
  SLPData: any;
  UOMData: any;
  Nodata: any;
  initiatedScanForm: boolean = false;
  editRowdata: any;
  loading: boolean = false;
  selectedRow: any = 0;
  //Component Constructor
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private http: HttpClient //HTTP request to fetch the JSON file
  ) {}
  //Component Lifecycle Hooks
  ngOnInit(): void {
    // Call getAllData and fetchLabels functions on component initialization
    this.getAllData();
    this.fetchLabels();
    // loader true
    this.loading = true;
  }
  // Function to get all data for the table
  getAllData(): void {
    this.dataService.getAllItems().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      //add loader false
      this.loading = false;
    });
  }
  onRowClick(element: any | null, event: any, index: any) {
    this.selectedRow = index;
    if (this.expandedElement == null || this.expandedElement != element) {
      //console.log(element);
      this.initiatedScanForm = false;
      this.editRowdata = element;
      setTimeout(() => {
        this.initiatedScanForm = true;
      }, 100);
    }
    this.expandedElement = this.expandedElement === element ? null : element;
    event.stopPropagation();
  }
  // Function to refresh data in the table
  refreshData(): void {
    this.dataService.getData().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  // Function to delete an item from the table
  deleteItem(item: any) {
    const snackBarRef = this.snackBar.open(
      `Are you sure you want to delete this SLP? : ${item.slp}`,
      'Delete',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['mat-mdc-snack-bar-container'],
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.dataService.deleteItem(item).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((i) => i !== item);
      });
    });
  }
  // Function to apply filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //
  closeFormEditFun(element: any, event: any) {
    if (event == 'Submit') {
      //loader for true
      this.loading = true;
      this.getAllData();
    }
    // console.log(element, event);
    //this.getAllData();
    this.expandedElement = this.expandedElement === element ? null : element;
    //event.stopPropagation();
  }

  // Function to fetch labels from the JSON file
  fetchLabels(): void {
    this.http.get<any>('assets/labels.json').subscribe((data) => {
      this.UOMData = data.labels[0].UOMData;
      this.FromName = data.labels[0].FromName;
      this.EnterFromName = data.labels[0].EnterFromName;
      this.ToName = data.labels[0].ToName;
      this.EnterToName = data.labels[0].EnterToName;
      this.Carrier = data.labels[0].Carrier;
      this.Location = data.labels[0].Location;
      this.DeliveryTypes = data.labels[0].DeliveryTypes;
      this.Status = data.labels[0].Status;
      this.Receivingtime = data.labels[0].Receivingtime;
      this.CreatedBy = data.labels[0].CreatedBy;
      this.LastUpdated = data.labels[0].LastUpdated;
      this.SLPData = data.labels[0].SLPData;
      this.Nodata = data.error[0].Nodata;
    });
  }
}
