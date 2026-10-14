import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, ArrowDown, ArrowUp, Thermometer } from 'lucide-react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import {
  formatTemperature,
  formatTemperatureValue,
  getWeatherCondition,
} from '../utils/weatherCodes';

interface HourlyTrendChartProps {
  hourly?: HourlyWeather;
  unit: TemperatureUnit;
  currentTimeIso: string;
}

interface ChartDataPoint {
  time: string;
  hourOnly: string;
  temp: number;
  rawTemp: number;
  conditionLabel: string;
  isNow: boolean;
}

export const HourlyTrendChart: React.FC<HourlyTrendChartProps> = ({
  hourly,
  unit,
  currentTimeIso,
}) => {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!hourly || !hourly.time || hourly.time.length === 0) return [];

    let startIndex = 0;
    if (currentTimeIso) {
      const currentHourPrefix = currentTimeIso.slice(0, 13);
      const idx = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
      if (idx !== -1) startIndex = idx;
    }

    return hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
      const actualIdx = startIndex + idx;
      const rawTemp = hourly.temperature_2m[actualIdx] ?? 0;
      const code = (hourly.weathercode?.[actualIdx] ?? hourly.weather_code?.[actualIdx]) ?? 0;
      const date = new Date(timeStr);
      const isDay = date.getHours() >= 6 && date.getHours() < 20 ? 1 : 0;
      const condition = getWeatherCondition(code, isDay);

      return {
        time: timeStr,
        hourOnly: idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp: formatTemperatureValue(rawTemp, unit),
        rawTemp,
        conditionLabel: condition.label,
        isNow: idx === 0,
      };
    });
  }, [hourly, unit, currentTimeIso]);

  if (chartData.length === 0) return null;

  // Temperature stats for next 24 hours
  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const startTemp = temps[0];
  const endTemp = temps[temps.length - 1];
  const delta = endTemp - startTemp;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 space-y-4">
      {/* Header with Title and Quick Range Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Hourly Trend
            </h2>
            <p className="text-xs text-slate-400">
              Next 24 hours temperature trajectory
            </p>
          </div>
        </div>

        {/* 24-Hour Summary Pills */}
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Min:</span>
            <span className="font-semibold text-white">{minTemp}°</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-400">Max:</span>
            <span className="font-semibold text-white">{maxTemp}°</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">24h Net:</span>
            <span className={`font-semibold ${delta >= 0 ? 'text-amber-400' : 'text-sky-400'}`}>
              {delta > 0 ? `+${delta}` : delta}°
            </span>
          </div>
        </div>
      </div>

      {/* Responsive Line / Area Chart */}
      <div className="w-full h-64 sm:h-72 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="temperatureFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="hourOnly"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval="preserveStartEnd"
              minTickGap={20}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[minTemp - 2, maxTemp + 2]}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                      <div className="flex items-center justify-between gap-3 text-slate-400 font-mono">
                        <span>{data.hourOnly}</span>
                        <span className="text-[10px] text-cyan-400">{data.isNow ? '(Current)' : ''}</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono tabular-nums">
                        {data.temp}°{unit === 'celsius' ? 'C' : 'F'}
                      </div>
                      <div className="text-slate-300 font-medium pt-0.5 border-t border-slate-800">
                        {data.conditionLabel}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#temperatureFill)"
              dot={(props) => {
                const { cx, cy, index, payload } = props;
                if (payload.isNow) {
                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#22d3ee"
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={0} />;
              }}
              activeDot={{
                r: 6,
                fill: '#38bdf8',
                stroke: '#082f49',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
