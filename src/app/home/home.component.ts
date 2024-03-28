import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DataService } from '../data.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //Component Lifecycle Hooks
  refreshComponent: boolean = false;
  dataSource!: MatTableDataSource<any>;
  Inventory: any;
  Scan: any;
  Labelinformation: any;
  home: any;
  //Component Constructor
  constructor(private dataService: DataService, private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchLabels();
  }
  // Function to refresh data in the tab
  tabClick(changeEvent: MatTabChangeEvent) {
    this.refreshComponent = false;
    if (changeEvent.index) {
      setTimeout(() => {
        this.refreshComponent = true;
      }, 100);
    }
  }
  // Function to fetch labels from the JSON file
  fetchLabels(): void {
    this.http.get<any>('assets/labels.json').subscribe((data) => {
      this.Inventory = data.labels[0].Inventory;
      this.Scan = data.labels[0].Scan;
      this.Labelinformation = data.labels[0].Labelinformation;
      this.home = data.labels[0].home;
    });
  }
}
