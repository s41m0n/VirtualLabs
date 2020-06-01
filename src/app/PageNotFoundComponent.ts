import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-not-found',
  template: `
    <h2>
      404 - Not Found
    </h2>
  `
})
export class PageNotFoundComponent {
  path: string;
  constructor(private route: ActivatedRoute) {}
}