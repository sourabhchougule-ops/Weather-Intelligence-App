import { WeatherCondition, TemperatureUnit } from '../types/weather';

export const WMO_WEATHER_CODES: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Cloudless atmospheric conditions with high visibility',
    iconName: 'Sun',
    category: 'clear',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Scattered high cirrus clouds, mostly sunny',
    iconName: 'SunMedium',
    category: 'clear',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Alternating sun and cloud formations',
    iconName: 'CloudSun',
    category: 'cloudy',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Continuous dense cloud deck obstructing sunlight',
    iconName: 'Cloud',
    category: 'cloudy',
  },
  45: {
    code: 45,
    label: 'Fog',
    description: 'Ground-level cloud reducing horizontal visibility',
    iconName: 'CloudFog',
    category: 'fog',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Supercooled water droplets freezing onto surfaces',
    iconName: 'CloudFog',
    category: 'fog',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine liquid precipitation drops close together',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady fine mist with dampened road surfaces',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy micro-droplets reducing visibility',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Liquid drops freezing instantaneously on contact',
    iconName: 'CloudSnow',
    category: 'snow',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Subfreezing precipitation with rapid ice accretion',
    iconName: 'CloudSnow',
    category: 'snow',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Intermittent gentle rainfall',
    iconName: 'CloudRain',
    category: 'rain',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Sustained precipitation with moderate accumulation',
    iconName: 'CloudRain',
    category: 'rain',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Intense rain event with significant water runoff',
    iconName: 'CloudRain',
    category: 'rain',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Rain falling through cold layer creating black ice',
    iconName: 'CloudHail',
    category: 'rain',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Hazardous glazing ice storm conditions',
    iconName: 'CloudHail',
    category: 'rain',
  },
  71: {
    code: 71,
    label: 'Slight Snowfall',
    description: 'Light crystalline ice flakes with minor dusting',
    iconName: 'Snowflake',
    category: 'snow',
  },
  73: {
    code: 73,
    label: 'Moderate Snowfall',
    description: 'Steady accumulation of snow flakes',
    iconName: 'Snowflake',
    category: 'snow',
  },
  75: {
    code: 75,
    label: 'Heavy Snowfall',
    description: 'Intense blizzard-like snow conditions with reduced visibility',
    iconName: 'Snowflake',
    category: 'snow',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Opaque white grains of ice resembling miniature snow pellets',
    iconName: 'Snowflake',
    category: 'snow',
  },
  80: {
    code: 80,
    label: 'Slight Showers',
    description: 'Brief, localized rainfall bursts',
    iconName: 'CloudRain',
    category: 'rain',
  },
  81: {
    code: 81,
    label: 'Moderate Showers',
    description: 'Periodic heavy passing rain showers',
    iconName: 'CloudRain',
    category: 'rain',
  },
  82: {
    code: 82,
    label: 'Violent Showers',
    description: 'Torrential downpours from convective cloud clusters',
    iconName: 'CloudRain',
    category: 'rain',
  },
  85: {
    code: 85,
    label: 'Light Snow Showers',
    description: 'Passing flurries with rapid clearing intervals',
    iconName: 'Snowflake',
    category: 'snow',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Convective snow squalls with sudden accumulation',
    iconName: 'Snowflake',
    category: 'snow',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Electrical activity with lightning and thunder',
    iconName: 'CloudLightning',
    category: 'storm',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Convective storm cell with localized hail deposits',
    iconName: 'CloudLightning',
    category: 'storm',
  },
  99: {
    code: 99,
    label: 'Severe Hail Thunderstorm',
    description: 'Severe storm with damaging hail stones and strong winds',
    iconName: 'CloudLightning',
    category: 'storm',
  },
};

export function getWeatherCondition(code: number, isDay: number = 1): WeatherCondition {
  const match = WMO_WEATHER_CODES[code];
  if (!match) {
    return {
      code,
      label: 'Atmospheric Activity',
      description: 'Variable meteorological conditions',
      iconName: isDay ? 'Sun' : 'Moon',
      category: 'clear',
    };
  }

  // Adjust icons for nighttime clear/cloudy conditions
  if (!isDay && (code === 0 || code === 1)) {
    return {
      ...match,
      label: code === 0 ? 'Clear Night' : 'Mostly Clear Night',
      iconName: 'Moon',
    };
  }
  if (!isDay && code === 2) {
    return {
      ...match,
      label: 'Partly Cloudy Night',
      iconName: 'CloudMoon',
    };
  }

  return match;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTemperatureValue(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): { value: number; unitStr: string } {
  if (unit === 'fahrenheit') {
    // Return in mph
    return {
      value: Math.round(kmh * 0.621371 * 10) / 10,
      unitStr: 'mph',
    };
  }
  return {
    value: Math.round(kmh * 10) / 10,
    unitStr: 'km/h',
  };
}

export function getWindDirection(deg: number): { compass: string; degrees: number } {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return {
    compass: directions[index],
    degrees: deg,
  };
}

export function getUVRating(uv: number): { label: string; risk: string; color: string } {
  if (uv <= 2) {
    return { label: 'Low', risk: 'Minimal protection required for average exposure.', color: 'text-emerald-400' };
  } else if (uv <= 5) {
    return { label: 'Moderate', risk: 'Take precautions; wear sunglasses and SPF 30+.', color: 'text-amber-400' };
  } else if (uv <= 7) {
    return { label: 'High', risk: 'Protection essential; seek shade during midday hours.', color: 'text-orange-400' };
  } else if (uv <= 10) {
    return { label: 'Very High', risk: 'Extra protection needed; avoid prolonged direct sun.', color: 'text-rose-400' };
  }
  return { label: 'Extreme', risk: 'Take all precautions; unprotected skin damages quickly.', color: 'text-purple-400' };
}

export function getHumidityRating(rh: number): { label: string; desc: string } {
  if (rh < 30) {
    return { label: 'Arid / Dry', desc: 'Low moisture content, dry air perception' };
  } else if (rh <= 60) {
    return { label: 'Comfortable', desc: 'Optimal relative humidity for comfort' };
  } else if (rh <= 75) {
    return { label: 'Humid', desc: 'Noticeable moisture in the atmosphere' };
  }
  return { label: 'Very Humid', desc: 'Dense water vapor saturation' };
}

export function getPressureRating(hPa: number): { label: string; desc: string } {
  if (hPa < 1005) {
    return { label: 'Low Pressure', desc: 'Unsettled weather system, potential precipitation' };
  } else if (hPa <= 1020) {
    return { label: 'Normal Pressure', desc: 'Stable atmospheric equilibrium' };
  }
  return { label: 'High Pressure', desc: 'Dense air mass, clear calm skies' };
}
