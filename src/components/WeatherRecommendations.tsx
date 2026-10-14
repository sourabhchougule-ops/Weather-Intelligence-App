import React from 'react';
import {
  Umbrella,
  Shirt,
  Car,
  HeartPulse,
  Sun,
  Wind,
  Snowflake,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { CurrentWeather, DailyWeather, TemperatureUnit } from '../types/weather';

interface WeatherRecommendationsProps {
  current: CurrentWeather;
  daily?: DailyWeather;
  unit: TemperatureUnit;
}

interface AdviceItem {
  id: string;
  category: 'Wardrobe & Gear' | 'Transit & Commute' | 'Outdoor Activities' | 'Health & Safety';
  headline: string;
  advice: string;
  icon: React.ReactNode;
  level: 'info' | 'caution' | 'alert' | 'optimal';
}

export const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({
  current,
  daily,
  unit,
}) => {
  const temp = current.temperature_2m; // In Celsius
  const wind = current.wind_speed_10m; // In km/h
  const precip = current.precipitation; // In mm
  const code = current.weather_code;
  const uv = current.uv_index;
  const humidity = current.relative_humidity_2m;

  const isRaining =
    (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || precip > 0.2;
  const isThunderstorm = code >= 95;
  const isSnowing = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isFoggy = code === 45 || code === 48;
  const isVeryHot = temp >= 30;
  const isHot = temp >= 26 && temp < 30;
  const isMild = temp >= 16 && temp < 26;
  const isCool = temp >= 8 && temp < 16;
  const isCold = temp >= 0 && temp < 8;
  const isFreezing = temp < 0;
  const isWindy = wind >= 35;
  const isVeryWindy = wind >= 55;

  const recommendations: AdviceItem[] = [];

  // 1. Wardrobe & Gear
  if (isThunderstorm) {
    recommendations.push({
      id: 'gear-storm',
      category: 'Wardrobe & Gear',
      headline: 'Storm Defense Gear',
      advice: 'Wear waterproof footwear and a hooded storm jacket; avoid metal umbrellas outdoors during active lightning.',
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
      level: 'alert',
    });
  } else if (isRaining) {
    recommendations.push({
      id: 'gear-rain',
      category: 'Wardrobe & Gear',
      headline: 'Bring an Umbrella & Raincoat',
      advice: 'Precipitation is actively occurring or imminent. Keep a compact umbrella on hand and wear water-repellent footwear.',
      icon: <Umbrella className="w-5 h-5 text-sky-400" />,
      level: 'caution',
    });
  } else if (isSnowing) {
    recommendations.push({
      id: 'gear-snow',
      category: 'Wardrobe & Gear',
      headline: 'Thermal Boots & Winter Coat',
      advice: 'Snowfall detected. Insulated boots with high-traction soles, thermal gloves, and a wind-resistant coat are recommended.',
      icon: <Snowflake className="w-5 h-5 text-cyan-300" />,
      level: 'caution',
    });
  } else if (isFreezing || isCold) {
    recommendations.push({
      id: 'gear-cold',
      category: 'Wardrobe & Gear',
      headline: 'Wear Heavy Layers',
      advice: isFreezing
        ? 'Subfreezing temperatures. Bundle up with thermal base layers, an insulated down parka, scarf, and fleece-lined gloves.'
        : 'Chilly atmospheric conditions. Layer a warm sweater or fleece beneath an insulated outer jacket.',
      icon: <Shirt className="w-5 h-5 text-indigo-400" />,
      level: 'caution',
    });
  } else if (isVeryHot) {
    recommendations.push({
      id: 'gear-heat',
      category: 'Wardrobe & Gear',
      headline: 'Lightweight Breathable Apparel',
      advice: 'Opt for loose-fitting, light-colored natural linen or moisture-wicking fabrics, UV-rated sunglasses, and a wide-brim hat.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      level: 'info',
    });
  } else if (isCool) {
    recommendations.push({
      id: 'gear-cool',
      category: 'Wardrobe & Gear',
      headline: 'Light Jacket or Cardigan',
      advice: 'Crisp temperature profile. A denim jacket, knit cardigan, or light windbreaker will keep you comfortably balanced.',
      icon: <Shirt className="w-5 h-5 text-teal-400" />,
      level: 'info',
    });
  } else {
    recommendations.push({
      id: 'gear-mild',
      category: 'Wardrobe & Gear',
      headline: 'Comfortable Everyday Wear',
      advice: 'Pleasant equilibrium. Standard casual clothing like cotton shirts or light layers is suitable for all-day comfort.',
      icon: <Shirt className="w-5 h-5 text-emerald-400" />,
      level: 'optimal',
    });
  }

  // 2. Health & Comfort / UV & Hydration
  if (isVeryHot) {
    recommendations.push({
      id: 'health-heat',
      category: 'Health & Safety',
      headline: 'Stay Hydrated & Wear Sunscreen',
      advice: 'Temperature is above 30°C. Drink electrolyte-rich fluids frequently, seek air-conditioned shade, and apply broad-spectrum SPF 30+.',
      icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
      level: 'alert',
    });
  } else if (uv >= 6) {
    recommendations.push({
      id: 'health-uv',
      category: 'Health & Safety',
      headline: 'High UV Radiation Warning',
      advice: `UV index is currently ${uv.toFixed(1)}. Reapply sunscreen every 2 hours and minimize unprotected sun exposure between 10 AM and 4 PM.`,
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      level: 'caution',
    });
  } else if (isFreezing) {
    recommendations.push({
      id: 'health-freeze',
      category: 'Health & Safety',
      headline: 'Frostbite & Wind-Chill Awareness',
      advice: 'Protect exposed skin to prevent rapid heat loss. Take periodic indoor warm-up breaks if remaining outdoors.',
      icon: <HeartPulse className="w-5 h-5 text-cyan-400" />,
      level: 'caution',
    });
  } else if (humidity < 25) {
    recommendations.push({
      id: 'health-dry',
      category: 'Health & Safety',
      headline: 'Low Moisture / Hydration Alert',
      advice: 'Atmospheric air is dry. Keep water at hand and consider applying moisturizer or lip balm to prevent chapping.',
      icon: <HeartPulse className="w-5 h-5 text-sky-400" />,
      level: 'info',
    });
  } else {
    recommendations.push({
      id: 'health-nominal',
      category: 'Health & Safety',
      headline: 'Comfortable Thermal Index',
      advice: 'Diurnal physiological stress is minimal. Air quality and temperature are in a comfortable equilibrium.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      level: 'optimal',
    });
  }

  // 3. Transit & Commute
  if (isThunderstorm) {
    recommendations.push({
      id: 'commute-storm',
      category: 'Transit & Commute',
      headline: 'Expect Severe Delays & Poolings',
      advice: 'Flash pooling on roads and abrupt gusts possible. Avoid non-essential highway travel and maintain generous vehicle following distance.',
      icon: <Car className="w-5 h-5 text-purple-400" />,
      level: 'alert',
    });
  } else if (isSnowing || isFreezing) {
    recommendations.push({
      id: 'commute-ice',
      category: 'Transit & Commute',
      headline: 'Hazardous Black Ice & Slush',
      advice: 'Braking distances are substantially prolonged. Exercise caution over bridges and highway overpasses.',
      icon: <Car className="w-5 h-5 text-cyan-300" />,
      level: 'alert',
    });
  } else if (isRaining) {
    recommendations.push({
      id: 'commute-rain',
      category: 'Transit & Commute',
      headline: 'Expect Traffic & Wet Surfaces',
      advice: 'Road surfaces have reduced friction. Anticipate rush-hour slowdowns, allow 15–20 minutes extra travel buffer, and engage headlights.',
      icon: <Car className="w-5 h-5 text-sky-400" />,
      level: 'caution',
    });
  } else if (isFoggy) {
    recommendations.push({
      id: 'commute-fog',
      category: 'Transit & Commute',
      headline: 'Dense Fog: Use Low Beams',
      advice: 'Horizontal visibility is significantly curtailed. Switch on fog lights or low-beam headlamps; avoid high beams which reflect glare.',
      icon: <Car className="w-5 h-5 text-slate-400" />,
      level: 'caution',
    });
  } else if (isVeryWindy || isWindy) {
    recommendations.push({
      id: 'commute-wind',
      category: 'Transit & Commute',
      headline: 'Gusty Crosswinds on Bridges',
      advice: `Surface gusts reaching ${wind} km/h. High-profile vehicles and cyclists should exercise heightened vigilance on elevated roadways.`,
      icon: <Wind className="w-5 h-5 text-amber-400" />,
      level: 'caution',
    });
  } else {
    recommendations.push({
      id: 'commute-clear',
      category: 'Transit & Commute',
      headline: 'Optimal Driving Conditions',
      advice: 'Clear road corridors with high visibility and dry pavement. Transit and road networks operating under normal conditions.',
      icon: <Car className="w-5 h-5 text-emerald-400" />,
      level: 'optimal',
    });
  }

  // 4. Outdoor Activities
  if (isThunderstorm || isSnowing || (isRaining && precip > 2)) {
    recommendations.push({
      id: 'outdoor-poor',
      category: 'Outdoor Activities',
      headline: 'Indoor Sessions Strongly Advised',
      advice: 'Inclement weather makes prolonged outdoor running, cycling, or recreational sports unfavorable today.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      level: 'caution',
    });
  } else if (isVeryHot) {
    recommendations.push({
      id: 'outdoor-heat',
      category: 'Outdoor Activities',
      headline: 'Schedule Early Morning Workouts',
      advice: 'Shift high-intensity cardio or endurance runs to early morning or late dusk to prevent heat exhaustion.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      level: 'caution',
    });
  } else if (isMild && !isRaining && !isWindy) {
    recommendations.push({
      id: 'outdoor-prime',
      category: 'Outdoor Activities',
      headline: 'Prime Window for Outdoors',
      advice: 'Atmospheric conditions are ideal for outdoor running, cycling, park walks, and alfresco dining.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      level: 'optimal',
    });
  } else {
    recommendations.push({
      id: 'outdoor-fair',
      category: 'Outdoor Activities',
      headline: 'Moderate Outdoor Suitability',
      advice: 'Outdoor activities are viable with proper layer management. Monitor changing evening conditions.',
      icon: <Lightbulb className="w-5 h-5 text-cyan-400" />,
      level: 'info',
    });
  }

  const getLevelBorder = (level: AdviceItem['level']) => {
    switch (level) {
      case 'alert':
        return 'border-rose-900/60 bg-rose-950/20';
      case 'caution':
        return 'border-amber-900/60 bg-amber-950/20';
      case 'optimal':
        return 'border-emerald-900/50 bg-emerald-950/20';
      case 'info':
      default:
        return 'border-slate-800/80 bg-slate-900/60';
    }
  };

  const getLevelBadgeText = (level: AdviceItem['level']) => {
    switch (level) {
      case 'alert':
        return 'text-rose-400';
      case 'caution':
        return 'text-amber-400';
      case 'optimal':
        return 'text-emerald-400';
      case 'info':
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md p-5 sm:p-6 space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Weather Intelligence & Recommendations
            </h2>
            <p className="text-xs text-slate-400">
              Contextual meteorological guidance calibrated to current live observations
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Real-time Synthesis</span>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <span className="text-cyan-400 font-medium">4 Contextual Vectors</span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:bg-slate-900/80 ${getLevelBorder(
              item.level
            )}`}
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-400 font-medium">
                  {item.category}
                </span>
                <span
                  className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${getLevelBadgeText(
                    item.level
                  )}`}
                >
                  {item.level}
                </span>
              </div>

              {/* Icon & Headline */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {item.headline}
                </h3>
              </div>

              {/* Advice Prose */}
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {item.advice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
