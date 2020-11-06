import { Component, OnInit, Input } from "@angular/core";
import { WeatherData } from "../dailyweather";
import { StateService } from "../state.service";
import '@vanillawc/wc-arrow'
import '@vanillawc/wc-datepicker'

@Component({
  selector: "app-table-row",
  templateUrl: "./table-row.component.html",
  styleUrls: ["./table-row.component.css"],
})
export class TableRowComponent implements OnInit {
  constructor(private stateService: StateService) {}

  del_button_hover: number = 0;
  calendar_icon: string = "&#128197;";
  datepicker_config = {
    firstDayOfWeek: "mo",
    locale: "fi",
    format: "DD.MM.YYYY",
  };
  temp_tooltip: string = "maksimiarvo:70 minimiarvo:-70";
  value_tooltip: string = "maksimiarvo:50 minimiarvo:0";
  remove_tooltip: string = "Poistaa rivin.";
  tt_opt = {
    placement: "bottom",
    "show-delay": 500,
  };

  ngOnInit(): void {}

  @Input() data: WeatherData;

  delete(): void {
    this.stateService.removeRow(this.data.key);
  }

  updateDatepickerDate(event): void {
    if (this.data.date !== event) {
      this.data.date = event;
      this.stateService.updateRow(this.data);
    }
  }

  updateDate(event): void {
    this.data.date = event.target.value;
    this.stateService.updateRow(this.data);
  }

  updateTemperature(event): void {
    this.data.temperature = event.target.value;
    this.stateService.updateRow(this.data);
  }

  updateWindSpeed(event): void {
    this.data.wind_speed = event.target.value;
    this.stateService.updateRow(this.data);
  }

  updateRainfall(event): void {
    this.data.rainfall = event.target.value;
    this.stateService.updateRow(this.data);
  }

  mouseover(): void {
    this.del_button_hover = 1;
  }

  mouseout(): void {
    this.del_button_hover = 0;
  }
}
