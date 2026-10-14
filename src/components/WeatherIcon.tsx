import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  Moon,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  iconName: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className = 'w-6 h-6', ...props }) => {
  switch (iconName) {
    case 'Sun':
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
    case 'SunMedium':
      return <SunMedium className={`text-amber-400 ${className}`} {...props} />;
    case 'Moon':
      return <Moon className={`text-indigo-300 ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`text-amber-300 ${className}`} {...props} />;
    case 'CloudMoon':
      return <CloudMoon className={`text-indigo-200 ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`text-slate-300 ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-sky-400 ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`text-blue-400 ${className}`} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={`text-cyan-200 ${className}`} {...props} />;
    case 'CloudHail':
      return <CloudHail className={`text-teal-300 ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-violet-400 ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`text-cyan-200 ${className}`} {...props} />;
    default:
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
  }
};
