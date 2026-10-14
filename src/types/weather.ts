export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentUnits {
  time?: string;
  interval?: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day?: string;
  precipitation: string;
  weather_code?: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  surface_pressure: string;
  uv_index: string;
}

export interface CurrentWeather {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  surface_pressure: number;
  uv_index: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code?: number[];
  weathercode?: number[];
  precipitation_probability?: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code?: number[];
  weathercode?: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise?: string[];
  sunset?: string[];
  uv_index_max?: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation: number;
  current_units: CurrentUnits;
  current: CurrentWeather;
  hourly?: HourlyWeather;
  daily?: DailyWeather;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
}
