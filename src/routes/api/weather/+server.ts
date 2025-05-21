import { json, type RequestHandler } from "@sveltejs/kit";
import { createWeatherService } from "$lib/services/weather";
import type {
  UnitSystem,
  WeatherApiConfig,
  WeatherService,
  OneCallResponse,
  CurrentWeather,
  Daily,
  Hourly,
  WeatherApiError,
} from "$lib/services/weather/types";
import { isWeatherApiError } from "$lib/services/weather/types";

const VITE_OPENWEATHER_API_KEY = process.env["VITE_OPENWEATHER_API_KEY"];
export const GET: RequestHandler = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const query = url.searchParams.get("q");
  if (!lat || !lon) {
    return json(
      { error: "Missing latitude or longitude parameters" },
      { status: 400 },
    );
  }
  if (!query) {
    return json({ error: "Missing query parameter" }, { status: 400 });
  }
  const units: UnitSystem = (url.searchParams.get("units") ||
    "imperial") as UnitSystem;
  const config: WeatherApiConfig = {
    apiKey: VITE_OPENWEATHER_API_KEY,
    units: units,
    lang: url.searchParams.get("lang") || "en",
  };

  try {
    const weatherService: WeatherService = createWeatherService(config);
    if (!weatherService) {
      return json({
        error: "Failed to initialize weather service",
        status: 500,
      });
    }
    let weather:
      | OneCallResponse
      | CurrentWeather
      | Daily[]
      | Hourly[]
      | undefined;
    switch (query) {
      case "all":
        weather = await weatherService.getCompleteWeatherData(+lat, +lon);
        break;
      case "current":
        weather = await weatherService.getCurrentWeather(+lat, +lon);
        break;
      case "daily":
        weather = await weatherService.getDailyForecast(+lat, +lon);
      case "hourly":
        weather = await weatherService.getHourlyForecast(+lat, +lon);
        break;
      default:
        weather = await weatherService.getCompleteWeatherData(+lat, +lon);
        break;
    }
    return json(weather);
  } catch (error) {
    console.error("Weather API error:", error);
    return json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
};
