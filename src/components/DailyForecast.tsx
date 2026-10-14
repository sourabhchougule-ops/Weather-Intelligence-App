import React, { useState } from 'react';
import { Calendar, LayoutGrid, List } from 'lucide-react';
import { DailyWeather, TemperatureUnit } from '../types/weather';
import { formatTemperature, getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily?: DailyWeather;
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate global min and max across all 7 days to scale the temperature bars proportionally
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              7-Day Forecast
            </h2>
            <p className="text-xs text-slate-400">
              Synoptic outlook with diurnal temperature spectrum
            </p>
          </div>
        </div>

        {/* View mode toggle (List vs Grid) */}
        <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="List View"
            aria-label="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.time.slice(0, 7).map((dateStr, idx) => {
            const date = new Date(dateStr + 'T00:00:00');
            const isToday = idx === 0;
            const dayName = isToday
              ? 'Today'
              : date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            // Support both weathercode and weather_code
            const code = (daily.weathercode?.[idx] ?? daily.weather_code?.[idx]) ?? 0;
            const condition = getWeatherCondition(code, 1);
            const minTemp = daily.temperature_2m_min[idx];
            const maxTemp = daily.temperature_2m_max[idx];

            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all text-center ${
                  isToday
                    ? 'bg-cyan-950/30 border-cyan-800/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      isToday ? 'text-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    {dayName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {monthDay}
                  </span>
                </div>

                <div className="my-3">
                  <WeatherIcon
                    iconName={condition.iconName}
                    className="w-7 h-7 mx-auto"
                  />
                  <span className="text-[11px] text-slate-300 font-medium line-clamp-1 mt-1 block">
                    {condition.label}
                  </span>
                </div>

                <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 font-mono text-xs tabular-nums">
                  <span className="text-white font-bold">
                    {formatTemperature(maxTemp, unit)}
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">
                    {formatTemperature(minTemp, unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View with visual spectrum bars */
        <div className="space-y-2">
          {daily.time.slice(0, 7).map((dateStr, idx) => {
            const date = new Date(dateStr + 'T00:00:00');
            const isToday = idx === 0;
            const dayName = isToday
              ? 'Today'
              : date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            // Support both weathercode and weather_code
            const code = (daily.weathercode?.[idx] ?? daily.weather_code?.[idx]) ?? 0;
            const condition = getWeatherCondition(code, 1);
            const minTemp = daily.temperature_2m_min[idx];
            const maxTemp = daily.temperature_2m_max[idx];

            // Calculate bar offsets relative to weekly scale
            const leftPercent = ((minTemp - globalMin) / totalRange) * 100;
            const widthPercent = Math.max(10, ((maxTemp - minTemp) / totalRange) * 100);

            return (
              <div
                key={dateStr}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors text-xs sm:text-sm ${
                  isToday
                    ? 'bg-cyan-950/20 border-cyan-800/50'
                    : 'bg-slate-950/40 hover:bg-slate-950/70 border-slate-800/50'
                }`}
              >
                {/* Day & Date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <span
                    className={`font-semibold block ${
                      isToday ? 'text-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    {dayName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {monthDay}
                  </span>
                </div>

                {/* Condition Icon & Text */}
                <div className="flex items-center gap-2 w-36 sm:w-44 shrink-0">
                  <WeatherIcon
                    iconName={condition.iconName}
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="text-slate-300 text-xs truncate">
                    {condition.label}
                  </span>
                </div>

                {/* Desktop Visual Spectrum Bar */}
                <div className="flex-1 hidden md:flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 w-9 text-right tabular-nums">
                    {formatTemperature(minTemp, unit)}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-white font-bold w-9 tabular-nums">
                    {formatTemperature(maxTemp, unit)}
                  </span>
                </div>

                {/* Mobile High / Low Display */}
                <div className="md:hidden flex items-center gap-2 font-mono tabular-nums text-right shrink-0">
                  <span className="text-white font-bold text-xs">
                    {formatTemperature(maxTemp, unit)}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400 text-xs">
                    {formatTemperature(minTemp, unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
