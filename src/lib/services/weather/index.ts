import {
  type OneCallResponse,
  type UnitSystem,
  type WeatherApiError,
  isWeatherApiError,
  type WeatherApiConfig,
  type CurrentWeather,
  type Daily,
  type Hourly,
  type WeatherService } from "./types";

/**
 * Default configuration for the Weather API
 */
const defaultConfig: WeatherApiConfig = {
  apiKey: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
  baseUrl: "https://api.openweathermap.org/data/3.0/onecall",
  units: "metric",
  lang: "en",
};



export const createWeatherService =(config: WeatherApiConfig = defaultConfig):WeatherService => {
    const cwsConfig = {
      ...defaultConfig, ...config
    };
/**
 * Fetches weather data from the OpenWeatherMap One Call API
 */
const fetchWeatherData = async (
  lat: number,
  lon: number,
  config = cwsConfig,
  exclude?: string[],
): Promise<OneCallResponse> => {
  const excludeParams = exclude?.length ? `&exclude=${exclude.join(",")}` : "";
  const url = `${config.baseUrl}?lat=${lat}&lon=${lon}&units=${
    config.units
  }&lang=${config.lang}${excludeParams}&appid=${config.apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = (await response.json()) as WeatherApiError;
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (isWeatherApiError(data)) {
      throw new Error(`API Error: ${data.message}`);
    }

    return data as OneCallResponse;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Gets current weather for specified coordinates
 */
const getCurrentWeather = async (
  lat: number,
  lon: number,
  config = cwsConfig,
): Promise<CurrentWeather> => {
  const data = await fetchWeatherData(lat, lon, config, [
    "minutely",
    "hourly",
    "daily",
    "alerts",
  ]);
  return data.current;
};

/**
 * Gets daily forecast for specified coordinates
 */
const getDailyForecast = async (
  lat: number,
  lon: number,
  days = 7,
  config = cwsConfig,
): Promise<Daily[]> => {
  const data = await fetchWeatherData(lat, lon, config, [
    "current",
    "minutely",
    "hourly",
    "alerts",
  ]);
  return data.daily ? data.daily.slice(0, days) : [];
};

/**
 * Gets hourly forecast data for specified coordinates
 */
const getHourlyForecast = async (
  lat: number,
  lon: number,
  hours = 24,
  config = cwsConfig,
): Promise<Hourly[]> => {
  const data = await fetchWeatherData(lat, lon, config, [
    "current",
    "minutely",
    "daily",
    "alerts",
  ]);
  return data.hourly ? data.hourly.slice(0, hours) : [];
};

/**
 * Gets complete weather data for specified coordinates
 */
const getCompleteWeatherData = async (
  lat: number,
  lon: number,
  config = cwsConfig,
  exclude?: string[]
): Promise<OneCallResponse> => {
  return fetchWeatherData(lat, lon, config, exclude);
};
  return {
    getCurrentWeather,
    getDailyForecast,
    getHourlyForecast,
    getCompleteWeatherData
  }
}
