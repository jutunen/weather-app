import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WeatherData } from "./dailyweather";
import { ValidationService } from "./validation.service";

@Injectable({
  providedIn: "root",
})
export class StateService {
  duplicates: string[] = [];

  private readonly _location = new BehaviorSubject<string>("");
  readonly location$ = this._location.asObservable();

  private readonly _weatherData = new BehaviorSubject<WeatherData[]>([]);
  readonly weatherData$ = this._weatherData.asObservable();

  private readonly _allDatesAreValid = new BehaviorSubject<boolean>(true);
  readonly allDatesAreValid$ = this._allDatesAreValid.asObservable();

  private readonly _spinnerIsVisible = new BehaviorSubject<boolean>(false);
  readonly spinnerIsVisible$ = this._spinnerIsVisible.asObservable();

  constructor(private validationSrvc: ValidationService) {}

  setLocation(location: string): void {
    this._location.next(location);
  }

  showSpinner(param: boolean): void {
    if (param) {
      this._spinnerIsVisible.next(true);
    } else {
      this._spinnerIsVisible.next(false);
    }
  }

  private _setData(data: WeatherData[]): void {
    this._assignKeys(data);
    this._validateData(data);
    this._checkDatesValidity(data);
    this._weatherData.next(data);
  }

  private _checkDatesValidity(data: WeatherData[]): void {
    let invalidDates = data.filter(
      (obj) => obj.valid_date === false || obj.uniq_date === false
    );
    if (invalidDates.length > 0) {
      this._allDatesAreValid.next(false);
    } else {
      this._allDatesAreValid.next(true);
    }
  }

  setData(data: []): void {
    this._setData(data);
  }

  sortRows(): void {
    let current: WeatherData[] = this._weatherData.getValue();
    current.sort(this.dateArraySorter);
    this._setData(current);
  }

  newRow(): void {
    let current: WeatherData[];
    current = this._weatherData.getValue();
    let newObj = <WeatherData>{
      date: "",
      rainfall: 0,
      temperature: 0,
      wind_speed: 0,
      valid_date: false,
      valid_temperature: true,
      valid_rainfall: true,
      valid_wind_speed: true,
      uniq_date: true,
    };
    current.unshift(newObj);
    this._setData(current);
  }

  updateRow(row: WeatherData): void {
    let current: WeatherData[];
    current = this._weatherData.getValue();
    current = current.map((obj) => {
      return obj.key === row.key ? row : obj;
    });
    this._setData(current);
  }

  removeRow(key: number): void {
    let current: WeatherData[];
    current = this._weatherData.getValue();
    current = current.filter((obj) => obj.key !== key);
    this._setData(current);
  }

  private _assignKeys(data: WeatherData[]) {
    for (let index = 0; index < data.length; index++) {
      data[index].key = index;
    }
  }

  private _validateData(data: WeatherData[]) {
    for (let index = 0; index < data.length; index++) {
      this._validateRow(data[index]);
    }

    let valid_dates = data
      .filter((obj) => obj.valid_date === true)
      .map((obj) => obj.date);
    let findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) != index);
    this.duplicates = [...new Set(findDuplicates(valid_dates))] as string[];

    if (this.duplicates.length > 0) {
      for (let index = 0; index < data.length; index++) {
        this._validateDateUniqueness(data[index]);
      }
    }
  }

  private _validateDateUniqueness(data: WeatherData) {
    if (this.duplicates.includes(data.date)) {
      data.uniq_date = false;
    }
  }

  private _validateRow(data: WeatherData) {
    data.uniq_date = true;

    if (this.validationSrvc.dateIsValid(data.date)) {
      data.valid_date = true;
      data.date = this.validationSrvc.formatDate(data.date);
    } else {
      data.valid_date = false;
    }

    if (this.validationSrvc.temperatureIsValid(data.temperature)) {
      data.valid_temperature = true;
    } else {
      data.valid_temperature = false;
    }

    if (this.validationSrvc.valueIsValid(data.rainfall)) {
      data.valid_rainfall = true;
    } else {
      data.valid_rainfall = false;
    }

    if (this.validationSrvc.valueIsValid(data.wind_speed)) {
      data.valid_wind_speed = true;
    } else {
      data.valid_wind_speed = false;
    }
  }

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
