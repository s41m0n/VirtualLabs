import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <h2>
      404 - Not Found
    </h2>
  `
})
export class PageNotFoundComponent implements OnInit {
  path: string;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
  }
}