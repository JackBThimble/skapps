/**
 * @see https://openweathermap.org/api/one-call-api for more details
 */
export interface WeatherService {
  getCurrentWeather: (lat: number, lon: number) => Promise<CurrentWeather>;
  getDailyForecast: (
    lat: number,
    lon: number,
    days?: number,
  ) => Promise<Daily[]>;
  getHourlyForecast: (
    lat: number,
    lon: number,
    hours?: number,
  ) => Promise<Hourly[]>;
  getCompleteWeatherData: (
    lat: number,
    lon: number,
    config?: WeatherApiConfig,
    exclude?: string[]
  ) => Promise<OneCallResponse>;
}
/**
 * Units of measurement
 */
export type UnitSystem = "standard" | "metric" | "imperial";

/**
 * Weather condition icons
 * @see https://openweathermap.org/weather-conditions for more details
 */

export type WeatherIcon =
  | "01d"
  | "01n" // clear sky
  | "02d"
  | "02n" // few clouds
  | "03d"
  | "03n" // scattered clouds
  | "04d"
  | "04n" // broken clouds
  | "09d"
  | "09n" // shower rain
  | "10d"
  | "10n" // rain
  | "11d"
  | "11n" // thunderstorm
  | "13d"
  | "13n" // snow
  | "50d"
  | "50n"; // mist

/**
 * Weather condition information
 */
export type Weather = {
  /** Weather condition id */
  id: number;
  /** Group of weather parameters (Rain, Snow, Clouds etc.)  */
  main: string;
  /** Weather conditions within the group */
  description: string;
  /** Weather icon id */
  icon: WeatherIcon;
};

/**
 * Rain volume for the last 1 hour
 */
export type Rain1hr = { "1h": number };
/**
 * Snow volume for the last 1 hour
 */
export type Snow1hr = { "1h": number };

/**
 * Common weather data properties shared between current and hourly weather data
 */
export type BaseWeatherData = {
  /** Time of the forecasted data, UNIX, UTC */
  dt: number;
  /**
   * Temperature
   * Units -
   *    default: Kelvin
   *    metric: Celsius
   *    imperial: Fahrenheit
   */
  temp: number;
  /**
   * Temperature, this accounts for the human perception of weather
   * Units - default: Kelvin, metric: Celsius, imperial: Fahrenheit
   */
  feels_like: number;
  /** Atmospheric pressure on the sea level (hPa) */
  pressure: number;
  /** Humidity (percentage) */
  humidity: number;
  /**
   * Atmospheric temperature below which
   * water droplets can condense and form
   * dew
   * Units -
   *    default: Kelvin
   *    metric: Celsius
   *    imperial: Fahrenheit
   */
  dew_point: number;
  /** UV index */
  uvi: number;
  /** Cloudiness (percentage) */
  clouds: number;
  /** Average visibility (meters, max of 10km) */
  visibility: number;
  /**
   * Wind speed
   * Units -
   *    default: meter/sec
   *    metric: meter/sec
   *    imperial: miles/hour
   */
  wind_speed: number;
  /** Wind direction */
  wind_deg: number;
  /**
   * Wind gust
   * Units -
   *    default: meter/sec
   *    metric: meter/sec
   *    imperial: miles/hour
   */
  wind_gust?: number;
};

export type CurrentWeather = BaseWeatherData & {
  /**
   * Sunrise time, UNIX, UTC
   * (For polar areas in midnight sun and
   * polar night periods this parameter
   * is not returned in the response)
   */
  sunrise?: number;
  /**
   * Sunset time, UNIX, UTC
   * (For polar areas in midnight sun and
   * polar night periods this parameter
   * is not returned in the response)
   */
  sunset?: number;
  /** Rain volume for the last hour */
  rain?: Rain1hr;
  /** Snow volume for the last hour */
  snow?: Snow1hr;
  /** Weather conditions details */
  weather: Weather[];
};

/**
 * Hourly weather data
 */
export type Hourly = BaseWeatherData & {
  /** Probability of precipitation */
  pop: number;
  /** Rain volume for the last hour */
  rain?: Rain1hr;
  /** Snow volume for the last hour */
  snow?: Snow1hr;
  /** Weather conditions details */
  weather: Weather[];
};

/**
 * Minutely weather data
 */
export type Minutely = {
  /** Time of the forecasted data, UNIX, UTC */
  dt: number;
  /** Precipitation volume, mm/hr */
  precipitation: number;
};

