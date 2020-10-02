import { Color } from "ng2-charts";
import { ChartOptions } from "chart.js";

export interface WeatherData {
  key: number,
  temperature: number,
  rainfall: number,
  wind_speed: number,
  date: string,
  valid_date: boolean,
  valid_temperature: boolean,
  valid_rainfall: boolean,
  valid_wind_speed: boolean,
  uniq_date: boolean,
  empty_date: boolean
}

export interface SelectedDates {
  Date: string,
  Date_1: string,
  Date_2: string
}

export const NETWORK_ERROR: string = "network_error";

export const LINECHART_COLORS: Color[] = [
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

export const BARCHART_OPTIONS: ChartOptions = {
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

export const LINECHART_OPTIONS: ChartOptions = {
  legend: { labels: { fontSize: 16 } },
  animation: { duration: 0 },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{}],
    yAxes: [
      {
        id: "y-axis-0",
        position: "left",
      },
    ],
  },
};
