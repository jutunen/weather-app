import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  formatDate(date: string): string {
    let [day,month,year] = date.split('.');
    day = this._zeroFill(Number(day));
    month = this._zeroFill(Number(month));
    return day + '.' + month + '.' + year;
  }

  temperatureIsValid(temp: any): boolean {
    if(!this._is_numeric(temp) || temp < -70 || temp > 70) {
      return false
    }
    return true;
  }

  valueIsValid(value: any): boolean {
    if(!this._is_numeric(value) || value < 0 || value > 50) {
      return false
    }
    return true;
  }

  dateIsValid(date: string): boolean {

    let day, month, year;

    if(typeof date === 'undefined') {
      return false;
    }

    let value = date.match(/^\s*(\d{1,2})\.(\d{1,2})\.(\d\d\d\d)\s*$/);
    if(value === null) {
      return false;
    } else {
      day = Number(value[1])
      month = Number(value[2])
      year = Number(value[3])
      if (!this._dateIsValid(day, month, year)) {
        return false;
      }
    }

    return true;
  }

  _dateIsValid(day: number, month: number, year: number): boolean {
    if (month < 1 || month > 12) {
      return false
    }
    let last_day_of_month = this._daysInMonth(month, year)
    if (day < 1 || day > last_day_of_month) {
      return false
    }
    return true
  }

  _isItLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
  }

  _daysInMonth(month: number, year: number): number {
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
      return 31
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      return 30
    } else if (month === 2 && this._isItLeapYear(year)) {
      return 29
    } else if (month === 2 && !(this._isItLeapYear(year))) {
      return 28
    }
  }

  _zeroFill(i: number): string {
    return (i < 10 ? '0' : '') + i;
  }

  _is_numeric(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
}
