import { Component, OnInit } from "@angular/core";
import { StateService } from "../state.service";
import {
  WeatherData,
  LINECHART_COLORS,
  BARCHART_OPTIONS,
  LINECHART_OPTIONS,
  SelectedDates
} from "../dailyweather";
import { Chart, ChartOptions, ChartType, ChartDataSets } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Color, BaseChartDirective, Label } from "ng2-charts";
import { Pipe, PipeTransform } from "@angular/core";
import '@vanillawc/wc-arrow'

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.css"],
})
export class ChartsComponent implements OnInit {
  data: WeatherData[] = [];

  singleDateChartSelected: string = "1";
  dates: string[];
  location: string = "";

  selected = <SelectedDates>{
    Date: "", // single date
    Date_1: "", // date span first
    Date_2: "" // date span second
  };

  public barChartOptions: ChartOptions = BARCHART_OPTIONS;
  public barChartLabels: Label[] = [
    "lämpötila \u00B0C",
    "sademäärä mm/vrk",
    "tuulen nopeus m/s",
  ];
  public barChartType: ChartType = "bar";
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = LINECHART_OPTIONS;
  public lineChartColors: Color[] = LINECHART_COLORS;
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.weatherData$.subscribe((data) => {
      this.data = data;
      this.getDates();
    });
    this.stateService.location$.subscribe((location) => {
      this.selected.Date = "";
      this.selected.Date_1 = "";
      this.selected.Date_2 = "";
      this.lineChartData = [];
      this.barChartData = [];
      this.location = location;
      this.data = [];
    });
  }

  getDates(): void {
    this.data = this.data
      .filter(
        (obj) =>
          obj.valid_date === true &&
          obj.valid_temperature === true &&
          obj.valid_rainfall === true &&
          obj.valid_wind_speed === true &&
          obj.uniq_date === true
      )
      .sort(this.stateService.dateArraySorter);

    this.dates = this.data.map((obj) => obj.date);

    if (this.dates.length === 0) {
      this.lineChartData = [];
      this.barChartData = [];
      return;
    }

    if (
      this.dates.length > 1 &&
      this.selected.Date_1 === "" &&
      this.selected.Date_2 === ""
    ) {
      this.selected.Date_1 = this.dates[0];
      this.selected.Date_2 = this.dates[this.dates.length - 1];
    }

    if (this.dates.length > 0 && this.selected.Date === "") {
      this.selected.Date = this.dates[0];
    }

    if (this.singleDateChartSelected) {
      this.lineChartData = []; //hide linechart;
      this.onSingleDateChange();
    } else {
      //multi date chart selected
      this.barChartData = []; //hide barchart
      this.onDateSpanChange();
    }
  }

  onRadioChange(): void {
    if (this.singleDateChartSelected) {
      this.lineChartData = [];
      this.onSingleDateChange();
    } else {
      this.barChartData = [];
      this.onDateSpanChange();
    }
  }

  onDateSpanChange(): void {
    if (
      !this.dates.find((date) => date === this.selected.Date_1) ||
      !this.dates.find((date) => date === this.selected.Date_2)
    ) {
      this.lineChartData = [];
      return;
    }

    if (this.selected.Date_1 && this.selected.Date_2) {
      let data = this.getDateSpanData(this.selected.Date_1, this.selected.Date_2);
      this.setLineChart(data);
      this.singleDateChartSelected = "";
      this.barChartData = [];
    } else {
      this.lineChartData = [];
    }
  }

  setLineChart(data): void {
    let temperatureData = data.map((obj) => obj.temperature);
    let rainfallData = data.map((obj) => obj.rainfall);
    let windSpeedData = data.map((obj) => obj.wind_speed);
    this.lineChartData = [
      { data: temperatureData, label: "Lämpötila \u00B0C", fill: false },
      { data: rainfallData, label: "Sademäärä mm/vrk", fill: false },
      { data: windSpeedData, label: "Tuulen nopeus m/s", fill: false },
    ];
    this.lineChartLabels = data.map((obj) => obj.date);
  }

  getDateSpanData(date_1: string, date_2: string) {
    let [first, second] =
      this.dToI(date_1) < this.dToI(date_2)
        ? [date_1, date_2]
        : [date_2, date_1];
    return this.data.filter((obj) => {
      if (
        this.dToI(obj.date) >= this.dToI(first) &&
        this.dToI(obj.date) <= this.dToI(second)
      ) {
        return true;
      }
    });
  }

  onSingleDateChange(): void {
    if (!this.dates.find((date) => date === this.selected.Date)) {
      this.barChartData = [];
      return;
    }

    if (this.selected.Date) {
      let data = this.data.find((obj) => obj.date === this.selected.Date);
      this.setChart(data);
      this.singleDateChartSelected = "1";
      this.lineChartData = [];
    }
  }

  setChart(data): void {
    this.barChartData = [
      {
        data: [data.temperature, data.rainfall, data.wind_speed],
        label: data.date,
        backgroundColor: [
          "rgba(255,0,0,0.7)",
          "rgba(0,255,0,0.7)",
          "rgba(0,0,255,0.7)",
        ],
      },
    ];
  }

  // date to integer
  dToI(date: string): number {
    let [day, month, year] = date.split(".");
    return Number(year + month + day);
  }

  prevDate(param): void {
    if(this.selected[param]) {
      let currentIndex = this.dates.indexOf(this.selected[param]);
      if(currentIndex > 0) {
        this.selected[param] = this.dates[--currentIndex];
        if(param === 'Date') {
          this.onSingleDateChange();
        } else {
          this.onDateSpanChange();
        }
      }
    }
  }

  nextDate(param): void {
    if(this.selected[param]) {
      let currentIndex = this.dates.indexOf(this.selected[param]);
      if(currentIndex < 0) { return };
      if(currentIndex < this.dates.length - 1) {
        this.selected[param] = this.dates[++currentIndex];
        if(param === 'Date') {
          this.onSingleDateChange();
        } else {
          this.onDateSpanChange();
        }
      }
    }
  }
}

@Pipe({ name: "formatDate" })
export class FormatDatePipe implements PipeTransform {
  transform(date: string): string {
    if (!date) { return ""; }
    let [day, month, year] = date.split(".");
    return Number(day) + "." + Number(month) + "." + year;
  }
}
