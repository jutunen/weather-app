import { Component, OnInit } from "@angular/core";
import { RestService } from "../rest.service";
import { StateService } from "../state.service";
import { WeatherData, NETWORK_ERROR } from "../dailyweather";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.css"],
})
export class LocationComponent implements OnInit {
  locations: string[];
  selectedLocation: string;
  spinnerIsVisible: boolean = false;
  data: WeatherData[] = [];
  dataIsIntact: boolean = false;

  constructor(
    private restService: RestService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.spinnerIsVisible$.subscribe(
      (visible) => (this.spinnerIsVisible = visible)
    );
    this.stateService.location$.subscribe(
      (location) => (this.selectedLocation = location)
    );
    this.getLocations();
    this.stateService.weatherData$.subscribe((data) => (this.data = data));
    this.stateService.dataIsIntact$.subscribe(
      (state) => (this.dataIsIntact = state)
    );
  }

  getLocations(): void {
    this.stateService.showSpinner(true);
    this.restService.getLocations().subscribe((locations) => {
      // must filter due to strange dotnet mongodb driver bug:
      this.locations = locations.filter((location) => location.length > 0);
      this.stateService.showSpinner(false);
      if (this.locations.length > 0) {
        this.stateService.setLocation(this.locations[0]);
      }
    });
  }

  addLocation(name: string): void {
    name = name.toUpperCase();
    name = name.trim();
    if (!name) {
      return;
    }
    this.stateService.showSpinner(true);
    this.restService.addLocation(name).subscribe((loc) => {
      this.stateService.showSpinner(false);
      if(loc === NETWORK_ERROR) {
        // POST operation failed
        return;
      }
      this.locations.push(name);
      this.locations = [...new Set(this.locations)];
      this.stateService.setLocation(name);
    });
  }

  // this handles also setLocation and addLocation functions:
  saveAll(selectedLocation: string, newLocation: string): void {
    if (this.dataIsIntact) {
      // there is nothing to be saved
      if (selectedLocation) {
        this.stateService.setLocation(selectedLocation);
      } else if (newLocation) {
        this.addLocation(newLocation);
      }
      return;
    }

    let strippedData = this.data.map((obj) => ({
      rainfall: Number(obj.rainfall),
      date: obj.date,
      wind_speed: Number(obj.wind_speed),
      temperature: Number(obj.temperature),
    }));

    this.stateService.showSpinner(true);

    this.restService
      .saveAll(this.selectedLocation, (strippedData as unknown) as WeatherData[])
      .subscribe((response) => {
        this.stateService.showSpinner(false);
        if(response !== NETWORK_ERROR) {
          this.stateService.setDataAsIntact();
        }
        if (selectedLocation) {
          this.stateService.setLocation(selectedLocation);
        } else if (newLocation) {
          this.addLocation(newLocation);
        }
      });
  }

  deleteLocation(name: string): void {
    this.stateService.showSpinner(true);
    this.restService.deleteLocation(name).subscribe((val) => {
      this.stateService.showSpinner(false);
      if(val === NETWORK_ERROR) {
        // DELETE operation failed
        return;
      }
      this.locations = this.locations.filter((loc) => loc !== name);
      this.stateService.setData([]);
      this.stateService.setLocation("");
    });
  }
}
