import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <h2>
      Home
    </h2>
  `
})
export class HomeComponent implements OnInit {
  path: string;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
  }
}