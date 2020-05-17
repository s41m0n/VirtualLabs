import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

import { Student } from './shared/models/student.model';
import { STUDENTS_DB } from './shared/mocks/mock-student'; 

import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit{
  title = 'ai20-lab04';
  dataSource = new MatTableDataSource<Student>(STUDENTS_DB.slice(0, Math.ceil(STUDENTS_DB.length/2)));
  selection = new SelectionModel<Student>(true, []);
  colsToDisplay = ["select", "id", "name", "firstName"];
  filteredOptions: Observable<string[]>;
  addStudentControl = new FormControl();
  studentToAdd: string = '';
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** Setting filter to autocomplete */
  ngOnInit() {
    this.filteredOptions = this.addStudentControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  /** Setting properties after ng containers are initialized */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Student): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /** Delete rows with checkbox selected */
  deleteSelected() {
    if(this.selection.selected.length) {
      let newDataSource = this.dataSource.data.filter( el => !this.selection.selected.includes( el ));
      this.dataSource.data = newDataSource;
      //this.selection = new SelectionModel<Student>(true, []);
    }
  }

  /** Function to add Student to Course */
  fireAddStudent() {
    if(this.studentToAdd === '') {
      alert("No student selected");
      return;
    }
    if(this.dataSource.data.find(s => s.id === this.studentToAdd)) {
      alert(`Student ${this.studentToAdd} already in course`);
      return;
    }
    this.dataSource.data = this.dataSource.data.concat(STUDENTS_DB.find(s => s.id === this.studentToAdd));
    alert(`Successfully added student ${this.studentToAdd}`);
  }

  /** Function to set the Student to add */
  setSelectedStudentToAdd(student: string) {
    this.studentToAdd = student;
  }

  /** My FormControl filter */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return STUDENTS_DB.filter((option: { id: string; }) => option.id.toLowerCase().includes(filterValue)).map((option: { id: any; }) => option.id);
  }
}

