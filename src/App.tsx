import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherRecommendations } from './components/WeatherRecommendations';
import { HourlyTrendChart } from './components/HourlyTrendChart';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { DailyForecast } from './components/DailyForecast';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { GeocodingResult, TemperatureUnit, WeatherData } from './types/weather';
import {
  searchCityGeocoding,
  fetchWeatherData,
  WeatherApiError,
} from './services/weatherApi';
import { CloudRain, Globe, Sparkles, MapPinOff } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState<GeocodingResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Primary workflow:
   * 1. Query Open-Meteo Geocoding API (count=1)
   * 2. Query Open-Meteo Weather API with coordinates
   */
  const handleSearchCity = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Geocoding API
      const geoResult = await searchCityGeocoding(cityName);
      if (!geoResult) {
        throw new WeatherApiError(
          `City not found: No location matching "${cityName}". Please check the spelling or try another city.`
        );
      }

      // Step 2: Forecast API with coordinates
      const weatherResult = await fetchWeatherData(
        geoResult.latitude,
        geoResult.longitude,
        geoResult.timezone || 'auto'
      );

      setCity(geoResult);
      setWeather(weatherResult);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(`City not found: Could not retrieve weather observations for "${cityName}".`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Geolocation support: gets user's coordinates and queries Open-Meteo
   */
  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setIsLoading(true);
          const weatherResult = await fetchWeatherData(latitude, longitude, 'auto');

          // Synthesize geocoding result with rounded coordinates
          const localCity: GeocodingResult = {
            id: 0,
            name: 'Local Coordinate',
            admin1: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
            country: 'Current Geolocation',
            latitude,
            longitude,
            timezone: weatherResult.timezone,
          };

          setCity(localCity);
          setWeather(weatherResult);
          setLastUpdated(new Date());
        } catch (err: unknown) {
          if (err instanceof WeatherApiError) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('Failed to fetch weather for your current position.');
          }
        } finally {
          setIsLoading(false);
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not access device location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access permission was denied in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Timed out while requesting current location.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  /**
   * Refresh current active city/weather
   */
  const handleRefresh = useCallback(() => {
    if (city) {
      handleSearchCity(city.name);
    } else {
      handleSearchCity('San Francisco');
    }
  }, [city, handleSearchCity]);

  // Initial load: Default to London / San Francisco for instant rich dashboard
  useEffect(() => {
    handleSearchCity('San Francisco');
  }, [handleSearchCity]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onUseLocation={handleUseLocation}
        onRefresh={handleRefresh}
        isLocating={isLocating}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Bar at the Top */}
        <section aria-label="City Search">
          <SearchBar
            onSearch={handleSearchCity}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            currentCityName={city?.name}
          />
        </section>

        {/* Dynamic Display Area */}
        {isLoading && !weather ? (
          <LoadingSkeleton />
        ) : city && weather ? (
          <div className="space-y-6">
            {/* Primary Current Weather Card */}
            <section aria-label="Current Observations">
              <CurrentWeatherCard city={city} weather={weather} unit={unit} />
            </section>

            {/* Weather Intelligence & Contextual Recommendations */}
            <section aria-label="Weather Intelligence & Recommendations">
              <WeatherRecommendations
                current={weather.current}
                daily={weather.daily}
                unit={unit}
              />
            </section>

            {/* First: Hourly Trend Section with Responsive Line Chart */}
            {weather.hourly && (
              <section aria-label="Hourly Trend">
                <HourlyTrendChart
                  hourly={weather.hourly}
                  unit={unit}
                  currentTimeIso={weather.current.time}
                />
              </section>
            )}

            {/* Second: 7-Day Forecast Section (list / grid of upcoming days, high/low, conditions) */}
            {weather.daily && (
              <section aria-label="7-Day Forecast">
                <DailyForecast daily={weather.daily} unit={unit} />
              </section>
            )}

            {/* Hourly Quick Snapshot */}
            {weather.hourly && (
              <section aria-label="Hourly Conditions Snapshot">
                <HourlyForecast
                  hourly={weather.hourly}
                  unit={unit}
                  currentTimeIso={weather.current.time}
                />
              </section>
            )}

            {/* Detailed Meteorological Metrics Grid */}
            <section aria-label="Meteorological Metrics">
              <WeatherMetricsGrid weather={weather} unit={unit} />
            </section>
          </div>
        ) : (
          /* Empty or Error state if no weather loaded */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 mx-auto flex items-center justify-center">
              {errorMessage ? (
                <MapPinOff className="w-6 h-6 text-rose-400" />
              ) : (
                <Globe className="w-6 h-6 text-cyan-400" />
              )}
            </div>
            <h2 className="text-lg font-bold text-white">
              {errorMessage ? 'City not found' : 'No City Loaded'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {errorMessage ||
                'Type a city name in the search bar above or choose a quick city to view real-time atmospheric intelligence.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => handleSearchCity('London')}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Try London
              </button>
              <button
                onClick={() => handleSearchCity('Tokyo')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors"
              >
                Try Tokyo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weather Intelligence Platform</span>
            <span aria-hidden="true">·</span>
            <span>WMO-Compliant Meteorological Indexing</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Data: Open-Meteo Free Weather API</span>
            <span aria-hidden="true">·</span>
            <span>Non-commercial Open Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
