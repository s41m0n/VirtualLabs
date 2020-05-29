import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

import { Student } from '../../shared/models/student.model';

import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements AfterViewInit, OnInit{

  @Input() studentsDB : Student[];
  @Input() enrolledStudents : Student[];
  dataSource : MatTableDataSource<Student>;
  selection = new SelectionModel<Student>(true, []);
  colsToDisplay = ["select", "id", "name", "firstName", "team"];
  filteredOptions: Observable<Student[]>;
  addStudentControl = new FormControl();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _snackBar : MatSnackBar) {}

  /** Setting filter to autocomplete */
  ngOnInit() {
    this.dataSource = new MatTableDataSource<Student>(this.enrolledStudents);
    this.filteredOptions = this.addStudentControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.id),
      map(id => id ? this._filter(id) : this.studentsDB.slice())
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
      this.enrolledStudents = this.enrolledStudents.filter( student => !this.selection.selected.includes( student ));
      this.dataSource.data = this.enrolledStudents;
      this._showMsg(`😃 Successfully deleted student${this.selection.selected.length > 1 ? 's' : ` ${this.displayFn(this.selection.selected[0])}`}`);
      this.selection.clear();
    }
  }

  /** Function to add Student to Course */
  addStudent() {
    const studentToAdd = this.addStudentControl.value;
    this.addStudentControl.setValue('');
    if(!studentToAdd) {
      return;
    }
    if(typeof studentToAdd === 'string') {
      this._showMsg("⛔ Please select one student between the options");
      return;
    }
    if(this.enrolledStudents.find(s => s.id === studentToAdd.id)) {
      this._showMsg(`⛔ Student ${this.displayFn(studentToAdd)} already in course`);
      return;
    }
    this.enrolledStudents = this.enrolledStudents.concat(studentToAdd);
    this.dataSource.data = this.enrolledStudents;
    this._showMsg(`😃 Successfully added student ${this.displayFn(studentToAdd)}`);
  }

  /** Function to set the value displayed in input and mat-options */
  displayFn(student: Student): string{
    return student? `${student.name} ${student.firstName} (${student.id})` : '';
  }

  /** My FormControl filter */
  private _filter(value: string): Student[] {
    const filterValue = value.toLowerCase();
    return this.studentsDB.filter(s => s.firstName.toLowerCase().includes(filterValue));
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
