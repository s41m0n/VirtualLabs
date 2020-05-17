import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

import { Student } from './shared/models/student.model';
import { STUDENTS_DB } from './shared/mocks/mock-student'; 

import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'ai20-lab04';
  dataSource = new MatTableDataSource<Student>(STUDENTS_DB.slice(0, Math.ceil(STUDENTS_DB.length/2)));
  selection = new SelectionModel<Student>(true, []);
  colsToDisplay = ["select", "id", "name", "firstName"];
  filteringOptions: Student[] = STUDENTS_DB;
  addStudentControl = new FormControl();
  studentToAdd: Student;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  /** Setting properties after ng containers are initialized */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() : boolean{
    return this.dataSource.data.length === this.selection.selected.length;
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
    if(!this.selection.selected.length) {
      alert('There are not student selected');
      return;
    }
    this.dataSource.data = this.dataSource.data.filter( el => !this.selection.selected.includes( el ));
    this.selection.clear();
    alert('Successfully deleted student(s)');
  }

  /** Function to toggle the sidebar */
  toggleSidebar() {
    console.log('Toggle sidenav');
    this.sidenav.toggle();
  }

  /** Function to add Student to Course */
  fireAddStudent() {
    if(!this.studentToAdd) {
      alert('No student selected');
      return;
    }
    if(this.dataSource.data.find(s => s.id === this.studentToAdd.id)) {
      alert(`Student ${this.studentToAdd.id} already in course`);
      return;
    }
    this.dataSource.data = this.dataSource.data.concat(STUDENTS_DB.find(s => s.id === this.studentToAdd.id));
    alert(`Successfully added student ${this.studentToAdd.id}`);
  }

  /** Function to set the Student to add */
  setSelectedStudentToAdd(student: Student) {
    this.studentToAdd = student;
  }

  /** Function to set the displayed student value (only the id) */
  displayOption(student: Student) : string {
    return student? student.id : '';
  }

  /** My FormControl filter */
  filter() {
    console.log('Filtering');
    const filterValue = this.addStudentControl.value.toLowerCase();
    this.filteringOptions = STUDENTS_DB.filter(s => s.id.toLowerCase().includes(filterValue));
  }
}

