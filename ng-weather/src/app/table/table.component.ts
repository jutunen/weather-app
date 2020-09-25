import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { StateService } from '../state.service';
import { WeatherData } from '../dailyweather';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {

  location: string;
  data: WeatherData[] = [];
  allDatesAreValid: boolean = false;
  dataLoaded: boolean = false;
  order_tt: string = 'Järjestää rivit päivämäärän mukaan.';
  order_tt_disabled: string = 'Järjestäminen on mahdollista vain jos kaikki päivämäärät ovat virheettömiä. Korjaa "punaiset" päivämäärät.';
  tt_opt = {
    'placement': 'bottom',
    'show-delay': 300
  };

  constructor(private restService: RestService, private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.location$.subscribe(location => this.getServerData(location));
    this.stateService.weatherData$.subscribe(data => this.data = data);
    this.stateService.allDatesAreValid$.subscribe(state => this.allDatesAreValid = state);
  }

  addNew(): void {
    this.stateService.newRow();
  }

  orderLines(): void {
    this.stateService.sortRows();
  }

  getServerData(location: string): void {
    console.log("location: " + location);
    if(location) {
      this.dataLoaded = false;
      this.stateService.showSpinner(true);
      this.location = location;
      this.restService.getData(location)
          .subscribe(data => {
            this.stateService.showSpinner(false);
            this.stateService.setData(data);
            this.stateService.sortRows();
            this.dataLoaded = true;
          });
    } else {
      this.data = [];
      this.location = location;
    }
  };
}
