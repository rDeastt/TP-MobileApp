import axios from 'axios';

/**
 * Clima actual aproximado sin permisos de ubicación:
 * - https://ipapi.co (geolocalización por IP, gratuita)
 * - https://open-meteo.com (pronóstico, gratuito, sin key)
 */

export interface OutdoorInfo {
  city: string | null;
  temperature: number;
  windSpeed: number;
  /** Código WMO de Open-Meteo. */
  code: number;
  isDay: boolean;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string | null;
}

/** Geolocalización por IP con proveedores de respaldo (ambos gratuitos, HTTPS). */
const getApproxLocation = async (): Promise<GeoLocation> => {
  // Proveedor 1: ipwho.is
  try {
    const { data } = await axios.get('https://ipwho.is/', { timeout: 7000 });
    if (data?.success !== false && data?.latitude && data?.longitude) {
      return { latitude: data.latitude, longitude: data.longitude, city: data.city ?? null };
    }
  } catch {}

  // Proveedor 2: ipapi.co
  try {
    const { data } = await axios.get('https://ipapi.co/json/', { timeout: 7000 });
    if (data?.latitude && data?.longitude) {
      return { latitude: data.latitude, longitude: data.longitude, city: data.city ?? null };
    }
  } catch {}

  throw new Error('No se pudo estimar tu ubicación');
};

export const getOutdoorInfo = async (): Promise<OutdoorInfo> => {
  const loc = await getApproxLocation();

  const { data: wx } = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      current: 'temperature_2m,weather_code,wind_speed_10m,is_day',
    },
    timeout: 8000,
  });

  const current = wx?.current;
  if (!current) throw new Error('No se pudo obtener el clima');

  return {
    city: loc.city ?? null,
    temperature: Math.round(current.temperature_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    code: current.weather_code,
    isDay: current.is_day === 1,
  };
};

export interface WeatherAdvice {
  emoji: string;
  label: string;
  /** ¿El clima acompaña para salir a caminar? */
  goOutside: boolean;
}

/** Traduce el código WMO a descripción y recomendación. */
export const describeWeather = (info: OutdoorInfo): WeatherAdvice => {
  const { code, temperature, windSpeed, isDay } = info;

  let emoji = '🌤️';
  let label = 'Parcialmente nublado';
  let weatherOk = true;

  if (code === 0) {
    emoji = isDay ? '☀️' : '🌙';
    label = 'Despejado';
  } else if (code <= 3) {
    emoji = '🌤️';
    label = 'Algo nublado';
  } else if (code === 45 || code === 48) {
    emoji = '🌫️';
    label = 'Neblina';
    weatherOk = false;
  } else if (code >= 51 && code <= 67) {
    emoji = '🌧️';
    label = 'Lluvia';
    weatherOk = false;
  } else if (code >= 71 && code <= 77) {
    emoji = '🌨️';
    label = 'Nieve';
    weatherOk = false;
  } else if (code >= 80 && code <= 82) {
    emoji = '🌦️';
    label = 'Chubascos';
    weatherOk = false;
  } else if (code >= 95) {
    emoji = '⛈️';
    label = 'Tormenta';
    weatherOk = false;
  }

  const tempOk = temperature >= 5 && temperature <= 32;
  const windOk = windSpeed < 40;

  return { emoji, label, goOutside: weatherOk && tempOk && windOk };
};
