import { GeocodingApiResponse, GeocodingResult, WeatherData } from '../types/weather';

export class WeatherApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Searches for a city using Open-Meteo Geocoding API.
 * Endpoint: https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
 */
export async function searchCityGeocoding(city: string): Promise<GeocodingResult | null> {
  const query = city.trim();
  if (!query) {
    throw new WeatherApiError('Please enter a city name to search.');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new WeatherApiError(`Geocoding service unavailable (HTTP ${response.status})`, response.status);
    }

    const data: GeocodingApiResponse = await response.json();
    if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return null;
    }

    return data.results[0];
  } catch (err: unknown) {
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError(`Unable to complete search for "${query}". Please check your internet connection.`);
  }
}

/**
 * Fetches current weather and forecast from Open-Meteo Weather API.
 * Endpoint: https://api.open-meteo.com/v1/forecast
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weathercode',
      'weather_code',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: timezone || 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new WeatherApiError(`Weather service error (HTTP ${response.status})`, response.status);
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError('Failed to retrieve meteorological data. Please try again.');
  }
}

/**
 * Composite search: geocodes city name then fetches weather in sequence.
 */
export async function fetchCityWeather(cityName: string): Promise<{
  city: GeocodingResult;
  weather: WeatherData;
}> {
  const cityResult = await searchCityGeocoding(cityName);
  if (!cityResult) {
    throw new WeatherApiError(`No location found matching "${cityName}". Try checking the spelling or specifying a country.`);
  }

  const weatherData = await fetchWeatherData(
    cityResult.latitude,
    cityResult.longitude,
    cityResult.timezone || 'auto'
  );

  return {
    city: cityResult,
    weather: weatherData,
  };
}
