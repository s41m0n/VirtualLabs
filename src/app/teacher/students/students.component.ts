import { Component, ViewChild, AfterViewInit, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, tap, first, takeUntil} from 'rxjs/operators';

import { Student } from '../../models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements AfterViewInit, OnInit, OnDestroy{

  dataSource = new MatTableDataSource<Student>();
  selection = new SelectionModel<Student>(true, []);
  colsToDisplay = ["select", "serial", "name", "firstName", "team"];
  addStudentControl = new FormControl();
  private destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() addStudentsEvent = new EventEmitter<Student[]>();
  @Output() removeStudentsEvent = new EventEmitter<Student[]>();
  @Output() searchStudentsEvent = new EventEmitter<string>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() filteredStudents : Observable<Student[]>;
  @Input() set enrolledStudents( students: Student[] ) {
    this.dataSource.data = students;
  }

  /** Setting filter to autocomplete */
  ngOnInit() {
    this.addStudentControl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged()
    ).subscribe((name: string) => this.searchStudentsEvent.emit(name));
  }

  /** Destroying subscription */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    if (!row) return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.serial}`;
  }

  /** Delete rows with checkbox selected */
  deleteSelected() {
    if(this.selection.selected.length) {
      this.removeStudentsEvent.emit(this.selection.selected);
      this.selection.clear();
    }
  }

  /** Function to emit addStudent to Course Event */
  addStudent() {
    this.addStudentsEvent.emit([this.addStudentControl.value]);
    this.addStudentControl.setValue('');
  }

  /** Function to set the value displayed in input and mat-options */
  displayFn(student: Student): string{
    return student? `${student.name} ${student.firstName} (${student.serial})` : '';
  }
}
