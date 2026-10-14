import React from 'react';
import { Compass, Locate, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onUseLocation: () => void;
  onRefresh: () => void;
  isLocating: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onUseLocation,
  onRefresh,
  isLocating,
  isLoading,
  lastUpdated,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Weather Intelligence
            </span>
          </div>
        </div>

        {/* Zone 2: Status / timestamp */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono tabular-nums">
            {lastUpdated ? (
              <>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
            ) : (
              'Synchronized'
            )}
          </span>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <span>Open-Meteo High-Resolution Models</span>
        </div>

        {/* Zone 3: Interactive controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Geolocation Button */}
          <button
            onClick={onUseLocation}
            disabled={isLocating || isLoading}
            title="Use current geolocation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Refresh observations"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Unit Toggle: Celsius / Fahrenheit */}
          <div className="flex items-center bg-slate-900 p-0.5 border border-slate-800 rounded-lg">
            <button
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                unit === 'celsius'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Display in Celsius"
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Display in Fahrenheit"
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
