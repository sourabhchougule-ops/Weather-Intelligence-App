import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  Gauge,
  SunMedium,
  Compass,
} from 'lucide-react';
import { GeocodingResult, TemperatureUnit, WeatherData } from '../types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherCondition,
  getWindDirection,
  getHumidityRating,
} from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: GeocodingResult;
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  weather,
  unit,
}) => {
  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const windInfo = formatWindSpeed(current.wind_speed_10m, unit);
  const windDir = getWindDirection(current.wind_direction_10m);
  const humidityAssess = getHumidityRating(current.relative_humidity_2m);

  // Today's high & low from daily forecast
  const todayMax = weather.daily?.temperature_2m_max?.[0];
  const todayMin = weather.daily?.temperature_2m_min?.[0];

  // Dynamic atmospheric gradient tint based on weather category and day/night
  const getAtmosphericGradients = () => {
    if (!current.is_day) {
      return 'from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-indigo-900/40 shadow-indigo-950/30';
    }
    switch (condition.category) {
      case 'clear':
        return 'from-amber-950/30 via-slate-900/80 to-blue-950/30 border-amber-500/20 shadow-amber-950/20';
      case 'rain':
      case 'drizzle':
        return 'from-cyan-950/40 via-slate-900/90 to-blue-950/40 border-cyan-800/30 shadow-cyan-950/20';
      case 'storm':
        return 'from-purple-950/40 via-slate-900/90 to-indigo-950/40 border-purple-800/30 shadow-purple-950/20';
      case 'snow':
        return 'from-cyan-950/30 via-slate-900/90 to-slate-900/90 border-cyan-700/30 shadow-cyan-950/20';
      case 'cloudy':
      case 'fog':
      default:
        return 'from-slate-900/90 via-slate-900/80 to-slate-950/90 border-slate-800/60 shadow-slate-950/30';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 ${getAtmosphericGradients()}`}
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Left Column: City & Condition Overview */}
        <div className="space-y-4">
          {/* Location details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>{weather.timezone}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {city.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              {city.admin1 && <span>{city.admin1}</span>}
              {city.admin1 && city.country && <span aria-hidden="true">·</span>}
              {city.country && <span className="text-slate-300 font-medium">{city.country}</span>}
            </div>
          </div>

          {/* Condition banner & description */}
          <div className="flex items-center gap-3 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-inner">
              <WeatherIcon iconName={condition.iconName} className="w-8 h-8" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <span>{condition.label}</span>
                {!current.is_day && (
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
                    Night
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                {condition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Temperature & Core Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end md:items-end justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800/80 pt-6 md:pt-0">
          {/* Temperature Big Display */}
          <div className="text-left md:text-right">
            <div className="flex items-baseline md:justify-end gap-1">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                {formatTemperature(current.temperature_2m, unit)}
              </span>
            </div>

            <div className="flex items-center md:justify-end gap-3 text-xs text-slate-400 mt-1 font-mono tabular-nums">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                Feels like {formatTemperature(current.apparent_temperature, unit)}
              </span>
              {todayMax !== undefined && todayMin !== undefined && (
                <>
                  <span className="text-slate-700" aria-hidden="true">·</span>
                  <span>H: {formatTemperature(todayMax, unit)}</span>
                  <span>L: {formatTemperature(todayMin, unit)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar for Required Metrics: Temperature, Condition, Humidity, Wind Speed */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/40">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Humidity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                {current.relative_humidity_2m}%
              </span>
              <span className="text-[11px] text-slate-400 truncate hidden xl:inline">
                ({humidityAssess.label})
              </span>
            </div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Wind Speed</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                {windInfo.value}
              </span>
              <span className="text-xs text-slate-400">{windInfo.unitStr}</span>
              <span className="text-[11px] text-cyan-400 font-mono">
                {windDir.compass}
              </span>
            </div>
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Air Pressure</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                {Math.round(current.surface_pressure)}
              </span>
              <span className="text-xs text-slate-400">hPa</span>
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Precipitation</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                {current.precipitation}
              </span>
              <span className="text-xs text-slate-400">mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
