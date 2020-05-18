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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  filteredOptions: Observable<Student[]>;
  addStudentControl = new FormControl();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _snackBar : MatSnackBar) {}

  /** Setting filter to autocomplete */
  ngOnInit() {
    this.filteredOptions = this.addStudentControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.id),
      map(id => id ? this._filter(id) : STUDENTS_DB.slice())
    );
  }

  /** Setting properties after ng containers are initialized */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() : boolean{
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Student): string {
    if (!row)
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /** Delete rows with checkbox selected */
  deleteSelected() {
    if(this.selection.selected.length) {
      this.dataSource.data = this.dataSource.data.filter( student => !this.selection.selected.includes( student ));
      this.selection.clear();
      this._showMsg("Successfully deleted student(s)");
    }
  }

  /** Function to add Student to Course */
  addStudent() {
    const studentToAdd = this.addStudentControl.value;

    if(!studentToAdd || typeof studentToAdd === 'string') {
      this._showMsg("Please select one student between the options");
      return;
    }
    if(this.dataSource.data.find(s => s.id === studentToAdd.id)) {
      this._showMsg(`Student ${studentToAdd.id} already in course`);
      return;
    }
    this.dataSource.data = this.dataSource.data.concat(studentToAdd);
    this.addStudentControl.setValue('');
    this._showMsg(`Successfully added student ${studentToAdd.id}`);
  }

  /** Function to set the value displayed in mat-options */
  displayFn(student: Student): string{
    return student? student.id : '';
  }

  /** My FormControl filter */
  private _filter(value: string): Student[] {
    const filterValue = value.toLowerCase();
    return STUDENTS_DB.filter(s => s.id.toLowerCase().includes(filterValue));
  }

  /** Function to show status message after actions */
  private _showMsg(message : string, ) {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    })
  }
}

