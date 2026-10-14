import React from 'react';
import {
  Sun,
  Sunset,
  Sunrise,
  Compass,
  ShieldAlert,
  Droplet,
  ArrowUpRight,
} from 'lucide-react';
import { TemperatureUnit, WeatherData } from '../types/weather';
import {
  getUVRating,
  getHumidityRating,
  getPressureRating,
  getWindDirection,
} from '../utils/weatherCodes';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  weather,
  unit,
}) => {
  const current = weather.current;
  const daily = weather.daily;

  const uvInfo = getUVRating(current.uv_index);
  const humidityAssess = getHumidityRating(current.relative_humidity_2m);
  const pressureAssess = getPressureRating(current.surface_pressure);
  const windDir = getWindDirection(current.wind_direction_10m);

  // Sunrise and Sunset times for today
  const sunriseRaw = daily?.sunrise?.[0];
  const sunsetRaw = daily?.sunset?.[0];

  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString.split('T')[1]?.slice(0, 5) || '--:--';
    }
  };

  const sunriseFormatted = formatSunTime(sunriseRaw);
  const sunsetFormatted = formatSunTime(sunsetRaw);

  // Approximate daylight progress percentage if we have sunrise and sunset
  let daylightPercentage = 50;
  if (sunriseRaw && sunsetRaw) {
    try {
      const sunriseTime = new Date(sunriseRaw).getTime();
      const sunsetTime = new Date(sunsetRaw).getTime();
      const currentTime = new Date(current.time).getTime();
      if (currentTime <= sunriseTime) {
        daylightPercentage = 0;
      } else if (currentTime >= sunsetTime) {
        daylightPercentage = 100;
      } else {
        daylightPercentage = Math.round(
          ((currentTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100
        );
      }
    } catch {
      daylightPercentage = current.is_day ? 55 : 0;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. UV Index */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            UV Index
          </span>
          <span className={`font-semibold font-mono ${uvInfo.color}`}>
            {uvInfo.label}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {current.uv_index.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 11+ scale</span>
          </div>

          {/* UV Meter Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 via-rose-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (current.uv_index / 11) * 100))}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {uvInfo.risk}
        </p>
      </div>

      {/* 2. Wind Direction & Dynamics */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            Wind Orientation
          </span>
          <span className="font-mono text-cyan-400 font-semibold">
            {windDir.compass} ({windDir.degrees}°)
          </span>
        </div>

        <div className="my-2 flex items-center gap-4">
          {/* Compass circle */}
          <div className="w-14 h-14 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center relative shadow-inner">
            <span className="absolute top-1 text-[9px] text-slate-500 font-bold">N</span>
            <span className="absolute bottom-1 text-[9px] text-slate-500 font-bold">S</span>
            <span className="absolute left-1 text-[9px] text-slate-500 font-bold">W</span>
            <span className="absolute right-1 text-[9px] text-slate-500 font-bold">E</span>
            <div
              className="w-8 h-8 flex items-center justify-center text-cyan-400 transition-transform duration-700"
              style={{ transform: `rotate(${windDir.degrees}deg)` }}
            >
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {current.wind_speed_10m} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
            <span className="text-xs text-slate-400">
              Blowing toward {windDir.compass}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          10-meter atmospheric boundary layer observation.
        </p>
      </div>

      {/* 3. Solar Horizon & Daylight */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-400" />
            Sun & Solar Cycle
          </span>
          <span className="font-mono text-amber-400">
            {current.is_day ? 'Daylight' : 'Night'}
          </span>
        </div>

        <div className="my-2 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Sunrise</span>
                <span className="font-bold text-white font-mono tabular-nums">{sunriseFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Sunset</span>
                <span className="font-bold text-white font-mono tabular-nums">{sunsetFormatted}</span>
              </div>
            </div>
          </div>

          {/* Daylight arc / progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${daylightPercentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {current.is_day
            ? `${daylightPercentage}% of diurnal sunlight cycle elapsed`
            : 'Sun is currently below the celestial horizon'}
        </p>
      </div>

      {/* 4. Atmospheric Moisture & Dew Point */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-sky-400" />
            Moisture Profile
          </span>
          <span className="font-semibold text-sky-400">
            {humidityAssess.label}
          </span>
        </div>

        <div className="my-2">
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {current.relative_humidity_2m}%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {humidityAssess.desc}
          </p>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between font-mono">
          <span>Precipitation:</span>
          <span className="text-slate-200">{current.precipitation} mm</span>
        </div>
      </div>

      {/* 5. Barometric Pressure */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            Atmospheric Pressure
          </span>
          <span className="font-mono text-indigo-300">
            {pressureAssess.label}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {Math.round(current.surface_pressure)}
            </span>
            <span className="text-xs text-slate-400">hPa</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {pressureAssess.desc}
          </p>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between font-mono">
          <span>Sea-level equivalent:</span>
          <span className="text-slate-200">~{Math.round(current.surface_pressure + 5)} hPa</span>
        </div>
      </div>

      {/* 6. Elevation & Geospatial Metrics */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            Geospatial Reference
          </span>
          <span className="font-mono text-emerald-400">
            WGS84 Model
          </span>
        </div>

        <div className="my-2 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Terrain Elevation:</span>
            <span className="font-mono text-white font-semibold">{weather.elevation} meters</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Timezone Offset:</span>
            <span className="font-mono text-white font-semibold">
              UTC {weather.utc_offset_seconds >= 0 ? '+' : ''}
              {weather.utc_offset_seconds / 3600} hrs
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Calibrated using Open-Meteo European & GFS numerical weather models.
        </p>
      </div>
    </div>
  );
};
