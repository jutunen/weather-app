import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DailyWeather, WeatherData } from './dailyweather';

@Injectable({
  providedIn: 'root'
})

export class RestService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getLocUrl = 'http://127.0.0.1:5000/location/all';
  addLocUrl = 'http://127.0.0.1:5000/location/new';
  delLocUrl = 'http://127.0.0.1:5000/location/';
  getDataUrl = 'http://127.0.0.1:5000/data/';
  addDataUrl = 'http://127.0.0.1:5000/data/save';
/*
  getLocUrl = 'https://jussin.site/wthr/location/all';
  addLocUrl = 'https://jussin.site/wthr/location/new';
  delLocUrl = 'https://jussin.site/wthr/location/';
  getDataUrl = 'https://jussin.site/wthr/data/';
  addDataUrl = 'https://jussin.site/wthr/data/save';
*/
  getLocations(): Observable<[]> {
    return this.http.get<[]>(this.getLocUrl).pipe(
      catchError(this.handleError<[]>('Paikkakuntien haku', []))
    );
  }

  addLocation(location: string): Observable<string> {

    let params = {location:location};

    return this.http.post<string>(this.addLocUrl, params, this.httpOptions).pipe(
      catchError(this.handleError<string>('Paikkakunnan lisäys', "" ))
    );
  }

  deleteLocation(location: string): Observable<string> {
    return this.http.delete<string>(this.delLocUrl + location, this.httpOptions).pipe(
      catchError(this.handleError<string>('Paikkakunnan poisto', ""))
    );
  }

  getData(location: string): Observable<[]> {
    return this.http.get<[]>(this.getDataUrl + location).pipe(
      catchError(this.handleError<[]>('Säätietojen haku', []))
    );
  }

  addData(location: string, data: WeatherData[]): Observable<string> {
    return this.http.post<string>(this.addDataUrl, {location:location, data: data}, this.httpOptions).pipe(
      catchError(this.handleError<string>('Tietojen tallennus', ""))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //console.error(error); // log to console instead
      //console.log(`${operation} failed: ${error.message}`);
      alert(`${operation} epäonnistui. Yritä myöhemmin uudelleen.`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
