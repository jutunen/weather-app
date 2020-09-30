import { Component, OnInit } from "@angular/core";
import { RestService } from "../rest.service";
import { StateService } from "../state.service";
import { WeatherData } from "../dailyweather";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit {
  location: string; //ngIf
  data: WeatherData[] = [];
  dataLoaded: boolean = false; //ngIf
  dataIsIntact: boolean = false;

  constructor(
    private restService: RestService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.location$.subscribe((location) =>
      this.getServerData(location)
    );
    this.stateService.weatherData$.subscribe((data) => (this.data = data));
  }

  addNew(): void {
    this.stateService.newRow();
  }

  orderLines(): void {
    this.stateService.sortRows();
  }

  getServerData(location: string): void {
    if (location) {
      this.dataLoaded = false;
      this.stateService.showSpinner(true);
      this.location = location;
      this.restService.getLocationData(location).subscribe((data) => {
        this.stateService.showSpinner(false);
        this.stateService.setData(data);
        this.stateService.sortRows();
        this.stateService.setDataAsIntact();
        this.dataLoaded = true;
      });
    } else {
      this.data = [];
      this.location = location;
    }
  }
}
