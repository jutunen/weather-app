import { Component, OnInit } from "@angular/core";
import { RestService } from "../rest.service";
import { StateService } from "../state.service";
import { DailyWeather, WeatherData } from "../dailyweather";

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
  allDatesAreValid: boolean = false;

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
    this.stateService.allDatesAreValid$.subscribe(
      (state) => (this.allDatesAreValid = state)
    );
  }

  getLocations(): void {
    this.stateService.showSpinner(true);
    this.restService.getLocations().subscribe((locations) => {
      this.locations = locations;
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
      this.locations.push(name);
      this.locations = [...new Set(this.locations)];
      this.stateService.setLocation(name);
      this.stateService.showSpinner(false);
    });
  }

  saveAll(event): void {
    let keylessData = this.data.map((obj) => ({
      rainfall: Number(obj.rainfall),
      date: obj.date,
      wind_speed: Number(obj.wind_speed),
      temperature: Number(obj.temperature),
    }));

    this.stateService.showSpinner(true);

    this.restService
      .saveAll(this.selectedLocation, (keylessData as unknown) as WeatherData[])
      .subscribe((response) => {
        this.stateService.showSpinner(false);
        if (event) {
          this.stateService.setLocation(event.target.value);
        }
      });
  }

  deleteLocation(name: string): void {
    this.stateService.showSpinner(true);
    this.restService.deleteLocation(name).subscribe((val) => {
      this.locations = this.locations.filter((loc) => loc !== name);
      this.stateService.setData([]);
      this.stateService.setLocation("");
      this.stateService.showSpinner(false);
    });
  }

  /*
  onLocationChange(): void {
    console.log("onLocationChange: " + this.selectedLocation);
    // TODO: saveAll first
    this.stateService.setLocation(this.selectedLocation);
  }
*/
}
