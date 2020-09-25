export interface DailyWeather {
  temperature: number,
  rainfall: number,
  wind_speed: number,
  location: string,
  date: string
}

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
  uniq_date: boolean
}