/**
 * Temperature details for daily forecast
 */
export type DayTemp = {
  /** Day temperature */
  day: number;
  /** Minimum temperature for day */
  min: number;
  /** Maximum temperature for day */
  max: number;
  /** Night temperature */
  night: number;
  /** Evening temperature */
  eve: number;
  /** Morning temperature */
  morn: number;
};

/**
 * Feels like temperature details for daily forecast
 */
export type DayFeelsLike = {
  /** Day feels like temperature*/
  day: number;
  /** Night feels like temperature */
  night: number;
  /** Evening feels like temperature */
  eve: number;
  /** Morning feels like temperature */
  morn: number;
};

/**
 * Daily forecast data
 */
export type Daily = {
  /**
   * Time of the forecasted data
   *  UNIX, UTC
   */
  dt: number;
  /**
   * Sunrise time
   * UNIX, UTC
   * (For polar areas in midnight sun and
   * polar night periods this parameter
   * is not returned in the response)
   */
  sunrise?: number;
  /**
   * Sunset time
   * UNIX, UTC
   * (For polar areas in midnight sun and
   * polar night periods this parameter
   * is not returned in the response)
   */
  sunset?: number;
  /**
   * Moonrise time
   * UNIX, UTC
   */
  moonrise: number;
  /**
   * Moonset time
   * UNIX, UTC
   */
  moonset: number;
  /** Moon phase */
  moon_phase: number;
  /** Temperature details */
  temp: DayTemp;
  /** Feels like details */
  feels_like: DayFeelsLike;
  /**
   * Atmospheric pressure on the sea
   * level, hPa
   */
  pressure: number;
  /** Humidity */
  humidity: number;
  /**
   * Atmospheric temperature below which
   * water droplets can condense and form
   * dew
   * Units -
   *    default: Kelvin
   *    metric: Celsius
   *    imperial: Fahrenheit
   */
  dew_point: number;
  /**
   * Wind speed
   * Units -
   *     default: meter/sec
   *     metric: meter/sec
   *     imperial: miles/hour
   */
  wind_speed: number;
  /** Wind direction (degrees) */
  wind_deg: number;
  /**
   * Wind gusts
   * Units -
   *     default: meter/sec
   *     metric: meter/sec
   *     imperial: miles/hour
   */
  wind_gust?: number;
  /** Weather conditions details */
  weather: Weather[];
  /** Cloudiness (percent) */
  clouds: number;
  /** Probability of precipitation */
  pop: number;
  /** Rain volume */
  rain?: number;
  /** Snow volume */
  snow?: number;
  /** UV index */
  uvi: number;
};

export type Alert = {
  /** Name of the alert source */
  sender_name: string;
  /** Alert event name */
  event: string;
  /**
   * Date and time of the start of the
   * alert event
   * UNIX, UTC
   */
  start: number;
  /**
   * Date and time of the end of the
   * alert event
   * UNIX, UTC
   */
  end: number;
  /** Description of the alert  */
  description: string;
  /** Type of severe weather */
  tags: string[];
};

/**
 * OpenWeatherMap One Call API response
 * Contains current weather, minute
 * forecast for 1 hour, hourly forecast for
 * 48 hours, daily forecast for 7 days and
 * government weather alerts
 */
export interface OneCallResponse<Unit extends UnitSystem = "standard"> {
  /** Geographical coordinates of the location (latitude) */
  lat: number;
  /** Geographical coordinates of the location (longitude) */
  lon: number;
  /** Timezone name for the requested location */
  timezone: string;
  /** Shift in seconds from UTC */
  timezone_offset: number;
  /** Current weather data */
  current: CurrentWeather;
  /** Minute forecast weather data */
  minutely?: Minutely[];
  /** Hourly forecast weather data */
  hourly?: Hourly[];
  /** Daily forecast weather data */
  daily?: Daily[];
  /** National weather alerts data */
  alerts?: Alert[];
}

/**
 * API error response
 * @see https://openweathermap.org/api/one-call-api#errors
 */
export interface WeatherApiError {
  /** Error code */
  cod: number;
  /** Error message */
  message: string;
}

/**
 * function to check if the response is an error
 */
export function isWeatherApiError(response: any) {
  return (
    response &&
    typeof response === "object" &&
    "cod" in response &&
    "message" in response
  );
}

export interface WeatherApiConfig {
  apiKey?: string;
  baseUrl?: string;
  units?: UnitSystem;
  lang?: string;
}
