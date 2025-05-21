import { z } from "zod";
import { GeocodingResponseSchema, GeocodingZIPResponseSchema } from "./schemas";
import type { GeocodingResponse, GeocodingConfig } from "./types";
import { POSTAL_CODE_PATTERNS } from "./types";

/**
 * Error class for geocoding service errors
 */
export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

/**
 * OpenWeatherMap Geocoding Service
 */
export function createGeocodingService(config: GeocodingConfig) {
  // Validate config
  if (!config.apiKey) {
    throw new GeocodingError("API key is required");
  }

  const baseUrl = config.baseUrl || "https://api.openweathermap.org/geo/1.0/";

  /**
   * Generic method to fetch geocoding data from a URL
   * @param url The URL to fetch data from
   * @returns Promise with geocoding data
   */
  async function fetchGeocodingData(url: string): Promise<unknown> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new GeocodingError(
          `API request failed with status: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new GeocodingError("No results found");
      }

      return data;
    } catch (error) {
      if (error instanceof GeocodingError) {
        throw error;
      }
      throw new GeocodingError(
        `Geocoding request failed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Parse location input and get coordinates
   * @param input User input string (ZIP code, city name, city + state, city + country)
   * @returns Promise with coordinates
   */
  async function getCoordinates(input: string): Promise<GeocodingResponse> {
    input = input.trim();

    if (!input) {
      throw new GeocodingError("Please enter a location");
    }

    // Check if input appears to be a postal code with optional country code
    // Format: [postal code] [country code] or [postal code],[country code]
    const postalCodeWithCountryRegex = /^([A-Z0-9\s-]+)(?:[\s,]+([A-Z]{2}))?$/i;
    const postalCodeMatch = input.match(postalCodeWithCountryRegex);

    if (postalCodeMatch) {
      const [, potentialPostalCode, countryCode = "US"] = postalCodeMatch;

      // Check if the postal code format matches the country pattern
      const pattern =
        POSTAL_CODE_PATTERNS[countryCode.toUpperCase()] ||
        POSTAL_CODE_PATTERNS.DEFAULT;

      if (pattern.test(potentialPostalCode.trim())) {
        return getCoordinatesByZipCode(
          potentialPostalCode.trim(),
          countryCode.toUpperCase(),
        );
      }
    }

    // Check for common separators in the input
    const parts = input.split(/,\s*|\s+/);
    // If we have multiple parts, try to determine the format
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];

      // Check if the last part is a country code (2 letters)
      if (/^[A-Z]{2}$/i.test(lastPart)) {
        // If the second-to-last part is a US state code and country is US
        if (
          parts.length >= 3 &&
          /^[A-Z]{2}$/i.test(parts[parts.length - 2]) &&
          lastPart.toUpperCase() === "US"
        ) {
          const city = parts.slice(0, parts.length - 2).join(" ");
          const state = parts[parts.length - 2];
          return getCoordinatesByCityAndState(city, state);
        }
        // Otherwise treat as city and country
        const city = parts.slice(0, parts.length - 1).join(" ");
        return getCoordinatesByCityAndCountry(city, lastPart);
      }

      // Check if second part might be a US state code (2 letters)
      if (parts.length === 2 && /^[A-Z]{2}$/i.test(parts[1])) {
        return getCoordinatesByCityAndState(parts[0], parts[1]);
      }
    }

    // Default to direct geocoding with the input as a query
    return getCoordinatesByQuery(input, 1);
  }

  /**
   * Get coordinates by ZIP/postal code
   * @param zipCode The ZIP/postal code
   * @param countryCode Optional ISO 3166 country code
   * @returns Promise with coordinates
   */
  async function getCoordinatesByZipCode(
    zipCode: string,
    countryCode = "US",
  ): Promise<GeocodingResponse> {
    const url = `${baseUrl}zip?zip=${zipCode},${countryCode}&appid=${config.apiKey}`;
    const response = await fetchGeocodingData(url);

    try {
      const validatedData = GeocodingZIPResponseSchema.parse(response);

      // Convert to standard format
      return {
        name: validatedData.name,
        lat: validatedData.lat,
        lon: validatedData.lon,
        country: validatedData.country,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new GeocodingError(`Invalid response format: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Determines if the input string resembles a postal code for the given country
   * @param input The input string to check
   * @param countryCode The ISO 3166 country code to check
   * @returns Boolean indicating if the input matches the postal code pattern
   */
  function isPostalCode(input: string, countryCode = "US"): boolean {
    const pattern =
      POSTAL_CODE_PATTERNS[countryCode.toUpperCase()] ||
      POSTAL_CODE_PATTERNS.DEFAULT;
    return pattern.test(input.trim());
  }

  /**
   * Get coordinates by city name and state code (primarily for US locations)
   * @param city The city name
   * @param stateCode The state code (e.g., NY, CA)
   * @param countryCode Optional ISO 3166 country code
   * @returns Promise with coordinates
   */
  async function getCoordinatesByCityAndState(
    city: string,
    stateCode: string,
    countryCode = "US",
  ): Promise<GeocodingResponse> {
    const query = `${city},${stateCode},${countryCode}`;
    return getCoordinatesByQuery(query);
  }

  /**
   * Get coordinates by city name and country code
   * @param city The city name
   * @param countryCode ISO 3166 countryCode
   * @param limit Optional limit for number of results
   * @returns Promise with coordinates
   */
  async function getCoordinatesByCityAndCountry(
    city: string,
    countryCode: string,
  ): Promise<GeocodingResponse> {
    const query = `${city},${countryCode}`;
    return getCoordinatesByQuery(query);
  }

  /**
   * Get coordinates by generic location query
   * @param query The location query string
   * @param limit Optional limit for number of results
   * @returns Promise with coordinates
   */
  async function getCoordinatesByQuery(
    query: string,
    limit: number = 1,
  ): Promise<GeocodingResponse> {
    const url = `${baseUrl}direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${config.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new GeocodingError(
        `API request failed with status: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new GeocodingError(`No results found for query: ${query}`);
    }

    try {
      // Validate the first result with Zod schema
      return GeocodingResponseSchema.parse(data[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new GeocodingError(`Invalid response format: ${error.message}`);
      }
      throw error;
    }
  }

  return {
    getCoordinates,
    isPostalCode,
  };
}
