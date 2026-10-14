import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading meteorological data">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3">
            <div className="h-4 w-36 bg-slate-800 rounded-md" />
            <div className="h-10 w-64 bg-slate-800 rounded-lg" />
            <div className="h-4 w-48 bg-slate-800 rounded-md" />
            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-800 rounded-md" />
                <div className="h-3 w-48 bg-slate-800 rounded-md" />
              </div>
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <div className="h-16 w-36 bg-slate-800 rounded-xl md:ml-auto" />
            <div className="h-4 w-44 bg-slate-800 rounded-md md:ml-auto" />
          </div>
        </div>

        {/* Bottom 4 metric boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-950/60 rounded-xl p-3 border border-slate-800/60" />
          ))}
        </div>
      </div>

      {/* Recommendations Panel Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 space-y-4">
        <div className="h-5 w-64 bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-950/60 rounded-xl border border-slate-800/60 p-4 space-y-2" />
          ))}
        </div>
      </div>

      {/* Hourly Trend Chart Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-36 bg-slate-800 rounded-md" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-800 rounded-md" />
            <div className="h-6 w-20 bg-slate-800 rounded-md" />
          </div>
        </div>
        <div className="h-64 sm:h-72 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-end p-4 gap-2">
          {[40, 55, 60, 75, 80, 85, 70, 65, 50, 45, 40, 48].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-slate-800/60 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 space-y-3">
        <div className="h-5 w-40 bg-slate-800 rounded-md" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center justify-between px-4"
            >
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-4 w-32 bg-slate-800 rounded" />
              <div className="h-4 w-20 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
