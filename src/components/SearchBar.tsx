import React, { useState } from 'react';
import { Search, X, Loader2, AlertCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  currentCityName?: string;
}

const POPULAR_CITIES = [
  'Tokyo',
  'London',
  'New York',
  'Paris',
  'Singapore',
  'Sydney',
  'Berlin',
  'Dubai',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  errorMessage,
  onClearError,
  currentCityName,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClearError();
    onSearch(query.trim());
  };

  const handleSelectQuickCity = (city: string) => {
    setQuery(city);
    onClearError();
    onSearch(city);
  };

  const handleClear = () => {
    setQuery('');
    onClearError();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMessage) onClearError();
            }}
            placeholder="Search any city (e.g. Tokyo, London, Zurich, San Francisco)..."
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner disabled:opacity-70"
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-cyan-500/20 whitespace-nowrap flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>

      {/* Popular Quick Suggestions */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 shrink-0 font-medium">Quick Select:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {POPULAR_CITIES.map((city) => {
            const isActive = currentCityName?.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => handleSelectQuickCity(city)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-lg transition-colors border text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80 font-medium'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-200 text-xs shadow-lg backdrop-blur-sm transition-all"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <span className="font-bold text-rose-300 text-sm block">
              City not found
            </span>
            <p className="text-slate-300 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-200 p-1 rounded-lg hover:bg-rose-900/40 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
