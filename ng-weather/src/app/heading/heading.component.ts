import { Component, OnInit } from '@angular/core';
import { StateService } from '../state.service';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  location: string = "";

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.stateService.location$.subscribe(location => this.location = location);
  }

}
