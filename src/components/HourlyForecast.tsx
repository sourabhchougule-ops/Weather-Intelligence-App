import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Droplets } from 'lucide-react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { formatTemperature, getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly?: HourlyWeather;
  unit: TemperatureUnit;
  currentTimeIso: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  unit,
  currentTimeIso,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Find the index closest to current hour to display the next 24 hours
  let startIndex = 0;
  if (currentTimeIso) {
    const currentHourStr = currentTimeIso.slice(0, 13); // "YYYY-MM-DDTHH"
    const found = hourly.time.findIndex((t) => t.startsWith(currentHourStr));
    if (found !== -1) {
      startIndex = found;
    }
  }

  // Slice 24 hours ahead
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const temp = hourly.temperature_2m[actualIdx];
    const code = (hourly.weathercode?.[actualIdx] ?? hourly.weather_code?.[actualIdx]) ?? 0;
    const precipProb = hourly.precipitation_probability?.[actualIdx] ?? 0;

    const date = new Date(timeStr);
    const hourNum = date.getHours();
    const isDay = hourNum >= 6 && hourNum < 20 ? 1 : 0;
    const condition = getWeatherCondition(code, isDay);

    const isCurrent = idx === 0;

    return {
      timeStr,
      label: isCurrent ? 'Now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp,
      code,
      condition,
      precipProb,
      isCurrent,
    };
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>24-Hour Atmospheric Outlook</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-850 rounded-lg border border-slate-700/50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-850 rounded-lg border border-slate-700/50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scroll-smooth"
      >
        {next24Hours.map((hour, idx) => (
          <div
            key={hour.timeStr + idx}
            className={`shrink-0 flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all w-22 text-center ${
              hour.isCurrent
                ? 'bg-cyan-950/40 border-cyan-800/60 shadow-md shadow-cyan-950/30'
                : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60'
            }`}
          >
            <span
              className={`text-xs font-mono font-medium ${
                hour.isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              {hour.label}
            </span>

            <div className="my-2.5">
              <WeatherIcon iconName={hour.condition.iconName} className="w-6 h-6" />
            </div>

            <span className="text-sm font-bold text-white font-mono tabular-nums">
              {formatTemperature(hour.temp, unit)}
            </span>

            {/* Precipitation chance */}
            <div className="flex items-center gap-0.5 mt-2 text-[10px] text-sky-400 font-mono">
              <Droplets className="w-2.5 h-2.5" />
              <span>{hour.precipProb}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
