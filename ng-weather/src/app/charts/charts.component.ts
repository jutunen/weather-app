import { Component, OnInit } from "@angular/core";
import { StateService } from "../state.service";
import { WeatherData } from "../dailyweather";
import { Chart, ChartOptions, ChartType, ChartDataSets } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Color, BaseChartDirective, Label } from "ng2-charts";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.css"],
})
export class ChartsComponent implements OnInit {
  data: WeatherData[] = [];

  singleDateChartSelected: string = "1";
  selectedDate: string = "";
  selectedDate_1: string = "";
  selectedDate_2: string = "";
  dates: string[];

  public barChartOptions: ChartOptions = {
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 20,
        bottom: 0,
      },
    },
    //legend: { labels: { fontSize: 6 }},
    animation: { duration: 0 },
    title: { fontSize: 20 },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ ticks: { fontSize: 16 } }],
      yAxes: [{ ticks: { beginAtZero: true, fontSize: 16 } }],
    },
    plugins: {
      datalabels: {
        offset: -6,
        color: "black",
        anchor: "end",
        align: "top",
        font: { size: 16 },
      },
    },
  };
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
  public lineChartOptions: ChartOptions = {
    legend: { labels: { fontSize: 16 } },
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    {
      // red
      backgroundColor: "rgba(255,0,0,0.7)",
      borderColor: "red",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // green
      backgroundColor: "rgba(0,255,0,0.7)",
      borderColor: "green",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // blue
      backgroundColor: "rgba(0,0,255,0.7)",
      borderColor: "blue",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];

  public lineChartLegend = true;
  public lineChartType: ChartType = "line";

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.weatherData$.subscribe((data) => {
      this.data = data;
      this.getDates();
    });
    this.stateService.location$.subscribe((location) => {
      this.selectedDate = "";
      this.selectedDate_1 = "";
      this.selectedDate_2 = "";
      this.lineChartData = [];
      this.barChartData = [];
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
      .sort(this.dateArraySorter);

    this.dates = this.data.map((obj) => obj.date);

    if (this.dates.length === 0) {
      this.lineChartData = [];
      this.barChartData = [];
      return;
    }

    if (
      this.dates.length > 1 &&
      this.selectedDate_1 === "" &&
      this.selectedDate_2 === ""
    ) {
      this.selectedDate_1 = this.dates[0];
      this.selectedDate_2 = this.dates[this.dates.length - 1];
    }

    if (this.dates.length > 0 && this.selectedDate === "") {
      this.selectedDate = this.dates[0];
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
      !this.dates.find((date) => date === this.selectedDate_1) ||
      !this.dates.find((date) => date === this.selectedDate_2)
    ) {
      this.lineChartData = [];
      return;
    }

    if (this.selectedDate_1 && this.selectedDate_2) {
      let data = this.getDateSpanData(this.selectedDate_1, this.selectedDate_2);
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
    if (!this.dates.find((date) => date === this.selectedDate)) {
      this.barChartData = [];
      return;
    }

    if (this.selectedDate) {
      let data = this.data.find((obj) => obj.date === this.selectedDate);
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

  // FIXME: duplicate function in state.service.ts
  dateArraySorter(a: any, b: any): number {
    let dToI = (date) => {
      let [day, month, year] = date.split(".");
      return Number(year + month + day);
    };
    if (dToI(a.date) > dToI(b.date)) {
      return 1;
    }
    if (dToI(a.date) < dToI(b.date)) {
      return -1;
    }
    return 0;
  }
}
